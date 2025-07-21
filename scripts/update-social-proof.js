const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.CONSULTING_PAT
});

async function updateSocialProof() {
  try {
    // Get all submissions
    const submissions = await getAllSubmissions();
    
    // Calculate statistics
    const stats = calculateStats(submissions);
    
    // Get recent submissions
    const recentSubmissions = getRecentSubmissions(submissions);
    
    // Prepare social proof data
    const socialProofData = {
      statistics: stats,
      recentSubmissions: recentSubmissions,
      lastUpdated: new Date().toISOString()
    };
    
    // Update social proof file
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_REPOSITORY.split('/')[0],
      repo: process.env.GITHUB_REPOSITORY.split('/')[1],
      path: 'consulting-data/social-proof/public.json',
      message: 'Update social proof data',
      content: Buffer.from(JSON.stringify(socialProofData, null, 2)).toString('base64')
    });
    
    console.log('Social proof data updated successfully');
  } catch (error) {
    console.error('Error updating social proof:', error);
    throw error;
  }
}

async function getAllSubmissions() {
  const { data } = await octokit.repos.getContent({
    owner: process.env.GITHUB_REPOSITORY.split('/')[0],
    repo: process.env.GITHUB_REPOSITORY.split('/')[1],
    path: 'consulting-data/submissions'
  });
  
  const submissions = [];
  for (const file of data) {
    if (file.type === 'file' && file.name.endsWith('.json')) {
      const { data: content } = await octokit.repos.getContent({
        owner: process.env.GITHUB_REPOSITORY.split('/')[0],
        repo: process.env.GITHUB_REPOSITORY.split('/')[1],
        path: file.path
      });
      
      const submission = JSON.parse(Buffer.from(content.content, 'base64').toString());
      submissions.push(submission);
    }
  }
  
  return submissions;
}

function calculateStats(submissions) {
  const totalHelped = submissions.length;
  const responded = submissions.filter(s => s.response).length;
  const responseRate = (responded / totalHelped) * 100;
  
  const ratings = submissions
    .filter(s => s.rating)
    .map(s => s.rating);
  
  const averageRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;
    
  return {
    totalHelped,
    responseRate,
    averageRating
  };
}

function getRecentSubmissions(submissions) {
  return submissions
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
    .map(s => ({
      id: s.id,
      helpType: s.helpType,
      timestamp: s.timestamp,
      rating: s.rating,
      responseTime: s.responseTime
    }));
}

// Update social proof data
updateSocialProof()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  }); 