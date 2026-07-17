import Link from "next/link";

export function SiteFooter() {
	return (
		<footer className="border-t border-bd bg-bg-2">
			<div className="mx-auto flex max-w-[1320px] flex-wrap items-start justify-between gap-7 px-6 py-9">
				<div className="max-w-[34ch]">
					<div className="flex items-center gap-2.5">
						<span className="font-mono font-bold text-[14px] text-tx">
							QuantumThreat·BTC
						</span>
					</div>
					<p className="mt-3 text-[13px] leading-relaxed text-mut">
						An open, community-curated index of everything on the quantum threat
						to Bitcoin. Every entry links to its authoritative source.
					</p>
				</div>
				<div className="flex flex-wrap gap-12">
					<div className="flex flex-col gap-[9px]">
						<span className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
							Explore
						</span>
						<Link
							href="/catalog"
							className="text-[13.5px] text-tx-2 hover:text-cyan"
						>
							Catalog
						</Link>
						<Link
							href="/#explore"
							className="text-[13.5px] text-tx-2 hover:text-cyan"
						>
							Topics
						</Link>
						<Link
							href="/about"
							className="text-[13.5px] text-tx-2 hover:text-cyan"
						>
							Methodology
						</Link>
					</div>
					<div className="flex flex-col items-start gap-3">
						<span className="font-mono font-bold text-[13px] text-orange-2">
							QT·BTC
						</span>
						<span className="font-mono text-[12px] text-faint">
							open index · v1.0
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
