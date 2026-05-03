import { formatDailyPassageMessage } from "@/lib/daily-message";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendSms } from "@/lib/twilio";

export const runtime = "nodejs";

type Subscriber = {
  id: string;
  phone_number: string;
  timezone: string;
  delivery_hour: number;
};

type DeliveryResult = {
  subscriberId: string;
  status: "sent" | "skipped" | "failed";
  message: string;
};

export async function GET(request: Request) {
  return sendDailyTexts(request);
}

export async function POST(request: Request) {
  return sendDailyTexts(request);
}

async function sendDailyTexts(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const now = new Date();
  const passage = formatDailyPassageMessage();

  const { data: subscribers, error } = await supabase
    .from("daily_text_subscribers")
    .select("id, phone_number, timezone, delivery_hour")
    .eq("active", true);

  if (error) {
    return Response.json(
      { message: "Could not load subscribers." },
      { status: 500 },
    );
  }

  const dueSubscribers = (subscribers as Subscriber[]).filter((subscriber) =>
    isDueForDelivery(subscriber, now),
  );

  const results: DeliveryResult[] = [];

  for (const subscriber of dueSubscribers) {
    const deliveryDate = getLocalDate(subscriber.timezone, now);

    const { data: delivery, error: insertError } = await supabase
      .from("daily_text_deliveries")
      .insert({
        subscriber_id: subscriber.id,
        phone_number: subscriber.phone_number,
        delivery_date: deliveryDate,
        passage_reference: "John 14:1",
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError) {
      if (insertError.code !== "23505") {
        results.push({
          subscriberId: subscriber.id,
          status: "failed",
          message: insertError.message,
        });
        continue;
      }

      results.push({
        subscriberId: subscriber.id,
        status: "skipped",
        message: "Already queued or sent for this local date.",
      });
      continue;
    }

    try {
      const twilio = await sendSms({
        to: subscriber.phone_number,
        body: passage,
      });

      await supabase
        .from("daily_text_deliveries")
        .update({
          status: "sent",
          twilio_sid: twilio.sid,
          twilio_status: twilio.status,
          sent_at: new Date().toISOString(),
        })
        .eq("id", delivery.id);

      results.push({
        subscriberId: subscriber.id,
        status: "sent",
        message: "Daily passage sent.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Twilio send failed.";

      await supabase
        .from("daily_text_deliveries")
        .update({
          status: "failed",
          error_message: message,
        })
        .eq("id", delivery.id);

      results.push({
        subscriberId: subscriber.id,
        status: "failed",
        message,
      });
    }
  }

  return Response.json({
    checkedAt: now.toISOString(),
    dueCount: dueSubscribers.length,
    results,
  });
}

function isDueForDelivery(subscriber: Subscriber, now: Date) {
  return getLocalHour(subscriber.timezone, now) === subscriber.delivery_hour;
}

function getLocalHour(timezone: string, date: Date) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date),
  );
}

function getLocalDate(timezone: string, date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}
