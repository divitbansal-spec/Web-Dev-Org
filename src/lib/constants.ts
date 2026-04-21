export const CREDIT_VALUE_INR = 15;
export const DEVELOPER_COMMISSION_RATE = 0.07;

export const ratingRewards: Record<number, string> = {
  1: "User demotion triggered",
  2: "No change",
  3: "15 days free add-on",
  4: "₹199 cashback",
  5: "Promotion + ads + ₹499 cashback"
};

export const severityRewards: Record<string, number> = {
  SOFT: 2,
  LOW: 4,
  MEDIUM: 8,
  HIGH: 16,
  CRITICAL: 25,
  EMERGENCY: 40
};
