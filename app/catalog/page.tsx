import { CatalogClient } from "@/components/catalog-client";

export default async function CatalogPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const sp = await searchParams;
	const q = typeof sp.q === "string" ? sp.q : "";
	const autoFocus = sp.focus === "1";
	return <CatalogClient initialQuery={q} autoFocus={autoFocus} />;
}
