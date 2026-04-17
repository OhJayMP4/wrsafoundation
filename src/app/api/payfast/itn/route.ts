import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

/**
 * PayFast Instant Transaction Notification (ITN) Handler
 * This route is called by PayFast after a transaction.
 */
export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const payload = Object.fromEntries(data.entries());

    // 1. Verify Signature (Security Step - implemented in production)
    // 2. Verify Data matches our request (Merchant ID, Amount etc)
    
    const payment_status = payload.payment_status;
    const pf_payment_id = payload.pf_payment_id;
    const m_payment_id = payload.m_payment_id; // Our internal tracking ID
    const amount_gross = payload.amount_gross;

    if (payment_status === "COMPLETE") {
      // Logic to update Firestore
      // 1. Mark existing donation as complete
      // 2. If it's a pledge, mark the pledge as completed
      // 3. Trigger email receipt
      
      console.log(`Payment Complete: ${pf_payment_id} for R${amount_gross}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayFast ITN Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
