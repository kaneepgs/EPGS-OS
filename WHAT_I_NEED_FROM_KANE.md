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
- Confirmed future connectors: EP Golf Studios Gmail, Acuity/Squarespace Scheduling, Stripe, QuickBooks, Mailchimp

Still needed:

- Replit deployment visibility/public access
- Replit redeploy from latest GitHub `main`
- Gmail OAuth setup
- Google Calendar OAuth setup
- Acuity API access confirmation
- QuickBooks product/region confirmation
- Mailchimp account/audience/campaign/tag details

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

Confirmed conversion events:

- Primary conversion: `book_fitting`
- Secondary conversions: `click_phone_number`, `contact_us`, `email_address_click`

Current GA4 event mapping:

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

Confirmed by Kane:

```text
Gmail account to connect: info@epgolfstudios.co.uk
Initial scope: Read-only inbox intelligence
Watch folders: INBOX, IMPORTANT, STARRED, SENT
Suggested replies: Yes, generate suggestions only
Automatic sending: No
Automatic replying: No
Automatic archiving: No
Automatic deleting: No
Automatic labelling: No
Approval-first: Mandatory for every outbound action
```

Classification categories:

- Customers
- Bookings
- Finance
- Suppliers
- Marketing
- Reviews
- Internal
- Partners
- Other

Priority rules:

- Customer enquiries over 24 hours old = High
- Booking enquiries = High
- Supplier issues = Medium
- Finance actions = High
- Marketing notifications = Low unless action required

CEO Dashboard surfaces:

- Unread high-priority emails
- Customer replies due
- Booking enquiries
- Finance emails
- Supplier emails
- Daily email summary

No automatic mailbox mutations. EP Hub may generate suggested replies, but must never send, reply, archive, delete, or label without explicit approval.

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

Status: confirmed by Kane.

Confirmed booking setup:

```text
Booking platform name: Acuity / Squarespace Scheduling
Acuity scheduling URL: https://app.acuityscheduling.com/schedule/a21925b8
Booking/admin URL provided: https://epgolfstudios.co.uk/book-now
API access: Unsure / still to confirm
Sends confirmation emails to Gmail: Yes
Creates Google Calendar events: Yes
Deposit/payment provider: Stripe
```

Key booking types/services:

- Club Fitting Sessions
- Shaft only fitting sessions
- Gapping & Analysis Services
- Studio Hire
- Gift Certificates

Provider plan:

- Start Booking Provider v1.0 from Gmail + Google Calendar-derived booking intelligence because Acuity sends confirmation emails and creates calendar events.
- Add direct Acuity API integration later if API credentials/access are confirmed.
- Treat Stripe as the deposit/payment source for future finance/payment visibility.

Still needed later:

```text
Acuity API access available? Yes/No
Acuity API credentials or OAuth setup path, if available
Stripe connection details, when Finance/Payments provider is built
```

---

## 7. QuickBooks

Status: confirmed accounting platform; provider not built yet.

Confirmed by Kane:

```text
QuickBooks account email: accounts@epgolfstudios.co.uk
Legal business name in QuickBooks: Elite Performance Golf Studios Ltd
Name in QuickBooks: EP Golf Studios Ltd
Uses QuickBooks for VAT: Yes
Uses QuickBooks for supplier bills: Yes
Uses QuickBooks for invoices/payments: No
```

Still needed later:

```text
QuickBooks product/region:
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

Confirmed by Kane:

```text
Mailchimp account email: accounts@epgolfstudios.co.uk
Main campaign types: Email distribution lists
Campaigns currently link to fitting bookings: Not at the moment
Future use: Ability to run regular follow-ups later
```

Still needed later:

```text
Audience/list name:
Important tags/segments:
```

Provider plan:

- Treat Mailchimp as future nurture/follow-up intelligence first, not current booking-attribution source.
- Later connect campaigns and automations to fitting-booking journeys if Kane wants regular follow-up sequences.

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
5. Build Acuity-derived Booking Provider v1.0
6. Build QuickBooks Provider v1.0
7. Build Mailchimp Provider v1.0
8. Improve Unified Social source
9. Add optional execution gateway only after audit/approval rules are complete
