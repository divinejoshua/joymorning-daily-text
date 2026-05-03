type SendSmsInput = {
  to: string;
  body: string;
};

type TwilioMessageResponse = {
  sid?: string;
  status?: string;
  error_message?: string | null;
  message?: string;
};

export async function sendSms({ to, body }: SendSmsInput) {
  const accountSid = cleanEnvValue(process.env.TWILIO_ACCOUNT_SID);
  const authToken = cleanEnvValue(process.env.TWILIO_AUTH_TOKEN);
  const fromNumber = cleanEnvValue(process.env.TWILIO_FROM_NUMBER);
  const messagingServiceSid = cleanEnvValue(
    process.env.TWILIO_MESSAGING_SERVICE_SID,
  );

  if (!accountSid || !authToken) {
    throw new Error("Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN.");
  }

  if (!fromNumber && !messagingServiceSid) {
    throw new Error(
      "Missing TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID.",
    );
  }

  if (fromNumber && !/^\+\d{8,15}$/.test(fromNumber)) {
    throw new Error(
      "TWILIO_FROM_NUMBER must be an SMS-capable Twilio number in E.164 format, like +15137805350.",
    );
  }

  if (messagingServiceSid && !/^MG[0-9a-fA-F]{32}$/.test(messagingServiceSid)) {
    throw new Error("TWILIO_MESSAGING_SERVICE_SID must start with MG.");
  }

  const bodyParams = new URLSearchParams({
    To: to,
    Body: body,
  });

  if (messagingServiceSid) {
    bodyParams.set("MessagingServiceSid", messagingServiceSid);
  } else if (fromNumber) {
    bodyParams.set("From", fromNumber);
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${accountSid}:${authToken}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams,
    },
  );

  const result = (await response.json()) as TwilioMessageResponse;

  if (!response.ok) {
    throw new Error(
      result.message ?? result.error_message ?? "Twilio could not send SMS.",
    );
  }

  return {
    sid: result.sid,
    status: result.status,
  };
}

function cleanEnvValue(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "");
}
