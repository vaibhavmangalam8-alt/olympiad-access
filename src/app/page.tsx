import CatalogSurface from "@/components/CatalogSurface";
import { getCatalog } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getCatalog();
  return <CatalogSurface initial={catalog} />;
}
