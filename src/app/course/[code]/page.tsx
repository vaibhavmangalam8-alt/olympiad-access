import { notFound } from "next/navigation";
import CourseSurface from "@/components/CourseSurface";
import { getCourseWorkspace } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const workspace = await getCourseWorkspace(code.toUpperCase());
  if (!workspace) notFound();
  return <CourseSurface initial={workspace} />;
}
