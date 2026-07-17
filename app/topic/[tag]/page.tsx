import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { TypeBadge } from "@/components/resource-bits";
import {
	authorStr,
	formatDate,
	getAllTopics,
	getByTopic,
	TOPIC_DESC,
} from "@/lib/resources";

export function generateStaticParams() {
	return getAllTopics().map((topic) => ({ tag: encodeURIComponent(topic) }));
}

export default async function TopicPage({
	params,
}: {
	params: Promise<{ tag: string }>;
}) {
	const { tag } = await params;
	const topic = decodeURIComponent(tag);
	const items = getByTopic(topic);
	if (items.length === 0) notFound();

	const desc =
		TOPIC_DESC[topic] ?? "Every resource in the index tagged with this topic.";

	return (
		<div
			className="mx-auto max-w-[1120px] px-6 pt-7 pb-16"
			style={{ animation: "qtfade 0.3s ease" }}
		>
			<Link
				href="/#explore"
				className="inline-flex items-center gap-[7px] py-1.5 font-mono text-[14px] text-mut no-underline hover:text-tx"
			>
				<Icon name="arrow-left" size={15} />
				All topics
			</Link>

			<div className="relative mt-3.5 overflow-hidden border border-bd bg-card p-7">
				<div className="relative font-mono text-[12px] uppercase tracking-[0.14em] text-cyan">
					Topic
				</div>
				<h1 className="relative mt-2 font-bold text-[clamp(28px,4vw,42px)] tracking-[-0.02em] text-tx">
					{topic}
				</h1>
				<p className="relative mt-3 max-w-[64ch] text-[15.5px] leading-[1.6] text-mut">
					{desc}
				</p>
				<div className="relative mt-3.5 font-mono text-[13px] text-tx-2">
					{items.length} resources tagged
				</div>
			</div>

			<div className="mt-[22px] flex flex-col gap-3">
				{items.map((r) => (
					<Link
						key={r.id}
						href={`/resource/${r.id}`}
						className="flex items-start gap-4 border border-bd bg-card p-[18px] no-underline hover:border-bd-2"
					>
						<div className="min-w-0 flex-1">
							<div className="mb-[7px] flex flex-wrap items-center gap-2.5">
								<TypeBadge type={r.type} />
								<span className="font-mono text-[11.5px] text-faint">
									{formatDate(r.date)}
								</span>
							</div>
							<h3 className="m-0 font-bold text-[17px] leading-[1.3] tracking-[-0.01em] text-tx">
								{r.title}
							</h3>
							<div className="mt-[5px] text-[13px] text-mut">
								{authorStr(r.authors)} · {r.source}
							</div>
						</div>
						<Icon
							name="chevron-right"
							size={16}
							className="flex-none text-faint"
						/>
					</Link>
				))}
			</div>
		</div>
	);
}
