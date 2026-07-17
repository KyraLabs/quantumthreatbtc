export default function Home() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
			<span className="rounded-full border border-foreground/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-foreground/60">
				Work in progress
			</span>
			<h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
				QuantumThreat BTC
			</h1>
			<p className="max-w-xl text-balance text-lg leading-8 text-foreground/70">
				A curated hub for everything about the quantum threat to Bitcoin:
				papers, BIPs, articles, YouTube videos, Delving Bitcoin posts, and
				mailing-list threads, gathered in one place.
			</p>
		</main>
	);
}
