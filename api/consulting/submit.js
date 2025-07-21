const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Database initialization
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS consulting_submissions (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(32) UNIQUE NOT NULL,
        help_type VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        estimated_value_encrypted TEXT,
        additional_info TEXT,
        referral VARCHAR(255),
        build_description TEXT,
        audience VARCHAR(50),
        reference_links TEXT,
        files JSONB,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS social_proof (
        id SERIAL PRIMARY KEY,
        total_helped INTEGER DEFAULT 0,
        average_rating DECIMAL(3,2) DEFAULT 0,
        response_rate INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default social proof record if none exists
    await client.query(`
      INSERT INTO social_proof (total_helped, average_rating, response_rate)
      SELECT 0, 0, 0
      WHERE NOT EXISTS (SELECT 1 FROM social_proof)
    `);

  } finally {
    client.release();
  }
}

// Encrypt sensitive data
function encryptValue(value) {
  if (!value) return null;
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 24);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encrypted
  };
}

// Process form submission
async function processSubmission(data) {
  const client = await pool.connect();
  try {
    // Generate submission ID
    const submissionId = crypto.randomBytes(16).toString('hex');
    
    // Prepare submission data
    const submissionData = {
      submission_id: submissionId,
      help_type: data.helpType,
      email: data.email,
      estimated_value_encrypted: data.estimatedValue ? JSON.stringify(encryptValue(data.estimatedValue)) : null,
      additional_info: data.additionalInfo,
      referral: data.referral,
      build_description: data.buildDescription,
      audience: data.audience,
      reference_links: data.referenceLinks,
      files: data.files ? JSON.stringify(data.files) : null
    };

    // Insert into database
    const result = await client.query(`
      INSERT INTO consulting_submissions 
      (submission_id, help_type, email, estimated_value_encrypted, additional_info, referral, build_description, audience, reference_links, files)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [
      submissionData.submission_id,
      submissionData.help_type,
      submissionData.email,
      submissionData.estimated_value_encrypted,
      submissionData.additional_info,
      submissionData.referral,
      submissionData.build_description,
      submissionData.audience,
      submissionData.reference_links,
      submissionData.files
    ]);

    // Send notifications
    await sendNotifications(submissionData);

    return { success: true, submissionId, id: result.rows[0].id };
  } finally {
    client.release();
  }
}

// Send email notifications
async function sendNotifications(submissionData) {
  // Send notification to Andrew
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: 'New Consulting Request',
    html: `
      <h2>New Consulting Request</h2>
      <p><strong>Type:</strong> ${submissionData.help_type}</p>
      <p><strong>Email:</strong> ${submissionData.email}</p>
      <p><strong>Submission ID:</strong> ${submissionData.submission_id}</p>
      ${submissionData.referral ? `<p><strong>Referral:</strong> ${submissionData.referral}</p>` : ''}
      ${submissionData.additional_info ? `<p><strong>Additional Info:</strong> ${submissionData.additional_info}</p>` : ''}
    `
  });

  // Send confirmation to user
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: submissionData.email,
    subject: 'Your Consulting Request Received',
    html: `
      <h2>Thank you for your consulting request!</h2>
      <p>I've received your request and will review it carefully. I'll get back to you within 3 days if I think I can offer something meaningful.</p>
      <p>You'll receive a video reply with either a recommendation, a solution, or next steps.</p>
      <p><strong>Submission ID:</strong> ${submissionData.submission_id}</p>
      <p><em>No expectations beyond respect.</em></p>
    `
  });
}

// Get social proof data
async function getSocialProof() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM social_proof ORDER BY id DESC LIMIT 1');
    return result.rows[0] || { total_helped: 0, average_rating: 0, response_rate: 0 };
  } finally {
    client.release();
  }
}

// Update social proof data
async function updateSocialProof(data) {
  const client = await pool.connect();
  try {
    await client.query(`
      UPDATE social_proof 
      SET total_helped = $1, average_rating = $2, response_rate = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM social_proof ORDER BY id DESC LIMIT 1)
    `, [data.total_helped, data.average_rating, data.response_rate]);
  } finally {
    client.release();
  }
}

// Get recent submissions
async function getRecentSubmissions(limit = 5) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT submission_id, help_type, created_at, status
      FROM consulting_submissions 
      ORDER BY created_at DESC 
      LIMIT $1
    `, [limit]);
    return result.rows;
  } finally {
    client.release();
  }
}

module.exports = {
  initializeDatabase,
  processSubmission,
  getSocialProof,
  updateSocialProof,
  getRecentSubmissions
}; 