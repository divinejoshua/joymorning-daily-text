# Joymorning Daily Text

A simple Next.js app where someone chooses their country, enters a phone
number, and signs up for a daily Bible passage by text message around 7am in
their local country timezone.

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

Create the subscriber table by running the SQL in
[`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL editor.

Add these environment variables to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

The service role key is used only in the server route handler. Do not expose it
in browser code.

## Twilio Setup

The test page at `/test-sms` sends one passage immediately through Twilio.

Add these environment variables to `.env.local`:

```bash
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_FROM_NUMBER="+15017122661"
CRON_SECRET="choose-a-long-random-string"
```

You can use a Messaging Service instead of a sender number:

```bash
TWILIO_MESSAGING_SERVICE_SID="MG..."
```

If `TWILIO_MESSAGING_SERVICE_SID` is set, the app sends with that service.
Otherwise it sends with `TWILIO_FROM_NUMBER`.

## Scheduled Sending

Call this endpoint hourly from a scheduler:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/send-daily-texts
```

The endpoint checks active subscribers, sends only when their saved timezone is
currently at their `delivery_hour`, and records each delivery in Supabase so the
same passage is not sent twice for the same local date.

## Current Scope

- Stores one active subscriber row per phone number and country.
- Normalizes local numbers into a simple international format.
- Saves the selected country's primary timezone with `delivery_hour = 7`.
- Sends a manual test passage through Twilio from `/test-sms`.
- Sends scheduled daily texts from `/api/cron/send-daily-texts` when called by
  an hourly scheduler.
