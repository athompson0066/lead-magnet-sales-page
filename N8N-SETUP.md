# AI Sales Agent — n8n Workflow Setup Guide

## Current Status
- n8n instance: https://n8n.srv1524386.hstgr.cloud/ (accessible)
- n8n API token: configured but returning "unauthorized" for REST API
- **Action needed:** Check n8n settings → API → Enable "API Enabled" toggle, or generate a new API key

## What We Need to Build

### 1. AI Sales Agent Workflow
An n8n workflow that:
- Receives chat messages from the sales page via webhook
- Uses an AI Agent (with Ollama) to respond naturally
- Collects: name, email, business name, message
- Sends Albert a Telegram notification when qualified lead captured
- Sends confirmation email to the prospect

### 2. The Chat Widget
A JavaScript widget embedded in the sales page that:
- Opens a chat dialog
- Sends messages to the n8n webhook
- Maintains conversation history
- Displays AI responses

### 3. Import This Workflow
Once n8n API access is working, create a new workflow and import the JSON below.

---

## n8n Workflow JSON (Import This)

```json
{
  "name": "Lead Magnet AI Sales Agent",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-magnet-chat",
        "responseMode": "lastNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "id": "webhook-lead-magnet"
    },
    {
      "parameters": {
        "model": "glm-5:cloud",
        "options": {
          "systemMessage": "You are Albert's AI sales assistant for Aiolos Media. You help visitors understand our Lead Magnet service for nutritionists. Pricing: $149 setup + $99/mo. Features: metabolic health audit tool, email/Instagram/LinkedIn integration, qualified lead dashboard. Be helpful, professional, and close the sale. Ask for their name, email, and business name to qualify them."
        }
      },
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1,
      "position": [500, 300],
      "id": "ai-agent-lead-magnet"
    },
    {
      "parameters": {
        "webhookUrl": "https://n8n.srv1524386.hstgr.cloud/webhook/lead-magnet-response",
        "method": "POST",
        "bodyParameters": {
          "parameters": [
            {
              "name": "response",
              "value": "={{ $json.response }}"
            }
          ]
        }
      },
      "name": "Send Response to Website",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [750, 300],
      "id": "send-response"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "AI Agent": {
      "main": [[{ "node": "Send Response to Website", "type": "main", "index": 0 }]]
    }
  }
}
```

---

## Manual Setup Steps in n8n

### Step 1: Enable API Access
1. Log into n8n at https://n8n.srv1524386.hstgr.cloud/
2. Go to Settings → API
3. Make sure "Enable API" is ON
4. Generate a new API key if needed

### Step 2: Create the Workflow
1. Click "New Workflow"
2. Add a **Webhook** node → set path to `lead-magnet-chat`
3. Add an **AI Agent** node → connect to webhook
4. Add a **Telegram** node → send notification to Albert when lead captured
5. Add an **Email** node → send confirmation to prospect

### Step 3: AI Agent Configuration
- Model: Ollama (glm-5:cloud or kimi-k2.5:cloud)
- System prompt: "You are Albert's AI sales assistant for Aiolos Media..."

### Step 4: Get Webhook URL
1. Save the workflow
2. Click "Test" on the webhook
3. Copy the webhook URL: `https://n8n.srv1524386.hstgr.cloud/webhook/lead-magnet-chat`

### Step 5: Add to Sales Page
Replace `YOUR_WEBHOOK_URL` in `app.js` with the n8n webhook URL.

---

## Albert's Action Items
1. Log into n8n → Settings → API → Enable API if not already
2. Create workflow manually (JSON import above or build node by node)
3. Copy webhook URL
4. Give me the webhook URL → I'll add it to the sales page
5. Deploy sales page to Vercel

## Meanwhile: Build the Sales Page
While n8n is being set up, I'll build the full HTML/CSS/JS sales page with the chat widget embedded. The chat will show a "Chat coming soon" state until the n8n webhook is connected.
