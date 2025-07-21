# Weeno Consulting API

This is the backend API server for the Weeno Ridge consulting form submissions.

## Setup for Render Deployment

### 1. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `weeno-consulting-db`
   - **Database**: `weeno_consulting`
   - **User**: `weeno_user`
   - **Region**: Choose closest to you
4. Note down the connection details

### 2. Create Web Service on Render

1. Connect your GitHub repository
2. Configure the service:
   - **Name**: `weeno-consulting-api`
   - **Root Directory**: `api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Environment Variables

Add these environment variables in your Render service:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://weeno_user:password@host:port/weeno_consulting
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
NOTIFICATION_EMAIL=andrew@weenoridge.com
ENCRYPTION_KEY=your-secure-encryption-key
ADMIN_KEY=your-secure-admin-key
```

### 4. Update Frontend Configuration

Once deployed, update the API URL in `assets/js/consulting.js`:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app.onrender.com'  // Replace with your actual URL
  : 'http://localhost:3000';
```

## Local Development

1. Install dependencies:
   ```bash
   cd api
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   DATABASE_URL=postgresql://localhost:5432/weeno_consulting
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_USER=your-email@domain.com
   SMTP_PASS=your-email-password
   NOTIFICATION_EMAIL=andrew@weenoridge.com
   ENCRYPTION_KEY=your-secure-encryption-key
   ADMIN_KEY=your-secure-admin-key
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/consulting/submit` - Submit consulting request
- `GET /api/consulting/social-proof` - Get social proof data
- `POST /api/consulting/social-proof` - Update social proof (admin)
- `GET /api/consulting/submissions` - Get recent submissions (admin)
- `GET /health` - Health check

## Database Schema

### consulting_submissions
- `id` (SERIAL PRIMARY KEY)
- `submission_id` (VARCHAR(32) UNIQUE)
- `help_type` (VARCHAR(50))
- `email` (VARCHAR(255))
- `estimated_value_encrypted` (TEXT)
- `additional_info` (TEXT)
- `referral` (VARCHAR(255))
- `build_description` (TEXT)
- `audience` (VARCHAR(50))
- `reference_links` (TEXT)
- `files` (JSONB)
- `status` (VARCHAR(20))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### social_proof
- `id` (SERIAL PRIMARY KEY)
- `total_helped` (INTEGER)
- `average_rating` (DECIMAL(3,2))
- `response_rate` (INTEGER)
- `updated_at` (TIMESTAMP)

## Security Features

- Encrypted storage of estimated values
- CORS protection
- Admin authentication for sensitive endpoints
- Input validation and sanitization
- Secure email notifications 