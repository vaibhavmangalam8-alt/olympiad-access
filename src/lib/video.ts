export function resolveVideoId(lecture: {
  videoId?: string | null;
  videoUrl?: string | null;
}): string | null {
  const direct = lecture.videoId?.trim();
  if (direct) return direct;

  const raw = lecture.videoUrl?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    const paramsV = url.searchParams.get("v");
    if (paramsV) return paramsV;

    const path = url.pathname.replace(/^\/+/, "");
    if (host === "youtu.be") {
      const first = path.split("/")[0];
      if (first) return first;
    }

    const liveOrShort = ["live", "shorts", "embed"].find((segment) =>
      path.startsWith(`${segment}/`),
    );
    if (liveOrShort) {
      const id = path.slice(liveOrShort.length + 1).split("/")[0];
      if (id) return id;
    }

    return null;
  } catch {
    return null;
  }
}
