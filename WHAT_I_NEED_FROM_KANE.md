# What I Need From Kane — EP Hub Connection Checklist

This is the single working checklist for completing EP Hub connections.

**Important safety rule:** do not paste private keys, OAuth refresh tokens, API secrets, passwords, or private credentials into normal chat unless we are deliberately doing a secure setup step. Prefer adding secrets directly to **Replit Secrets** or the relevant provider dashboard.

## Current status

Already done:

- GitHub repo connected: `kaneepgs/EPGS-OS`
- EP Hub branding added
- `os.epgolfstudios.co.uk` chosen as the target domain
- GA4 + YouTube Replit Secret names added by Kane
- Build-time snapshot sync added: `npm run live:sync`
- Approval-first workflow confirmed
- Confirmed future connectors: EP Golf Studios Gmail, QuickBooks, Mailchimp

Still needed:

- Replit deployment visibility/public access
- Replit redeploy from latest GitHub `main`
- Gmail OAuth setup
- Google Calendar OAuth setup
- Booking/fitting platform choice
- QuickBooks connection details
- Mailchimp connection details

---

## 1. Replit deployment

Please confirm/complete:

- [ ] Replit project has pulled latest GitHub `main`
- [ ] Replit deployment has been redeployed after latest pull
- [ ] Replit deployment is **Public**, not private/protected
- [ ] `os.epgolfstudios.co.uk` opens EP Hub without Replit login/shield

Expected Replit build command:

```bash
npm install && npm run vendor:chart && npm run live:sync
```

Expected run command if using a server deployment:

```bash
python3 -m http.server 3000
```

For a static deployment:

- Public directory: `/`

---

## 2. GA4 — Google Analytics 4

Status: live-capable and working locally.

Already added to Replit Secrets, per Kane:

- [x] `GA4_PROPERTY_ID`
- [x] `GA4_CLIENT_EMAIL`
- [x] `GA4_PRIVATE_KEY`
- [x] `GA4_PROJECT_ID`

Still needed:

- [ ] Confirm GA4 property is the correct EP Golf Studios property
- [ ] Confirm final conversion event names

Current conversion assumptions:

- Primary conversion: `book_fitting`
- Secondary conversions: `click_phone_number`, `contact_us`, `email_address_click`

Please provide final GA4 event names if different:

```text
Primary fitting booking event name: book_fitting
Secondary phone click event name: click_phone_number
Secondary contact event name: contact_us
Secondary email click event name: email_address_click
```

---

## 3. YouTube

Status: live-capable and working locally.

Already added to Replit Secrets, per Kane:

- [x] `YOUTUBE_API_KEY`
- [x] `YOUTUBE_CHANNEL_ID`

Still needed:

- [ ] Confirm the YouTube channel is the correct EP Golf Studios channel
- [ ] Optional: confirm any key videos/playlists to track specially

Please provide if useful:

```text
Main YouTube channel URL:
Priority playlist(s), if any:
Videos/content types to treat as high priority:
```

---

## 4. EP Golf Studios Gmail

Status: provider exists; OAuth credentials not configured yet.

Needed for Replit Secrets:

- [ ] `GMAIL_CLIENT_ID`
- [ ] `GMAIL_CLIENT_SECRET`
- [ ] `GMAIL_REFRESH_TOKEN`
- [ ] `GMAIL_ACCOUNT`

Please confirm:

```text
Gmail account to connect:
Should EP Hub read only, or later prepare draft replies too? Read-only is safest first.
Important labels/folders to watch:
Any senders/domains to treat as high priority:
```

Recommended first scope:

```text
Read-only inbox intelligence only.
```

No automatic sending. Replies/actions stay approval-first.

---

## 5. Google Calendar

Status: provider exists; OAuth credentials not configured yet.

Needed for Replit Secrets:

- [ ] `GOOGLE_CALENDAR_CLIENT_ID`
- [ ] `GOOGLE_CALENDAR_CLIENT_SECRET`
- [ ] `GOOGLE_CALENDAR_REFRESH_TOKEN`
- [ ] `GOOGLE_CALENDAR_ID`

Please confirm:

```text
Calendar account to connect:
Calendar ID, if not primary:
Business hours:
Days to consider working days:
What counts as a fitting appointment in calendar event titles:
```

Current default assumptions:

- Timezone: Europe/London
- Calendar ID: `primary`
- Workday: 08:00–19:00
- Minimum bookable slot: 45 minutes

---

## 6. Booking / fitting provider

Status: not chosen yet. This is the most important missing connector because fittings are the primary conversion.

Please answer:

```text
What system handles fittings/bookings?
```

Examples:

- Calendly
- Square Appointments
- Acuity / Squarespace Scheduling
- Booksy
- Wix Bookings
- Shopify app
- Custom website form
- Manual email/phone only
- Other

Needed details:

```text
Booking platform name:
Booking admin URL:
Does it have API access? Yes/No/Unsure
Does it send confirmation emails to Gmail? Yes/No
Does it create Google Calendar events? Yes/No
Key booking types/services:
Deposit/payment provider, if any:
```

If no direct API exists, EP Hub can start with Gmail/Calendar-derived booking intelligence.

---

## 7. QuickBooks

Status: confirmed accounting platform; provider not built yet.

Please confirm:

```text
QuickBooks product/region:
Company name inside QuickBooks:
Do you use QuickBooks for VAT? Yes/No
Do you use QuickBooks for supplier bills? Yes/No
Do you use QuickBooks for invoices/payments? Yes/No
```

Future credentials/details likely needed:

- QuickBooks app client ID
- QuickBooks app client secret
- OAuth refresh token
- Company ID / Realm ID
- Chart of accounts mapping
- VAT/tax mapping

Do not paste these secrets casually. We will handle them during the QuickBooks provider build.

---

## 8. Mailchimp

Status: confirmed email marketing platform; provider not built yet.

Please confirm:

```text
Mailchimp account email:
Audience/list name:
Main campaign types:
Do campaigns link to fitting bookings? Yes/No/Unsure
Important tags/segments:
```

Future Replit Secret likely needed:

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_SERVER_PREFIX`
- `MAILCHIMP_AUDIENCE_ID`

Do not paste the API key casually. Add it to Replit Secrets when we build the provider.

---

## 9. Social platforms

Status: Unified Social provider exists, but currently needs a snapshot source or future API bridge.

Confirmed public accounts:

- Instagram: `https://www.instagram.com/epgolfstudios`
- Facebook: `https://www.facebook.com/epgolfstudios/`
- LinkedIn: `https://uk.linkedin.com/company/ep-golf-studios`
- X/Twitter: `https://x.com/epgolfstudios`
- TikTok: `https://www.tiktok.com/@epgolfstudios`

Confirmed credential status:

```text
LinkedIn API key: Provided by Kane outside this checklist
```

Still to confirm preferred approach:

```text
Start with manual/exported weekly social snapshots? Yes/No
Use official APIs later where possible? Yes/No
```

---

## 10. Competitors

Current competitor set:

- Club Champion UK
- SGGT
- Precision Golf
- My Golf Matters

Confirmed by Kane:

```text
Keep these competitors? Yes
Add/remove competitors: None for now
Any local competitors to track: None provided yet
```

---

## 11. Approval-first rules

Confirmed by Kane:

```text
Should EP Hub ever send emails automatically? No
Should EP Hub ever publish social posts automatically? No
Should EP Hub ever edit calendar events automatically? No
Should EP Hub require approval before every external action? Yes
```

Permanent default:

```text
Approval-first for everything external.
No external email, social, calendar, finance, booking, or publishing action should execute automatically.
EP Hub may draft, recommend, preview, queue, and explain actions, but Kane must approve before anything leaves the system or changes an external service.
```

---

## 12. Best next order

Recommended next work order:

1. Make Replit public and verify `os.epgolfstudios.co.uk`
2. Confirm GA4 conversion event names
3. Finish Gmail OAuth snapshot
4. Finish Google Calendar OAuth snapshot
5. Identify booking/fitting platform
6. Build Booking Provider v1.0
7. Build QuickBooks Provider v1.0
8. Build Mailchimp Provider v1.0
9. Improve Unified Social source
10. Add optional execution gateway only after audit/approval rules are complete
