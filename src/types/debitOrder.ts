export interface DebitOrder {
  id: string; // == supporter's Firebase Auth UID
  userId: string;

  applicantType: "individual" | "business";

  // Individual
  fullName?: string;
  idNumber?: string;

  // Business
  companyName?: string;
  registrationNumber?: string;
  contactPerson?: string;

  // Shared contact
  email: string;
  phone: string;

  // Banking mandate details
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branchCode: string;
  bankAccountType: "Cheque/Current" | "Savings";

  // Debit order specifics
  tier: "250" | "500" | "1000" | "2500" | "custom";
  amount: number;
  debitDay: 1 | 15 | 25;
  commitmentMonths: number; // 6–12
  startDate: string; // ISO date the first debit will be attempted

  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: string;
}

export const DEBIT_ORDER_TIERS = [
  { tier: "250", amount: 250, label: "Conservation Friend" },
  { tier: "500", amount: 500, label: "Wildlife Guardian" },
  { tier: "1000", amount: 1000, label: "Habitat Protector" },
  { tier: "2500", amount: 2500, label: "Legacy Partner" },
] as const;
