import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ockertfernandes@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "WRSA Foundation <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const BANK_NAME = process.env.BANK_NAME || "Standard Bank";
const BANK_ACCOUNT_NAME = process.env.BANK_ACCOUNT_NAME || "WRSA Foundation NPC";
const BANK_ACCOUNT_NUMBER = process.env.BANK_ACCOUNT_NUMBER || "000 000 000";
const BANK_BRANCH_CODE = process.env.BANK_BRANCH_CODE || "051 001";

type EmailType =
  | "pledge_invoice"        // pledger receives banking details after committing
  | "pledge_admin_notify"   // admin notified of new pledge
  | "nominee_challenge"     // nominee receives challenge invite
  | "pledge_paid";          // pledger notified that admin confirmed payment

interface EmailData {
  type: EmailType;
  pledgerName?: string;
  pledgerEmail?: string;
  pledgerPhone?: string;
  pledgerMessage?: string;
  amount?: number;
  pledgeId?: string;
  challengedBy?: string;
  challengeLink?: string;
  nomineeEmail?: string;
  nomineeName?: string;
  organization?: string;
}

const BASE = `font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1c2e24;`;
const HEADER = `background: #1c2e24; padding: 32px; text-align: center;`;
const BODY = `padding: 32px; background: #f8faf9; border: 1px solid #e5e7eb; border-top: none;`;
const FOOTER_STYLE = `padding: 16px; text-align: center; background: #1c2e24;`;
const FOOTER = `<div style="${FOOTER_STYLE}"><p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">WRSA Foundation — The Wildlife Pledge Chain</p></div>`;

function header(title: string, sub?: string) {
  return `<div style="${HEADER}">
    <h1 style="color:#c5a059;margin:0;font-size:22px;">${title}</h1>
    ${sub ? `<p style="color:rgba(255,255,255,0.65);margin:8px 0 0;font-size:14px;">${sub}</p>` : ""}
  </div>`;
}

function bankingBlock(pledgeId?: string, amount?: number) {
  return `
    <div style="background:white;border:2px solid #c5a059;border-radius:8px;padding:24px;margin:24px 0;">
      <h2 style="margin:0 0 16px;font-size:15px;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;">Payment Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;width:160px;font-size:14px;">Bank</td><td style="padding:8px 0;font-weight:700;font-size:14px;">${BANK_NAME}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Account Name</td><td style="padding:8px 0;font-weight:700;font-size:14px;">${BANK_ACCOUNT_NAME}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Account Number</td><td style="padding:8px 0;font-weight:700;font-size:14px;">${BANK_ACCOUNT_NUMBER}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Branch Code</td><td style="padding:8px 0;font-weight:700;font-size:14px;">${BANK_BRANCH_CODE}</td></tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0 8px;color:#6b7280;font-size:14px;">Amount</td>
          <td style="padding:12px 0 8px;font-weight:800;font-size:20px;color:#c5a059;">R${amount?.toLocaleString()}</td>
        </tr>
        ${pledgeId ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Payment Reference</td><td style="padding:8px 0;font-weight:700;font-size:14px;font-family:monospace;">${pledgeId.slice(0, 10).toUpperCase()}</td></tr>` : ""}
      </table>
    </div>
    <p style="font-size:13px;color:#ef4444;font-weight:700;">⚠ Please use your reference number above when making payment so we can match your contribution.</p>
  `;
}

function buildPledgeInvoiceEmail(data: EmailData): string {
  return `<div style="${BASE}">
    ${header("Your Pledge Commitment", "WRSA Foundation — Wildlife Pledge Chain")}
    <div style="${BODY}">
      <p>Dear <strong>${data.pledgerName?.split(" ")[0]}</strong>,</p>
      <p>Thank you for committing to the WRSA Foundation Wildlife Pledge Chain. Your pledge of <strong>R${data.amount?.toLocaleString()}</strong> will directly support the conservation of Southern Africa's most endangered wildlife.</p>
      <p>To complete your pledge, please make an EFT payment using the details below:</p>
      ${bankingBlock(data.pledgeId, data.amount)}
      <p style="margin-top:24px;">Once we confirm receipt of your payment, your name will appear on our public <a href="${APP_URL}/leaderboard" style="color:#c5a059;">Honour Roll</a> as a Legacy Champion.</p>
      <p style="color:#6b7280;font-size:13px;margin-top:24px;">If you have any questions, please reply to this email and we will be in touch shortly.</p>
    </div>
    ${FOOTER}
  </div>`;
}

function buildAdminNotifyEmail(data: EmailData): string {
  return `<div style="${BASE}">
    ${header("New Pledge Received")}
    <div style="${BODY}">
      <p>A new pledge has been submitted via the Wildlife Pledge Chain.</p>
      <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:24px;margin:16px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Name</td><td style="padding:8px 0;font-weight:700;">${data.pledgerName}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.pledgerEmail}" style="color:#c5a059;">${data.pledgerEmail}</a></td></tr>
          ${data.pledgerPhone ? `<tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;">${data.pledgerPhone}</td></tr>` : ""}
          ${data.organization ? `<tr><td style="padding:8px 0;color:#6b7280;">Organisation</td><td style="padding:8px 0;">${data.organization}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#6b7280;">Amount</td><td style="padding:8px 0;font-weight:800;font-size:18px;color:#c5a059;">R${data.amount?.toLocaleString()}</td></tr>
          ${data.pledgerMessage ? `<tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Message</td><td style="padding:8px 0;font-style:italic;">"${data.pledgerMessage}"</td></tr>` : ""}
        </table>
      </div>
      <a href="${APP_URL}/admin/pledges" style="display:inline-block;background:#1c2e24;color:#c5a059;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:8px;">View in Admin Dashboard →</a>
      <p style="color:#6b7280;font-size:13px;margin-top:16px;">Monitor this pledge and mark it as Paid once payment is received.</p>
    </div>
    ${FOOTER}
  </div>`;
}

function buildNomineeChallengeEmail(data: EmailData): string {
  return `<div style="${BASE}">
    ${header("You've Been Nominated", "R36K Legacy Challenge — WRSA Foundation")}
    <div style="${BODY}">
      <p>Dear <strong>${data.nomineeName?.split(" ")[0]}</strong>,</p>
      <p><strong>${data.challengedBy}</strong> has cemented their legacy in wildlife conservation and formally nominated you to join the Wildlife Pledge Chain by matching their commitment to the WRSA Foundation.</p>
      <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:24px;margin:24px 0;text-align:center;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">Challenge Amount</p>
        <p style="margin:0;font-size:36px;font-weight:900;color:#c5a059;">R${data.amount?.toLocaleString()}</p>
        <p style="margin:8px 0 0;color:#6b7280;font-size:13px;">You may match, exceed, or adjust this amount.</p>
      </div>
      <p>You have <strong>7 days</strong> to accept this challenge.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${data.challengeLink}" style="display:inline-block;background:#c5a059;color:#1c2e24;padding:16px 32px;border-radius:999px;text-decoration:none;font-weight:700;font-size:16px;">View My Challenge →</a>
      </div>
      <p style="color:#6b7280;font-size:13px;">The WRSA Foundation conserves Southern Africa's most endangered wildlife. Every rand counts.</p>
    </div>
    ${FOOTER}
  </div>`;
}

function buildPledgePaidEmail(data: EmailData): string {
  return `<div style="${BASE}">
    ${header("Payment Confirmed — Thank You!", "WRSA Foundation")}
    <div style="${BODY}">
      <p>Dear <strong>${data.pledgerName?.split(" ")[0]}</strong>,</p>
      <p>We have confirmed receipt of your payment of <strong>R${data.amount?.toLocaleString()}</strong>. Your legacy is now secured.</p>
      <p>You are now a <strong>Legacy Champion</strong> of the WRSA Foundation. Your contribution directly supports the conservation of Southern Africa's most endangered wildlife.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${APP_URL}/leaderboard" style="display:inline-block;background:#c5a059;color:#1c2e24;padding:16px 32px;border-radius:999px;text-decoration:none;font-weight:700;font-size:16px;">View the Honour Roll →</a>
      </div>
    </div>
    ${FOOTER}
  </div>`;
}

export async function POST(req: NextRequest) {
  try {
    const data: EmailData = await req.json();

    if (!resend) {
      console.warn("⚠️  EMAIL NOT SENT — RESEND_API_KEY is missing from .env.local");
      console.warn("   Type:", data.type, "| To:", data.pledgerEmail || data.nomineeEmail || ADMIN_EMAIL);
      return NextResponse.json({ success: false, simulated: true, error: "RESEND_API_KEY not configured" });
    }

    let subject = "";
    let html = "";
    let to: string[] = [];

    switch (data.type) {
      case "pledge_invoice":
        subject = `Your WRSA Foundation Pledge — R${data.amount?.toLocaleString()}`;
        html = buildPledgeInvoiceEmail(data);
        to = [data.pledgerEmail!];
        break;

      case "pledge_admin_notify":
        subject = `New Pledge: ${data.pledgerName} — R${data.amount?.toLocaleString()}`;
        html = buildAdminNotifyEmail(data);
        to = [ADMIN_EMAIL];
        break;

      case "nominee_challenge":
        subject = `${data.challengedBy} has nominated you — Wildlife Pledge Chain`;
        html = buildNomineeChallengeEmail(data);
        to = [data.nomineeEmail!];
        break;

      case "pledge_paid":
        subject = "Your WRSA Foundation payment has been confirmed";
        html = buildPledgePaidEmail(data);
        to = [data.pledgerEmail!];
        break;

      default:
        return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const result = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });

    if (result.error) {
      console.error("[EMAIL ERROR]", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (err: any) {
    console.error("[EMAIL ROUTE ERROR]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
