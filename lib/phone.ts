import type { Country } from "@/lib/countries";

export function normalizePhoneNumber(
  phoneNumber: string,
  country: Country,
): string | null {
  const compact = phoneNumber.replace(/[\s().-]/g, "");

  if (!compact) {
    return null;
  }

  if (compact.startsWith("+")) {
    const digits = compact.slice(1);
    return isValidDigits(digits) ? `+${digits}` : null;
  }

  const withoutLeadingZero = compact.replace(/^0+/, "");

  if (!isValidDigits(withoutLeadingZero)) {
    return null;
  }

  return `${country.callingCode}${withoutLeadingZero}`;
}

function isValidDigits(value: string): boolean {
  return /^\d{7,15}$/.test(value);
}
