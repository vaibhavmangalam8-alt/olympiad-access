import { NextRequest, NextResponse } from "next/server";
import { setHomeworkDone } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const lectureId = Number(id);
    if (!Number.isInteger(lectureId) || lectureId <= 0) {
      return NextResponse.json({ error: "Invalid lecture id." }, { status: 400 });
    }
    const body = (await req.json()) as { done?: boolean };
    const result = await setHomeworkDone(lectureId, Boolean(body.done));
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to update homework", err);
    return NextResponse.json({ error: "Failed to update homework." }, { status: 500 });
  }
}
