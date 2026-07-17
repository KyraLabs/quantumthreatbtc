import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { RelevanceDot, TypeBadge } from "@/components/resource-bits";
import {
	authorStr,
	formatDate,
	getResource,
	REL_META,
	RESOURCES,
	relatedResources,
	TYPE_META,
} from "@/lib/resources";

export function generateStaticParams() {
	return RESOURCES.map((r) => ({ id: r.id }));
}

export default async function ResourcePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const resource = getResource(id);
	if (!resource) notFound();

	const related = relatedResources(resource);
	const hasNote = resource.note.trim().length > 0;

	return (
		<div
			className="mx-auto max-w-[900px] px-6 pt-7 pb-16"
			style={{ animation: "qtfade 0.3s ease" }}
		>
			<Link
				href="/catalog"
				className="inline-flex items-center gap-[7px] py-1.5 font-mono text-[14px] text-mut no-underline hover:text-tx"
			>
				<Icon name="arrow-left" size={15} />
				Back
			</Link>

			<div className="mt-2.5">
				<div className="mb-4 flex flex-wrap items-center gap-2.5">
					<TypeBadge type={resource.type} iconSize={13} />
					<span className="inline-flex items-center gap-[7px] border border-bd px-2.5 py-1 text-[13px] text-tx-2">
						<RelevanceDot relevance={resource.relevance} />
						{REL_META[resource.relevance].label} relevance
					</span>
				</div>
				<h1 className="m-0 text-balance text-[clamp(26px,4vw,38px)] leading-[1.15] tracking-[-0.02em] text-tx">
					{resource.title}
				</h1>
				<div className="mt-3.5 flex flex-wrap gap-4 text-[14px] text-mut">
					<span className="inline-flex items-center gap-1.5">
						<Icon name="users" size={15} /> {authorStr(resource.authors)}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Icon name="calendar" size={15} /> {formatDate(resource.date)}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Icon name="globe" size={15} /> {resource.source}
					</span>
				</div>
				<a
					href={resource.url}
					target="_blank"
					rel="noopener"
					className="mt-[22px] inline-flex items-center gap-2.5 bg-orange-2 px-5 py-3 font-bold text-[15px] text-[#141517] no-underline hover:bg-orange"
				>
					<Icon name="external-link" size={15} />
					Read the original at {resource.source}
				</a>

				<div className="mt-8 border-t border-bd pt-7">
					<div className="mb-3 font-mono text-[12px] uppercase tracking-[0.14em] text-mut">
						Summary
					</div>
					<p className="m-0 text-[17px] leading-[1.7] text-tx-2">
						{resource.summary}
					</p>
				</div>

				{hasNote && (
					<div className="mt-6 border border-bd border-l-[3px] border-l-orange-2 bg-[var(--tint-orange)] px-5 py-[18px]">
						<div className="mb-2 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-orange-2">
							<Icon name="pencil" size={15} /> Curator note
						</div>
						<p className="m-0 text-[15px] leading-[1.65] text-tx-2">
							{resource.note}
						</p>
					</div>
				)}

				<div className="mt-[26px]">
					<div className="mb-3 font-mono text-[12px] uppercase tracking-[0.14em] text-mut">
						Topics
					</div>
					<div className="flex flex-wrap gap-2">
						{resource.tags.map((tag) => (
							<Link
								key={tag}
								href={`/topic/${encodeURIComponent(tag)}`}
								className="border border-bd bg-card px-3 py-1.5 font-mono text-[12.5px] text-tx-2 no-underline hover:border-cyan hover:text-cyan"
							>
								{tag}
							</Link>
						))}
					</div>
				</div>

				{related.length > 0 && (
					<div className="mt-10 border-t border-bd pt-7">
						<h2 className="m-0 mb-4 font-bold text-[19px] tracking-[-0.01em] text-tx">
							Related resources
						</h2>
						<div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
							{related.map((r) => (
								<Link
									key={r.id}
									href={`/resource/${r.id}`}
									className="flex flex-col gap-2.5 border border-bd bg-card p-[15px] no-underline hover:border-bd-2"
								>
									<span
										className="self-start border border-bd px-[7px] py-[3px] font-mono text-[10.5px] uppercase tracking-[0.05em]"
										style={{
											color: TYPE_META[r.type].color,
											background: TYPE_META[r.type].tint,
										}}
									>
										{TYPE_META[r.type].label}
									</span>
									<h3 className="m-0 font-bold text-[14.5px] leading-[1.35] text-tx">
										{r.title}
									</h3>
									<span className="font-mono text-[11px] text-faint">
										{formatDate(r.date)}
									</span>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
