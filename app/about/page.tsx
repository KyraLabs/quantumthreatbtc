import { Icon } from "@/components/icon";
import { REL_META } from "@/lib/resources";

const CRITERIA = [
	{
		icon: "crosshair",
		title: "Primary sources first",
		body: "We link to the paper, BIP, thread or talk itself — never a summary of a summary. If a claim matters, you can verify it at the source.",
	},
	{
		icon: "scale",
		title: "Rated for relevance, not hype",
		body: "Each item gets a quantum-relevance rating so a headline-grabbing hardware press release never outranks a load-bearing cryptography result.",
	},
	{
		icon: "git-branch",
		title: "Open and versioned",
		body: "The catalog is community-curated in the open. Additions and metadata corrections happen via pull request, with an audit trail.",
	},
	{
		icon: "shield-check",
		title: "Correct metadata",
		body: "Authors, dates, sources and tags are checked. Fast filtering only works if the underlying data is trustworthy.",
	},
];

const REL_SCALE: Record<keyof typeof REL_META, string> = {
	direct:
		"Bears directly on the attack or the defense: key recovery, exposure, migration mechanics, PQ signatures for Bitcoin.",
	adjacent:
		"Important context that shapes the threat: economics, timelines, mining effects, general PQ standards.",
	contextual:
		"Background and general-audience material: hardware milestones, primers and explainers.",
};

export default function AboutPage() {
	return (
		<div
			className="mx-auto max-w-[760px] px-6 pt-11 pb-[72px]"
			style={{ animation: "qtfade 0.3s ease" }}
		>
			<div className="font-mono text-[12px] uppercase tracking-[0.14em] text-mut">
				About &amp; methodology
			</div>
			<h1 className="mt-2 font-bold text-[clamp(30px,4.5vw,46px)] leading-[1.1] tracking-[-0.02em] text-tx">
				How this index is curated
			</h1>
			<p className="mt-5 text-[18px] leading-[1.7] text-tx-2">
				A single, searchable index of the material on quantum computing and
				Bitcoin: primary sources, correct metadata, and a relevance rating for
				how directly each item bears on the threat.
			</p>

			<div className="mt-9 grid gap-3.5">
				{CRITERIA.map((c) => (
					<div
						key={c.title}
						className="flex gap-4 border border-bd bg-card p-5"
					>
						<div className="grid h-[38px] w-[38px] flex-none place-items-center bg-[var(--tint-cyan)] text-cyan">
							<Icon name={c.icon} size={18} />
						</div>
						<div>
							<h3 className="m-0 mb-[5px] font-bold text-[16px] text-tx">
								{c.title}
							</h3>
							<p className="m-0 text-[14.5px] leading-[1.6] text-mut">
								{c.body}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className="mt-9 border-t border-bd pt-7">
				<h2 className="m-0 mb-3.5 font-bold text-[20px] tracking-[-0.01em] text-tx">
					The relevance scale
				</h2>
				<div className="flex flex-col gap-2.5">
					{(Object.keys(REL_META) as (keyof typeof REL_META)[]).map((k) => (
						<div
							key={k}
							className="flex items-start gap-3.5 border border-bd bg-card px-4 py-3.5"
						>
							<span
								className="mt-[5px] h-2.5 w-2.5 flex-none rounded-full"
								style={{ background: REL_META[k].color }}
							/>
							<div>
								<div className="font-bold text-[15px] text-tx">
									{REL_META[k].label}
								</div>
								<div className="mt-0.5 text-[14px] text-mut">
									{REL_SCALE[k]}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
