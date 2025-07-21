const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.CONSULTING_PAT
});

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function processSubmission(payload) {
  try {
    // Generate submission ID
    const submissionId = crypto.randomBytes(16).toString('hex');
    
    // Prepare submission data
    const submissionData = {
      id: submissionId,
      timestamp: new Date().toISOString(),
      helpType: payload.helpType,
      email: payload.email,
      estimatedValue: encryptValue(payload.estimatedValue),
      additionalInfo: payload.additionalInfo,
      referral: payload.referral
    };

    // Add making-specific data if applicable
    if (payload.helpType === 'making') {
      submissionData.buildDescription = payload.buildDescription;
      submissionData.audience = payload.audience;
      submissionData.referenceLinks = payload.referenceLinks;
    }

    // Handle file uploads
    if (payload.files && payload.files.length > 0) {
      submissionData.files = await handleFileUploads(payload.files, submissionId);
    }

    // Create submission file
    const submissionPath = `consulting-data/submissions/${submissionId}.json`;
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_REPOSITORY.split('/')[0],
      repo: process.env.GITHUB_REPOSITORY.split('/')[1],
      path: submissionPath,
      message: `Add new consulting submission ${submissionId}`,
      content: Buffer.from(JSON.stringify(submissionData, null, 2)).toString('base64')
    });

    // Send notifications
    await sendNotifications(submissionData);

    return { success: true, submissionId };
  } catch (error) {
    console.error('Error processing submission:', error);
    throw error;
  }
}

function encryptValue(value) {
  // Implement value encryption for privacy
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 24);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encrypted
  };
}

async function handleFileUploads(files, submissionId) {
  const uploadedFiles = [];
  
  for (const file of files) {
    const filePath = `consulting-data/files/${submissionId}/${file.name}`;
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_REPOSITORY.split('/')[0],
      repo: process.env.GITHUB_REPOSITORY.split('/')[1],
      path: filePath,
      message: `Add file for submission ${submissionId}`,
      content: file.content
    });
    uploadedFiles.push(filePath);
  }
  
  return uploadedFiles;
}

async function sendNotifications(submissionData) {
  // Send notification to Andrew
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: 'New Consulting Request',
    text: `New consulting request received:\n\nType: ${submissionData.helpType}\nEmail: ${submissionData.email}`
  });

  // Send confirmation to user
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: submissionData.email,
    subject: 'Your Consulting Request Received',
    text: `Thank you for your consulting request. We'll review it and get back to you within 3 days.`
  });
}

// Process the submission
const payload = JSON.parse(process.argv[2]);
processSubmission(payload)
  .then(result => {
    console.log('Submission processed successfully:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  }); 