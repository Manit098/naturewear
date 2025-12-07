# Production Deployment Guide

## Prerequisites

1. Node.js 18+ installed
2. MongoDB database (local or cloud)
3. Clerk account for authentication
4. Stripe account for payments

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/naturewear

# Stripe Payment Gateway
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Node Environment
NODE_ENV=production
```

## Build Steps

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Start the production server:
```bash
npm start
```

## Deployment Platforms

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

- **Netlify**: Use Next.js plugin
- **Railway**: Connect GitHub repo and add env variables
- **DigitalOcean App Platform**: Connect repo and configure

## Important Production Checklist

- [ ] Set all environment variables
- [ ] Use production Clerk keys (pk_live_...)
- [ ] Use production Stripe keys (pk_live_...)
- [ ] Configure Stripe webhook endpoint
- [ ] Set up MongoDB connection string
- [ ] Update NEXT_PUBLIC_APP_URL to your domain
- [ ] Test checkout flow end-to-end
- [ ] Test admin authentication
- [ ] Verify all API routes work
- [ ] Set up error monitoring (Sentry, etc.)

## Stripe Webhook Setup

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Security Notes

- Never commit `.env.local` to version control
- Use strong MongoDB passwords
- Enable Clerk's security features
- Use HTTPS in production
- Regularly update dependencies

## Performance Optimization

- Images are optimized via Next.js Image component
- Static assets are cached
- API routes are serverless
- Database connections are pooled

## Monitoring

Consider setting up:
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring (UptimeRobot)
- Database monitoring (MongoDB Atlas)

