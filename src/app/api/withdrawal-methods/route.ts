import { NextResponse } from "next/server";

// Static catalog of withdrawal methods supported by Khidma.
// Real provider integrations are connected via the PaymentProvider table;
// until official APIs are integrated, methods are marked `mock: true`
// so the UI never lies about real transactions.
export async function GET() {
  const methods = [
    { id: "biat", name: "BIAT Bank Transfer", type: "BANK", fee: "1%", time: "1-2 business days", logo: "🏦", mock: true, supported: true },
    { id: "tijari", name: "TIJARI Bank Transfer", type: "BANK", fee: "1%", time: "1-2 business days", logo: "🏦", mock: true, supported: true },
    { id: "zitouna", name: "Zitouna Bank", type: "BANK", fee: "1%", time: "1-2 business days", logo: "🏦", mock: true, supported: true },
    { id: "post", name: "Tunisian Post", type: "LOCAL", fee: "0.5%", time: "2-3 business days", logo: "📮", mock: true, supported: true },
    { id: "d17", name: "D17 Mobile", type: "LOCAL", fee: "0.5%", time: "Instant", logo: "📱", mock: true, supported: true },
    { id: "intl", name: "International Bank Transfer", type: "INTERNATIONAL", fee: "2%", time: "3-5 business days", logo: "🌍", mock: true, supported: true },
    { id: "wu", name: "Western Union", type: "INTERNATIONAL", fee: "2.5%", time: "1-3 business days", logo: "💸", mock: true, supported: true },
  ];

  return NextResponse.json({ methods });
}
