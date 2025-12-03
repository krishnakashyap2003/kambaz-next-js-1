# Vercel Deployment Setup

## Environment Variables

To fix the API connection issues in production, you need to set the following environment variable in Vercel:

### Required Environment Variable

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

```
NEXT_PUBLIC_API_BASE=https://kambaz-node-server-app-1-1.onrender.com
```

### Steps:

1. **Variable Name**: `NEXT_PUBLIC_API_BASE`
2. **Value**: `https://kambaz-node-server-app-1-1.onrender.com`
3. **Environment**: Select all environments (Production, Preview, Development)
4. Click **Save**

### After Adding the Variable:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) menu on your latest deployment
3. Select **Redeploy**
4. This will trigger a new build with the environment variable

### Verification:

After redeploying, check the browser console. You should see:
- `🔧 API Base URL: https://kambaz-node-server-app-1-1.onrender.com`
- No more `ERR_CONNECTION_REFUSED` errors
- API calls should work correctly

## Note

The app now has automatic fallback detection:
- If `NEXT_PUBLIC_API_BASE` is set, it uses that value
- If not set but running on Vercel, it auto-detects and uses the Render server
- Otherwise, it defaults to `http://localhost:4000` for local development

However, **explicitly setting the environment variable is recommended** for reliability.

