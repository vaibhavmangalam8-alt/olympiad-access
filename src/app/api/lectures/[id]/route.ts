import { NextRequest, NextResponse } from "next/server";
import { setLectureCompleted } from "@/lib/queries";

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
    const body = (await req.json()) as { completed?: boolean };
    const completed = Boolean(body.completed);
    const result = await setLectureCompleted(lectureId, completed);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to update lecture", err);
    return NextResponse.json(
      { error: "Failed to update lecture." },
      { status: 500 },
    );
  }
}
