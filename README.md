# Lead Magnet Sales Page — AI Sales Agent

## Overview
- **Sales page:** `leadgen.aiolosmedia.com` (to be deployed)
- **AI Agent:** n8n workflow — AI Agent node with conversation memory
- **Pricing:** $149 one-time setup + 30 days free + $99/mo
- **PayPal:** paypal.me/aiolosmedia/setup-fee

## Sales Page Structure

### Hero Section
**Headline:** "Turn Every Email You Send Into a Lead Generation Machine"

**Subheadline:** 
"Your content is working. But the people who want to work with you are slipping through the cracks. Here's the fix."

### The Problem (Pablo's framing)
**Headline:** "You're Paying for Attention. You're Only Harvesting 2%."

Most nutritionists drive real traffic through content, social media, and newsletters. But their only call-to-action is "Book a Free Consultation" — a high-friction ask for someone who just discovered you.

The 90% who aren't ready for a 15-minute call? They read. They intend to book later. They never come back.

### The Solution
**Headline:** "The Lead Bridge — Built for Nutritionists"

We built a lightweight lead qualification tool that lives in your existing touchpoints:
- Your email signature
- Your Instagram bio link  
- Your LinkedIn
- Your website

Prospects get an immediate win in 30 seconds — a free Metabolic Health Audit, meal plan preview, or goal calculator. They raise their hand without committing to a call. You get a qualified lead with their goals and budget already filtered — before they ever hit your inbox.

### How It Works (3 steps)
1. **Add the link** — Drop it in your email signature, Instagram bio, or LinkedIn. Takes 30 seconds.
2. **They take the audit** — 30 seconds. Gets them a personalized result. High-value, zero friction.
3. **You get qualified leads** — Every person who completes the audit lands in your dashboard with their name, email, goals, and budget. Your 15-minute call becomes a closing call.

### The Tool (show it)
Live demo: [dr-amara.aiolosmedia.com] — click to see what it looks like for a real nutritionist

### Pricing
**Setup:** $149 (includes 30 days free)
**After 30 days:** $99/month
**Guarantee:** If you don't get 10 qualified leads in your first 30 days, we'll refund your setup fee — no questions asked.

**CTA:** [Chat with Our AI Agent to Get Started] — embedded chat widget

### AI Agent (powered by n8n)
The chat widget on this page connects to an n8n AI Agent that:
- Explains the service
- Answers questions about pricing/features
- Collects their name, email, business name
- Schedules a call or sends Albert a notification
- Handles objections

### PayPal Integration
Setup fee: https://paypal.me/aiolosmedia/149
Monthly: Albert sends invoice via PayPal after 30 days

## n8n AI Agent Workflow

### Trigger: Webhook
- POST endpoint for the chat widget
- Receives: user message, session id

### AI Agent Node
- Model: Ollama (glm-5:cloud or similar)
- System prompt: Albert's AI sales agent persona
- Knowledge: Everything about the lead magnet service
- Tools: Calculator, send email, save to sheet

### Actions the AI can take:
1. Answer questions about the service
2. Collect lead info (name, email, business)
3. Send Albert a Telegram notification when qualified lead captured
4. Send follow-up email to the prospect

### Memory
- n8n memory node for conversation context
- Stores conversation history per session

## Files to Create
1. `/sales-page/index.html` — full landing page
2. `/sales-page/styles.css` — styling
3. `/sales-page/app.js` — chat widget + PayPal button
4. `/n8n-workflow.json` — n8n workflow export (importable)
# Updated Mon Apr  6 12:52:22 PM CDT 2026
# GitHub auto-deploy active - Mon Apr  6 01:15:33 PM CDT 2026
