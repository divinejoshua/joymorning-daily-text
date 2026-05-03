export const DAILY_PASSAGE = {
  greeting: "Hello there",
  text: "Do not let your heart be troubled. Believe in God; believe also in me.",
  reference: "John 14:1",
} as const;

export function formatDailyPassageMessage() {
  return `${DAILY_PASSAGE.greeting}, "${DAILY_PASSAGE.text}" - ${DAILY_PASSAGE.reference}`;
}
