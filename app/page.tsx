import Link from "next/link";
import { HeroSearch } from "@/components/hero-search";
import { Icon } from "@/components/icon";
import { RelevanceDot, TypeBadge } from "@/components/resource-bits";
import {
	authorShort,
	deriveStats,
	formatDate,
	REL_META,
	RESOURCES,
	recentResources,
	topicsByCount,
} from "@/lib/resources";

export default function HomePage() {
	const stats = deriveStats();
	const recent = recentResources(6);
	const topics = topicsByCount();
	const heroTopics = topics.slice(0, 5);

	return (
		<div style={{ animation: "qtfade 0.3s ease" }}>
			{/* Hero */}
			<section className="relative border-b border-bd">
				<div className="relative mx-auto max-w-[1120px] px-6 pt-16 pb-14">
					<h1 className="m-0 max-w-[22ch] text-balance text-[clamp(27px,4.1vw,48px)] leading-[1.14] tracking-[-0.01em] text-tx">
						The quantum threat to Bitcoin, indexed.
					</h1>
					<p className="mt-5 max-w-[56ch] text-[clamp(16px,2vw,20px)] leading-[1.5] text-mut">
						Papers, BIPs, articles, talks, forum and mailing-list threads, and
						hardware milestones. Tagged, dated, and rated for relevance.
					</p>
					<HeroSearch totalCount={RESOURCES.length} />
					<div className="mt-5 flex flex-wrap items-center gap-2">
						<span className="text-[13px] text-faint">Popular:</span>
						{heroTopics.map((t) => (
							<Link
								key={t.topic}
								href={`/topic/${encodeURIComponent(t.topic)}`}
								className="border border-bd bg-card px-[11px] py-[5px] font-mono text-[12.5px] text-tx-2 hover:border-cyan hover:text-cyan"
							>
								{t.topic}
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="mx-auto mt-9 grid max-w-[1120px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px overflow-hidden border border-bd bg-bd">
				{stats.map((s) => (
					<div key={s.label} className="bg-card px-[22px] py-5">
						<div className="font-mono font-bold text-[30px] tracking-[-0.02em] text-tx">
							{s.value}
						</div>
						<div className="mt-1 text-[12.5px] uppercase tracking-[0.1em] text-mut">
							{s.label}
						</div>
					</div>
				))}
			</section>

			{/* Latest additions */}
			<section className="mx-auto max-w-[1120px] px-6 pt-11 pb-2">
				<div className="flex flex-wrap items-baseline justify-between gap-4">
					<h2 className="m-0 font-bold text-[22px] tracking-[-0.01em] text-tx">
						Latest additions
					</h2>
					<Link
						href="/catalog"
						className="inline-flex items-center gap-1.5 font-mono text-[14px] text-cyan"
					>
						Browse all <Icon name="arrow-right" size={15} />
					</Link>
				</div>
				<div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
					{recent.map((r) => (
						<Link
							key={r.id}
							href={`/resource/${r.id}`}
							className="flex flex-col gap-3 border border-bd bg-card p-[18px] no-underline transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-bd-2"
						>
							<div className="flex items-center justify-between gap-2.5">
								<TypeBadge type={r.type} />
								<span className="font-mono text-[11.5px] text-faint">
									{formatDate(r.date)}
								</span>
							</div>
							<h3 className="m-0 font-bold text-[16.5px] leading-[1.3] tracking-[-0.01em] text-tx">
								{r.title}
							</h3>
							<p className="m-0 line-clamp-2 text-[13.5px] leading-[1.5] text-mut">
								{r.summary}
							</p>
							<div className="mt-auto flex items-center gap-2 text-[12px] text-faint">
								<RelevanceDot relevance={r.relevance} />
								{REL_META[r.relevance].label} relevance ·{" "}
								{authorShort(r.authors)}
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Explore by topic */}
			<section
				id="explore"
				className="mx-auto max-w-[1120px] scroll-mt-20 px-6 pt-11 pb-16"
			>
				<h2 className="mt-0 mb-1 font-bold text-[22px] tracking-[-0.01em] text-tx">
					Explore by topic
				</h2>
				<p className="mt-0 mb-[18px] text-[14.5px] text-mut">
					Every cluster in the threat model, from the cryptography to the
					migration.
				</p>
				<div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
					{topics.map((t) => (
						<Link
							key={t.topic}
							href={`/topic/${encodeURIComponent(t.topic)}`}
							className="flex items-center justify-between gap-3 border border-bd bg-card px-[18px] py-4 no-underline hover:border-cyan hover:bg-[var(--tint-cyan)]"
						>
							<div>
								<div className="font-bold text-[15px] tracking-[-0.01em] text-tx">
									{t.topic}
								</div>
								<div className="mt-[3px] font-mono text-[11.5px] text-faint">
									{t.count} resources
								</div>
							</div>
							<Icon name="arrow-right" size={15} className="text-cyan" />
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
