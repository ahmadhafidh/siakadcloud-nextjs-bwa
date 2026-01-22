// /app/api/midtrans/route.ts
import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, grossAmount, customerName, email } = body;

    if (!orderId || !grossAmount || !customerName || !email) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: "dummy-client-key",
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customerName,
        email: email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({ token: transaction.token });
  } catch (err) {
    console.error("Midtrans token error:", err);
    return NextResponse.json(
      { message: "Failed to create token" },
      { status: 500 }
    );
  }
}
