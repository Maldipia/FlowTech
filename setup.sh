#!/bin/bash
# ============================================================
# FLOWTECH.PH — ONE-COMMAND SETUP SCRIPT
# Usage: bash setup.sh
# ============================================================

echo ""
echo "🚀 Flowtech.ph Setup"
echo "===================="
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Done! Next steps:"
echo ""
echo "1. Add your ENV vars — create .env.local with:"
echo "   NEXT_PUBLIC_SUPABASE_URL=your_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
echo "   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
echo "   RESEND_API_KEY=your_resend_key"
echo "   NOTIFY_EMAIL=pia@flowtech.ph"
echo "   NEXT_PUBLIC_SITE_URL=https://flowtech.ph"
echo ""
echo "2. Run locally:  npm run dev"
echo "3. Push to GitHub:"
echo "   git add ."
echo '   git commit -m "feat: flowtech.ph marketing site"'
echo "   git push origin main"
echo ""
echo "4. Vercel auto-deploys on push."
echo "   Add same ENV vars in Vercel → Settings → Environment Variables"
echo ""
echo "Direct links:"
echo "   GitHub Secrets:  https://github.com/Maldipia/FlowTech/settings/secrets/actions"
echo "   Vercel ENV:      https://vercel.com/maldipia/flowtech/settings/environment-variables"
echo ""
