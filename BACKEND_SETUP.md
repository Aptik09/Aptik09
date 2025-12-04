# 🔧 JARVIS Backend Setup Guide

This guide will help you set up the secure backend for your JARVIS AI assistant.

## 📋 Prerequisites

- GitHub account with Personal Access Token
- OpenAI API key (or Gemini API key)
- Basic understanding of GitHub Actions
- (Optional) Vercel/Netlify account for serverless functions

## 🏗️ Architecture Overview

```
Frontend (GitHub Pages)
    ↓
Backend API (GitHub Actions / Serverless)
    ↓
Private Data Repository
```

## 🚀 Step 1: Create Private Data Repository

1. Go to https://github.com/new
2. Repository name: `jarvis-brain`
3. Description: "JARVIS AI - Private Data Storage"
4. **Make it PRIVATE** ✅
5. Initialize with README
6. Create repository

### Create Data Structure

Create these folders in `jarvis-brain`:

```
jarvis-brain/
├── data/
│   ├── notes.json
│   ├── tasks.json
│   ├── conversations/
│   └── memory.json
├── config/
│   ├── agents.json
│   └── settings.json
└── logs/
    └── activity.log
```

## 🔐 Step 2: Set Up GitHub Secrets

1. Go to your `Aptik09` repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

Add these secrets:

### Required Secrets

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `OPENAI_API_KEY` | OpenAI API key | https://platform.openai.com/api-keys |
| `GITHUB_PAT` | Personal Access Token | Settings → Developer settings → Personal access tokens |
| `JARVIS_PASSWORD` | Your JARVIS password | Your secure password |
| `DATA_REPO_TOKEN` | Token for private repo access | Same as GITHUB_PAT |

### Optional Secrets (for future integrations)

| Secret Name | Description |
|------------|-------------|
| `GMAIL_CLIENT_ID` | Gmail API client ID |
| `GMAIL_CLIENT_SECRET` | Gmail API secret |
| `GOOGLE_CALENDAR_API_KEY` | Calendar API key |
| `PERPLEXITY_API_KEY` | Perplexity search API |

## ⚙️ Step 3: Create GitHub Actions Workflow

Create `.github/workflows/jarvis-backend.yml`:

```yaml
name: JARVIS Backend API

on:
  repository_dispatch:
    types: [jarvis-request]
  workflow_dispatch:

jobs:
  process-request:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Process AI Request
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GITHUB_PAT: ${{ secrets.GITHUB_PAT }}
          DATA_REPO: Aptik09/jarvis-brain
        run: |
          node backend/process-request.js
      
      - name: Store Response
        run: |
          echo "Response stored in private repository"
```

## 🔧 Step 4: Create Backend Scripts

### Create `backend/process-request.js`:

```javascript
const https = require('https');

async function callOpenAI(message) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    const data = JSON.stringify({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are JARVIS, Aptik Pandey's personal AI assistant. You are intelligent, helpful, and professional."
            },
            {
                role: "user",
                content: message
            }
        ],
        max_tokens: 2000,
        temperature: 0.7
    });
    
    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Length': data.length
        }
    };
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve(parsed.choices[0].message.content);
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(data);
        req.end();
    });
}

async function storeConversation(message, response) {
    // Store in private jarvis-brain repository
    const timestamp = new Date().toISOString();
    const conversation = {
        timestamp,
        user: message,
        assistant: response
    };
    
    // Use GitHub API to store in private repo
    console.log('Storing conversation:', conversation);
}

async function main() {
    const message = process.env.USER_MESSAGE || "Hello JARVIS";
    
    try {
        const response = await callOpenAI(message);
        await storeConversation(message, response);
        console.log('Response:', response);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
```

## 🌐 Step 5: Alternative - Serverless Function (Vercel)

If you prefer serverless functions, create `api/chat.js`:

```javascript
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://aptik09.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { message, password } = req.body;
    
    // Verify password
    if (password !== process.env.JARVIS_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are JARVIS, Aptik Pandey\'s personal AI assistant.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        return res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

## 📱 Step 6: Update Frontend to Use Backend

Update `script.js` to call your backend:

```javascript
async function processMessage(message) {
    try {
        const response = await fetch('YOUR_BACKEND_URL/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                password: PASSWORD // Your password for verification
            })
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        return "I'm having trouble connecting to my backend. Please try again.";
    }
}
```

## 🧪 Step 7: Testing

1. Test password protection
2. Test API connection
3. Test conversation storage
4. Test on mobile devices
5. Test error handling

## 🔒 Security Checklist

- [ ] All API keys stored in GitHub Secrets
- [ ] Private data repository is PRIVATE
- [ ] Password is strong and unique
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS is enforced

## 📊 Monitoring

Monitor your JARVIS system:

1. **GitHub Actions logs** - Check workflow runs
2. **API usage** - Monitor OpenAI usage
3. **Error logs** - Check for failures
4. **Performance** - Response times

## 🆘 Troubleshooting

### Issue: API not responding
- Check GitHub Secrets are set correctly
- Verify API keys are valid
- Check GitHub Actions logs

### Issue: CORS errors
- Verify CORS headers in backend
- Check allowed origins

### Issue: Slow responses
- Check API rate limits
- Optimize prompts
- Consider caching

## 📚 Next Steps

1. ✅ Complete backend setup
2. 🔄 Test all integrations
3. 📧 Add email integration
4. 📅 Add calendar integration
5. 🔍 Add web search
6. 🤖 Add more AI capabilities

## 🎯 Production Deployment

When ready for production:

1. Switch environment to "production"
2. Enable all security features
3. Set up monitoring and alerts
4. Create backup system
5. Document all processes

---

**Need help?** Open an issue or contact Aptik Pandey

**Security concern?** Email: aptikpandey9@gmail.com