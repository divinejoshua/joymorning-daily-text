import { findCountry } from "@/lib/countries";
import { normalizePhoneNumber } from "@/lib/phone";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const DAILY_SAMPLE =
  'Hello there, "Do not let your heart be troubled. Believe in God; believe also in me." - John 14:1';

type SubscribePayload = {
  phoneNumber?: unknown;
  countryCode?: unknown;
};

export async function POST(request: Request) {
  let payload: SubscribePayload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Send a valid signup request." }, { status: 400 });
  }

  if (
    typeof payload.phoneNumber !== "string" ||
    typeof payload.countryCode !== "string"
  ) {
    return Response.json(
      { message: "Phone number and country are required." },
      { status: 400 },
    );
  }

  const country = findCountry(payload.countryCode);

  if (!country) {
    return Response.json({ message: "Choose a supported country." }, { status: 400 });
  }

  const normalizedPhoneNumber = normalizePhoneNumber(
    payload.phoneNumber,
    country,
  );

  if (!normalizedPhoneNumber) {
    return Response.json(
      { message: "Enter a valid phone number for daily texts." },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("daily_text_subscribers")
      .upsert(
        {
          phone_number: normalizedPhoneNumber,
          country_code: country.code,
          country_name: country.name,
          country_calling_code: country.callingCode,
          timezone: country.timezone,
          delivery_hour: 7,
          sample_message: DAILY_SAMPLE,
          active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "phone_number,country_code" },
      )
      .select("country_name, timezone, delivery_hour")
      .single();

    if (error) {
      return Response.json(
        { message: "We could not save your signup right now." },
        { status: 500 },
      );
    }

    return Response.json({
      message: `You're set. Your daily text will arrive at 7am in ${data.country_name}.`,
      subscriber: data,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Missing")
        ? "Supabase is not configured yet."
        : "We could not save your signup right now.";

    return Response.json({ message }, { status: 500 });
  }
}
