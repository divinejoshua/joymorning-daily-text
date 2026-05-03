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

## Current Scope

- Stores one active subscriber row per phone number and country.
- Normalizes local numbers into a simple international format.
- Saves the selected country's primary timezone with `delivery_hour = 7`.
- Does not send SMS yet. The stored `timezone` and `delivery_hour` fields are
  ready for a later scheduled sender.
