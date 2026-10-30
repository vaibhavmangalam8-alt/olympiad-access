import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await getCatalog();
    return NextResponse.json(catalog);
  } catch (err) {
    console.error("Failed to load catalog", err);
    return NextResponse.json({ error: "Failed to load catalog." }, { status: 500 });
  }
}
