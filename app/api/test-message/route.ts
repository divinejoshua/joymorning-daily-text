import { formatDailyPassageMessage } from "@/lib/daily-message";
import { sendSms } from "@/lib/twilio";

export const runtime = "nodejs";

type TestMessagePayload = {
  phoneNumber?: unknown;
};

export async function POST(request: Request) {
  let payload: TestMessagePayload;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { message: "Send a valid test request." },
      { status: 400 },
    );
  }

  if (typeof payload.phoneNumber !== "string") {
    return Response.json(
      { message: "Phone number is required." },
      { status: 400 },
    );
  }

  const phoneNumber = payload.phoneNumber.replace(/[\s().-]/g, "");

  if (!/^\+\d{8,15}$/.test(phoneNumber)) {
    return Response.json(
      { message: "Enter the number with country code, like +447123456789." },
      { status: 400 },
    );
  }

  try {
    const message = formatDailyPassageMessage();
    const result = await sendSms({ to: phoneNumber, body: message });

    return Response.json({
      message: "Test passage sent.",
      passage: message,
      twilio: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Twilio could not send the test message.";

    return Response.json({ message }, { status: 500 });
  }
}
