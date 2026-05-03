export const COUNTRIES = [
  {
    code: "GB",
    name: "United Kingdom",
    callingCode: "+44",
    timezone: "Europe/London",
  },
  {
    code: "US",
    name: "United States",
    callingCode: "+1",
    timezone: "America/New_York",
  },
  {
    code: "CA",
    name: "Canada",
    callingCode: "+1",
    timezone: "America/Toronto",
  },
  {
    code: "NG",
    name: "Nigeria",
    callingCode: "+234",
    timezone: "Africa/Lagos",
  },
  {
    code: "GH",
    name: "Ghana",
    callingCode: "+233",
    timezone: "Africa/Accra",
  },
  {
    code: "KE",
    name: "Kenya",
    callingCode: "+254",
    timezone: "Africa/Nairobi",
  },
  {
    code: "ZA",
    name: "South Africa",
    callingCode: "+27",
    timezone: "Africa/Johannesburg",
  },
  {
    code: "JM",
    name: "Jamaica",
    callingCode: "+1",
    timezone: "America/Jamaica",
  },
  {
    code: "IN",
    name: "India",
    callingCode: "+91",
    timezone: "Asia/Kolkata",
  },
  {
    code: "PH",
    name: "Philippines",
    callingCode: "+63",
    timezone: "Asia/Manila",
  },
  {
    code: "AU",
    name: "Australia",
    callingCode: "+61",
    timezone: "Australia/Sydney",
  },
  {
    code: "NZ",
    name: "New Zealand",
    callingCode: "+64",
    timezone: "Pacific/Auckland",
  },
] as const;

export type Country = (typeof COUNTRIES)[number];

export function findCountry(countryCode: string): Country | undefined {
  return COUNTRIES.find((country) => country.code === countryCode);
}
