export const posts = [
  {
    slug: 'messenger-leak-lead-recovery',
    title: 'The Messenger Leak: How 20 Daily Inquiries Were Getting Lost',
    excerpt: 'A pet food brand was getting 20+ Facebook inquiries every day — and capturing zero of them. Here\'s the system we built to fix it.',
    date: '2026-05-20',
    readTime: '5 min read',
    tag: 'Case Study',
    content: `Every day, 20 people messaged a Metro Manila pet food brand on Facebook asking about raw food prices, delivery areas, and product sizes.

Every day, the owner replied manually — when she had time. When she didn't, the message sat there. No email captured. No follow-up. No order.

Over 90 days, that's 1,800 potential leads that vanished into Messenger.

**The diagnosis**

The problem wasn't the owner's responsiveness. It was the workflow: Messenger has no lead database, no CRM, no way to re-engage someone who asked a question last Tuesday and never heard back.

We mapped the leak:
- Inquiry arrives on Facebook
- Owner sees it (maybe)
- Replies manually (when available)
- No email or phone captured
- Lead goes cold
- Revenue lost

**The fix: Phase 1 of the Supero Ecosystem**

We built a structured platform to replace the Messenger workflow:

1. **Product storefront** — customers can browse and add to cart without DMing anyone
2. **Social auth on checkout** — Google or Facebook login captures name + email on every order attempt, even abandoned ones
3. **AI inquiry chatbot** — Claude API with a Taglish system prompt handles the 20 daily "how much?" questions automatically, 24/7
4. **Owner dashboard** — real-time view of leads captured vs. lost, revenue recovered, and weekly trend

**The result after 90 days**

- Lead capture rate: 0% → 78%
- Pipeline recovered: ₱148,000
- Daily inquiries handled by AI: 20+
- Manual replies required: 0

The chatbot knows every product, price, variant, delivery area, and subscription option. It responds in Taglish in under 2 seconds. And every interaction is logged.

**The lesson**

If your primary sales channel is Facebook Messenger DMs, you don't have a sales channel — you have a leaky bucket. The fix isn't to reply faster. It's to build a system that captures intent before it evaporates.

We build these systems for Philippine SMEs on Next.js + Supabase + Claude API. If your business has the same leak, [start with our discovery form](/discovery).`
  },
  {
    slug: 'zero-cost-stack-philippine-smes',
    title: 'The Zero-Cost Stack for Philippine SMEs: Next.js, Supabase, and n8n',
    excerpt: 'The exact tools we use to build production-grade web systems for Philippine businesses — all on free tiers until you scale.',
    date: '2026-05-14',
    readTime: '6 min read',
    tag: 'Technical',
    content: `One of the first questions Filipino business owners ask when they hear "custom web system" is: magkano ba ang monthly cost?

The honest answer: zero, until you're big enough that it doesn't matter anymore.

Here's the exact stack we use and why.

**Next.js 14 on Vercel — free forever for most businesses**

Vercel's free tier handles up to 100GB bandwidth and 100,000 function invocations per month. For a typical Philippine SME doing 50–500 orders a month, you'll never touch those limits.

Next.js gives us server-side rendering (good for SEO), API routes (no separate backend server), and the App Router (clean file-based routing). We write JSX, deploy with git push, done.

**Supabase — PostgreSQL with auth and storage built in**

Supabase free tier: 500MB database, 1GB file storage, 50,000 monthly active users. That covers most small business databases for years.

More importantly: it's just PostgreSQL. No proprietary query language, no lock-in. If you outgrow Supabase someday, your data moves with you.

We use it for: order records, lead capture, customer profiles, discovery form responses, product catalogs.

**n8n — automation without the Zapier bill**

Zapier charges per task. For a business running 10+ automations across Facebook, Google Sheets, email, and logistics APIs, that bill adds up fast.

n8n is self-hostable and open-source. We run it on a ₱500/month VPS for clients with heavy automation needs, or use n8n Cloud's free tier (5 workflows) for simpler setups.

We use n8n for: Facebook Graph API posting, lead routing, order notifications, Sheets logging, and multi-brand content pipelines.

**Google Apps Script — the underrated workhorse**

GAS runs on Google's infrastructure for free. It has direct access to Sheets, Gmail, Drive, and Calendar — no OAuth dance required.

For Philippine businesses already living in Google Workspace, GAS is the fastest path from "I have a spreadsheet" to "this runs automatically."

We use it for: auto-posting to Facebook, Sheets-based CRM triggers, invoice generation, and content calendar management.

**The full stack, total monthly cost: ₱0–₱500**

| Tool | Free Tier | Paid When |
|------|-----------|-----------|
| Vercel | 100GB bandwidth | 1M+ monthly visitors |
| Supabase | 500MB DB | 50k+ users |
| n8n Cloud | 5 workflows | 6th workflow |
| GAS | Unlimited | Never |

**Why this matters for Philippine businesses**

Most dev agencies in the Philippines build on proprietary CMSes or platforms that charge monthly forever. We build on open-source tools you own completely.

When we hand over a project, you get the GitHub repo, the Supabase project, the n8n workflows — everything. No subscription to us required (though retainer support is available if you want it).

Ready to build on this stack? [Tell us about your project](/discovery).`
  },
  {
    slug: 'facebook-auto-poster-gas',
    title: 'How We Automated 40 Facebook Group Posts with Google Apps Script',
    excerpt: 'Manual Facebook posting across 40 groups was eating 2+ hours a day. Here\'s the GAS system that eliminated it completely.',
    date: '2026-05-07',
    readTime: '7 min read',
    tag: 'Automation',
    content: `A jewelry brand selling via layaway had built a distribution network of 40 Facebook groups over several years. Every Monday, Wednesday, Friday, and Sunday, someone had to manually post to all 40.

That's 160 posts per month. At 3–5 minutes per post (write caption, upload photo, select group, post, repeat), that's 8–13 hours of manual work every month — just on Facebook posting.

**The system we built**

The solution has three parts: a Google Sheet as the control center, a Google Apps Script as the engine, and the Facebook Graph API as the delivery mechanism.

**Part 1: The Google Sheet**

One sheet holds the content calendar:
- Column A: Post date
- Column B: Product name and variant
- Column C: Price
- Column D: Image URL (from Google Drive)
- Column E: Status (Pending / Posted / Error)

Another sheet holds the group database:
- Group ID (from Facebook)
- Group name
- Last posted date
- Active (Y/N)

**Part 2: The GAS Auto-Poster**

The script runs on a time trigger — 9AM on Mon/Wed/Fri/Sun.

It reads today's content from the calendar, generates a Taglish caption using the product data, then loops through the group database.

The caption template for this brand follows a specific pattern: aspirational hook → product detail → layaway terms → CTA. Every post sounds like it was written by the same person, because the template is locked.

The group cooldown rule: each group can only receive one post every 3 days. The script checks the last posted date before sending — if it's too recent, it skips and moves to the next group.

**Part 3: The Facebook Graph API**

Posting to Facebook Groups requires a User Access Token with \`groups_access_member_info\` and \`publish_to_groups\` permissions. The token is stored in GAS Script Properties — never in the spreadsheet cells.

Each post call:
\`\`\`
POST https://graph.facebook.com/{group-id}/feed
{
  "message": "{generated caption}",
  "link": "{optional product link}"
}
\`\`\`

On success, the Sheet logs the post ID and timestamp. On error, it logs the error message and sends an email alert.

**The result**

- 160 manual posts per month → 0
- 8–13 hours of work → 15 minutes of review (checking the content calendar for the week)
- Consistent brand voice across all 40 groups
- Full audit log in Google Sheets
- Zero missed posting days since launch

**The 3-day cooldown is critical**

Facebook group admins notice when the same seller posts too frequently. The cooldown rule keeps the brand visible without triggering spam complaints or removal from groups.

With 40 groups and a 3-day cooldown, the system naturally distributes posts across the group network — each group gets roughly 10 posts per month, which feels organic rather than spammy.

**Want this for your brand?**

We build GAS automation systems for Philippine businesses on Facebook. The setup takes about a week and costs a fraction of what manual posting time costs you monthly. [Start with the discovery form](/discovery).`
  },
];

export function getPostBySlug(slug) {
  return posts.find(p => p.slug === slug) || null;
}
