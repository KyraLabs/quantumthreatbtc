export type ResourceType =
	| "bip"
	| "paper"
	| "article"
	| "video"
	| "delving"
	| "mailing"
	| "news";

export type Relevance = "direct" | "adjacent" | "contextual";

export interface Resource {
	id: string;
	type: ResourceType;
	title: string;
	authors: string[];
	source: string;
	url: string;
	/** ISO date, YYYY-MM-DD. */
	date: string;
	relevance: Relevance;
	tags: string[];
	summary: string;
	note: string;
}

export interface TypeMeta {
	label: string;
	/** Lucide icon name. */
	icon: string;
	/** CSS variable reference for the accent color. */
	color: string;
	/** CSS variable reference for the tint background. */
	tint: string;
}

export interface RelevanceMeta {
	label: string;
	color: string;
	rank: number;
}

export const TYPE_META: Record<ResourceType, TypeMeta> = {
	bip: {
		label: "BIP",
		icon: "file-code",
		color: "var(--orange-2)",
		tint: "var(--tint-orange)",
	},
	paper: {
		label: "Paper",
		icon: "file-text",
		color: "var(--cyan)",
		tint: "var(--tint-cyan)",
	},
	article: {
		label: "Article",
		icon: "newspaper",
		color: "var(--tx-2)",
		tint: "var(--tint-neutral)",
	},
	video: {
		label: "Video",
		icon: "play",
		color: "var(--red)",
		tint: "var(--tint-red)",
	},
	delving: {
		label: "Delving",
		icon: "messages-square",
		color: "var(--cyan)",
		tint: "var(--tint-cyan)",
	},
	mailing: {
		label: "Mailing list",
		icon: "mail",
		color: "var(--tx-2)",
		tint: "var(--tint-neutral)",
	},
	news: {
		label: "News / Advance",
		icon: "zap",
		color: "var(--orange-2)",
		tint: "var(--tint-orange)",
	},
};

export const REL_META: Record<Relevance, RelevanceMeta> = {
	direct: { label: "Direct", color: "var(--red)", rank: 3 },
	adjacent: { label: "Adjacent", color: "var(--orange-2)", rank: 2 },
	contextual: { label: "Contextual", color: "var(--cyan)", rank: 1 },
};

export const TOPIC_DESC: Record<string, string> = {
	"post-quantum cryptography":
		"Signature schemes, KEMs and hashes designed to resist quantum attacks — and how they might land in Bitcoin.",
	signatures:
		"ECDSA and Schnorr are the quantum-vulnerable core. Everything about replacing or protecting them.",
	migration:
		"How a live network with a fixed money supply moves quantum-vulnerable coins to safety.",
	Shor: "Shor's algorithm breaks the discrete-log problem behind secp256k1 keys. Resource estimates and timelines.",
	Grover:
		"Grover's quadratic speedup against SHA-256 — its real, limited effect on mining and hashing.",
	"address exposure":
		"Which UTXOs reveal a public key, when, and how much of the supply is exposed.",
	timelines:
		"When, if ever, a cryptographically-relevant quantum computer arrives. Estimates and skepticism.",
	"hash functions":
		"SHA-256, tagged hashes and their quantum resistance across mining and commitments.",
	Taproot:
		"How P2TR outputs expose keys and what a quantum-resistant Taproot successor could look like.",
	"key rotation":
		"Wallet and protocol mechanics for rotating to post-quantum keys without losing funds.",
	standards:
		"BIPs, NIST selections and the specification work that turns research into deployable code.",
	hardware:
		"The quantum processors themselves — qubit counts, error correction and what they can actually run.",
	economics:
		"Incentives, attack cost and the market consequences of a credible quantum threat.",
	consensus:
		"Soft forks, flag days and the consensus changes any migration would require.",
	mining:
		"Proof-of-work under Grover — difficulty, hashrate and whether miners are meaningfully affected.",
};

export const RESOURCES: Resource[] = [
	{
		id: "r1",
		type: "bip",
		title: "BIP-360: Pay to Quantum Resistant Hash (P2QRH)",
		authors: ["Hunter Beast"],
		source: "bitcoin/bips",
		url: "https://github.com/bitcoin/bips",
		date: "2024-09-30",
		relevance: "direct",
		tags: [
			"post-quantum cryptography",
			"signatures",
			"address exposure",
			"standards",
		],
		summary:
			"Specifies a new output type that commits to a post-quantum public key via a hash, keeping the actual PQ key hidden until spend. Frames the migration primitive the ecosystem would build on.",
		note: "The most concrete standards-track work to date. Read alongside the QuBit soft-fork discussion to understand the deployment plan.",
	},
	{
		id: "r2",
		type: "article",
		title: "Bitcoin and quantum computing: a survey of the threat model",
		authors: ["Jameson Lopp"],
		source: "lopp.net",
		url: "https://lopp.net",
		date: "2025-02-11",
		relevance: "direct",
		tags: ["timelines", "address exposure", "post-quantum cryptography"],
		summary:
			"A structured, skeptical walk through what quantum computers could and could not do to Bitcoin, separating the ECDSA key-recovery risk from the overstated mining risk.",
		note: "A good first read for anyone new to the topic — clarifies which fears are load-bearing.",
	},
	{
		id: "r3",
		type: "paper",
		title:
			"Estimating the resources required to run Shor’s algorithm on secp256k1",
		authors: ["Divesh Aggarwal", "Gavin Brennen"],
		source: "arXiv",
		url: "https://arxiv.org",
		date: "2023-11-04",
		relevance: "direct",
		tags: ["Shor", "signatures", "timelines"],
		summary:
			"Derives logical and physical qubit counts, gate depth and wall-clock estimates for recovering a Bitcoin private key from an exposed public key.",
		note: "",
	},
	{
		id: "r4",
		type: "paper",
		title:
			"Grover’s algorithm and the security margin of SHA-256 in Bitcoin mining",
		authors: ["C. Y. Ramos"],
		source: "IACR ePrint",
		url: "https://eprint.iacr.org",
		date: "2022-06-18",
		relevance: "adjacent",
		tags: ["Grover", "hash functions", "mining"],
		summary:
			"Shows the quadratic speedup translates into only a modest advantage under realistic circuit overheads and difficulty adjustment, tempering mining-collapse narratives.",
		note: "",
	},
	{
		id: "r5",
		type: "delving",
		title: "Pay-to-Taproot exposure once a public key is revealed",
		authors: ["conduition"],
		source: "Delving Bitcoin",
		url: "https://delvingbitcoin.org",
		date: "2024-12-02",
		relevance: "direct",
		tags: ["address exposure", "Taproot", "signatures"],
		summary:
			"Traces exactly when a Taproot output leaks its key and argues that reuse and mempool timing widen the window an attacker would need.",
		note: "",
	},
	{
		id: "r6",
		type: "mailing",
		title: "Post-quantum signature schemes for Bitcoin: tradeoffs",
		authors: ["Tim Ruffing"],
		source: "bitcoin-dev",
		url: "https://groups.google.com",
		date: "2024-07-22",
		relevance: "direct",
		tags: ["post-quantum cryptography", "signatures", "consensus"],
		summary:
			"Compares hash-based, lattice and code-based signatures on witness size, verification cost and consensus impact for a hypothetical PQ output type.",
		note: "",
	},
	{
		id: "r7",
		type: "video",
		title: "The quantum FUD, quantified",
		authors: ["Andrew Poelstra"],
		source: "YouTube · Chaincode",
		url: "https://youtube.com",
		date: "2025-01-15",
		relevance: "adjacent",
		tags: ["timelines", "Shor", "post-quantum cryptography"],
		summary:
			"A talk that puts numbers to the threat: what an attacker needs, what exists today, and how much runway the network realistically has.",
		note: "",
	},
	{
		id: "r8",
		type: "news",
		title: "IBM unveils the 1,121-qubit Condor processor",
		authors: ["IBM Research"],
		source: "IBM Newsroom",
		url: "https://newsroom.ibm.com",
		date: "2023-12-04",
		relevance: "contextual",
		tags: ["hardware", "timelines"],
		summary:
			"A physical-qubit milestone that is far from the fault-tolerant machine required to threaten secp256k1, but a useful marker of the hardware curve.",
		note: "",
	},
	{
		id: "r9",
		type: "news",
		title: "Google’s Willow chip demonstrates below-threshold error correction",
		authors: ["Google Quantum AI"],
		source: "Nature",
		url: "https://nature.com",
		date: "2024-12-09",
		relevance: "contextual",
		tags: ["hardware", "timelines"],
		summary:
			"Error rates fall as the surface-code lattice grows — the qualitative result that matters far more than raw qubit counts for the long-run threat.",
		note: "The first genuinely load-bearing hardware result: it shows error correction scaling in the right direction.",
	},
	{
		id: "r10",
		type: "article",
		title: "A migration path for quantum-vulnerable UTXOs",
		authors: ["Steve Lee"],
		source: "Spiral",
		url: "https://spiral.xyz",
		date: "2025-03-20",
		relevance: "direct",
		tags: ["migration", "address exposure", "key rotation"],
		summary:
			"Sketches a phased migration: enable a PQ output type, incentivise moves, and consider the fate of provably-lost and exposed coins.",
		note: "",
	},
	{
		id: "r11",
		type: "paper",
		title: "Hash-based signatures for a post-quantum Bitcoin",
		authors: ["Ethan Heilman"],
		source: "arXiv",
		url: "https://arxiv.org",
		date: "2024-05-08",
		relevance: "direct",
		tags: ["post-quantum cryptography", "signatures", "hash functions"],
		summary:
			"Argues hash-based schemes (SPHINCS+, XMSS) offer the most conservative security assumptions for Bitcoin, at the cost of larger signatures.",
		note: "",
	},
	{
		id: "r12",
		type: "bip",
		title: "QuBit: a soft-fork deployment plan for P2QRH",
		authors: ["Hunter Beast"],
		source: "bitcoin/bips",
		url: "https://github.com/bitcoin/bips",
		date: "2024-11-12",
		relevance: "direct",
		tags: ["migration", "standards", "signatures"],
		summary:
			"Companion to BIP-360 describing activation, versioning and the transition period for a quantum-resistant output type.",
		note: "",
	},
	{
		id: "r13",
		type: "delving",
		title: "Quantifying reused-address exposure across the UTXO set",
		authors: ["0xB10C"],
		source: "Delving Bitcoin",
		url: "https://delvingbitcoin.org",
		date: "2025-02-28",
		relevance: "direct",
		tags: ["address exposure", "economics"],
		summary:
			"A data study measuring how many coins sit at addresses whose public keys are already visible on-chain — the coins at immediate risk on Q-Day.",
		note: "",
	},
	{
		id: "r14",
		type: "mailing",
		title: "Do we need a flag day for quantum migration?",
		authors: ["Matt Corallo"],
		source: "bitcoin-dev",
		url: "https://groups.google.com",
		date: "2025-04-03",
		relevance: "adjacent",
		tags: ["migration", "timelines", "consensus"],
		summary:
			"Opens the debate on whether a hard deadline to invalidate legacy spends is ever justifiable, and what it would cost socially.",
		note: "",
	},
	{
		id: "r15",
		type: "article",
		title: "What Q-Day means for cold storage",
		authors: ["River Research"],
		source: "River",
		url: "https://river.com",
		date: "2024-10-01",
		relevance: "adjacent",
		tags: ["address exposure", "timelines", "economics"],
		summary:
			"Practical guidance for holders: which storage patterns expose keys, and why moving funds is itself the moment of maximum exposure.",
		note: "",
	},
	{
		id: "r16",
		type: "video",
		title: "Post-quantum cryptography 101 for Bitcoiners",
		authors: ["Justin Drake"],
		source: "YouTube · Bitcoin++",
		url: "https://youtube.com",
		date: "2024-08-19",
		relevance: "contextual",
		tags: ["post-quantum cryptography", "signatures"],
		summary:
			"An accessible primer on lattices, hashes and what “quantum-resistant” actually guarantees, aimed at protocol-literate viewers.",
		note: "",
	},
	{
		id: "r17",
		type: "paper",
		title: "Lattice-based signatures: FALCON and Dilithium sizes on-chain",
		authors: ["NIST PQC"],
		source: "NIST",
		url: "https://nist.gov",
		date: "2022-07-05",
		relevance: "adjacent",
		tags: ["post-quantum cryptography", "signatures", "standards"],
		summary:
			"The standardised lattice signatures and their concrete sizes — the numbers that decide whether they fit Bitcoin’s witness economics.",
		note: "",
	},
	{
		id: "r18",
		type: "delving",
		title: "Sketching a P2QRH address format",
		authors: ["Hunter Beast"],
		source: "Delving Bitcoin",
		url: "https://delvingbitcoin.org",
		date: "2024-10-14",
		relevance: "direct",
		tags: ["post-quantum cryptography", "address exposure", "standards"],
		summary:
			"Working through the encoding, versioning and human-facing format for quantum-resistant addresses.",
		note: "",
	},
	{
		id: "r19",
		type: "news",
		title: "NIST finalizes its first three post-quantum standards",
		authors: ["NIST"],
		source: "NIST",
		url: "https://nist.gov",
		date: "2024-08-13",
		relevance: "adjacent",
		tags: ["post-quantum cryptography", "standards", "timelines"],
		summary:
			"ML-KEM, ML-DSA and SLH-DSA are finalised, giving Bitcoin proposals a stable set of vetted primitives to reference.",
		note: "",
	},
	{
		id: "r20",
		type: "article",
		title: "The economics of a quantum attack on Bitcoin",
		authors: ["Nic Carter"],
		source: "Medium",
		url: "https://medium.com",
		date: "2024-03-27",
		relevance: "adjacent",
		tags: ["economics", "address exposure", "timelines"],
		summary:
			"Models the attacker’s payoff and the market’s reaction, arguing the first credible demonstration matters more than the first theft.",
		note: "",
	},
	{
		id: "r21",
		type: "paper",
		title: "Time to break secp256k1: revised qubit estimates, 2025",
		authors: ["Craig Gidney"],
		source: "arXiv",
		url: "https://arxiv.org",
		date: "2025-05-30",
		relevance: "direct",
		tags: ["Shor", "timelines", "hardware"],
		summary:
			"Updated, more optimistic (for the attacker) estimates of the physical resources needed to break a Bitcoin key, factoring recent error-correction advances.",
		note: "Materially lowers earlier estimates — the single most important number to track over time.",
	},
	{
		id: "r22",
		type: "mailing",
		title: "Consensus cleanup and PQ readiness",
		authors: ["AJ Towns"],
		source: "bitcoin-dev",
		url: "https://groups.google.com",
		date: "2025-01-09",
		relevance: "adjacent",
		tags: ["consensus", "migration", "standards"],
		summary:
			"Considers how pending consensus-cleanup work interacts with, and could pave the way for, an eventual quantum-resistance soft fork.",
		note: "",
	},
	{
		id: "r23",
		type: "video",
		title: "Will quantum computers steal Satoshi’s coins?",
		authors: ["BTC Sessions"],
		source: "YouTube",
		url: "https://youtube.com",
		date: "2024-06-11",
		relevance: "contextual",
		tags: ["address exposure", "timelines"],
		summary:
			"A popular explainer on the fate of early P2PK coins whose public keys are permanently exposed on-chain.",
		note: "",
	},
	{
		id: "r24",
		type: "delving",
		title: "Grover speedups vs. the difficulty adjustment",
		authors: ["Pieter Wuille"],
		source: "Delving Bitcoin",
		url: "https://delvingbitcoin.org",
		date: "2024-09-05",
		relevance: "adjacent",
		tags: ["Grover", "mining", "hash functions"],
		summary:
			"Argues the difficulty adjustment absorbs a Grover-equipped miner just as it absorbs any hashrate gain, limiting the practical impact.",
		note: "",
	},
	{
		id: "r25",
		type: "article",
		title: "Key rotation UX for a post-quantum wallet",
		authors: ["Foundation Devices"],
		source: "Foundation",
		url: "https://foundation.xyz",
		date: "2025-02-02",
		relevance: "adjacent",
		tags: ["migration", "key rotation", "signatures"],
		summary:
			"Design study on how hardware wallets could guide users through rotating to PQ keys without footguns.",
		note: "",
	},
	{
		id: "r26",
		type: "paper",
		title: "Quantum-safe threshold signatures (FROST-PQ)",
		authors: ["Chelsea Komlo"],
		source: "IACR ePrint",
		url: "https://eprint.iacr.org",
		date: "2024-12-20",
		relevance: "adjacent",
		tags: ["signatures", "post-quantum cryptography"],
		summary:
			"Extends threshold Schnorr ideas toward post-quantum assumptions, relevant to multisig and custody after a migration.",
		note: "",
	},
	{
		id: "r27",
		type: "news",
		title: "Quantinuum reports a logical-qubit fidelity milestone",
		authors: ["Quantinuum"],
		source: "Press release",
		url: "https://quantinuum.com",
		date: "2025-06-10",
		relevance: "contextual",
		tags: ["hardware", "timelines"],
		summary:
			"A trapped-ion result improving logical error rates — incremental, but another data point on the fault-tolerance curve.",
		note: "",
	},
	{
		id: "r28",
		type: "bip",
		title: "P2QRH output script semantics (BIP-361 draft)",
		authors: ["Hunter Beast"],
		source: "bitcoin/bips",
		url: "https://github.com/bitcoin/bips",
		date: "2025-03-05",
		relevance: "direct",
		tags: ["standards", "signatures", "migration"],
		summary:
			"Details the scripting and validation rules for spending a quantum-resistant output, complementing the address specification.",
		note: "",
	},
	{
		id: "r29",
		type: "article",
		title: "A calm reading of the quantum timeline",
		authors: ["Jameson Lopp"],
		source: "lopp.net",
		url: "https://lopp.net",
		date: "2025-06-28",
		relevance: "adjacent",
		tags: ["timelines", "post-quantum cryptography"],
		summary:
			"Revisits expert forecasts and argues Bitcoin has time to act deliberately — provided the standards work starts now.",
		note: "",
	},
	{
		id: "r30",
		type: "paper",
		title: "Address exposure in the Bitcoin UTXO set: a 2025 measurement",
		authors: ["0xB10C", "clara"],
		source: "arXiv",
		url: "https://arxiv.org",
		date: "2025-04-18",
		relevance: "direct",
		tags: ["address exposure", "economics", "timelines"],
		summary:
			"A fresh empirical count of exposed vs. protected coins, broken down by output type and coin age, quantifying the migration surface.",
		note: "",
	},
];

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function formatDate(iso: string): string {
	const [y, mo, d] = iso.split("-");
	return `${Number.parseInt(d, 10)} ${MONTHS[Number.parseInt(mo, 10) - 1]} ${y}`;
}

export function authorStr(authors: string[]): string {
	return authors.join(", ");
}

export function authorShort(authors: string[]): string {
	return authors.length > 1
		? `${authors[0]} +${authors.length - 1}`
		: authors[0];
}

export function getResource(id: string): Resource | undefined {
	return RESOURCES.find((r) => r.id === id);
}

/** Unique topics across all resources, in first-seen order. */
export function getAllTopics(): string[] {
	return Array.from(new Set(RESOURCES.flatMap((r) => r.tags)));
}

export function topicCount(tag: string): number {
	return RESOURCES.filter((r) => r.tags.includes(tag)).length;
}

/** Topics sorted by descending resource count. */
export function topicsByCount(): { topic: string; count: number }[] {
	return getAllTopics()
		.map((topic) => ({ topic, count: topicCount(topic) }))
		.sort((a, b) => b.count - a.count);
}

export function getByTopic(tag: string): Resource[] {
	return sortList(
		RESOURCES.filter((r) => r.tags.includes(tag)),
		"newest",
	);
}

export function relatedResources(resource: Resource, limit = 3): Resource[] {
	return RESOURCES.filter((r) => r.id !== resource.id)
		.map((r) => ({
			r,
			overlap:
				r.tags.filter((t) => resource.tags.includes(t)).length +
				(r.type === resource.type ? 0.5 : 0),
		}))
		.filter((x) => x.overlap > 0)
		.sort((a, b) => b.overlap - a.overlap)
		.slice(0, limit)
		.map((x) => x.r);
}

export function recentResources(limit = 6): Resource[] {
	return RESOURCES.slice()
		.sort((a, b) => (a.date < b.date ? 1 : -1))
		.slice(0, limit);
}

export interface Stat {
	value: number;
	label: string;
}

export function deriveStats(): Stat[] {
	const count = (pred: (r: Resource) => boolean) =>
		RESOURCES.filter(pred).length;
	return [
		{ value: RESOURCES.length, label: "Resources" },
		{ value: count((r) => r.type === "paper"), label: "Papers" },
		{ value: count((r) => r.type === "bip"), label: "BIPs" },
		{
			value: count((r) => r.relevance === "direct"),
			label: "Directly relevant",
		},
	];
}

export type SortKey = "relevance" | "newest" | "oldest" | "threat";

export function sortList(list: Resource[], sort: SortKey): Resource[] {
	const byDateDesc = (a: Resource, b: Resource) => (a.date < b.date ? 1 : -1);
	const comparators: Record<SortKey, (a: Resource, b: Resource) => number> = {
		newest: byDateDesc,
		oldest: (a, b) => (a.date > b.date ? 1 : -1),
		threat: (a, b) =>
			REL_META[b.relevance].rank - REL_META[a.relevance].rank ||
			byDateDesc(a, b),
		relevance: byDateDesc,
	};
	return list.slice().sort(comparators[sort]);
}

/** Levenshtein distance, capped implicitly by short inputs. */
function levenshtein(a: string, b: string): number {
	if (a === b) return 0;
	const m = a.length;
	const n = b.length;
	if (!m) return n;
	if (!n) return m;
	let prev = Array.from({ length: n + 1 }, (_, i) => i);
	for (let i = 1; i <= m; i++) {
		const cur = [i];
		for (let j = 1; j <= n; j++) {
			cur[j] = Math.min(
				prev[j] + 1,
				cur[j - 1] + 1,
				prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
			);
		}
		prev = cur;
	}
	return prev[n];
}

function resourceWords(r: Resource): string[] {
	return `${r.title} ${r.authors.join(" ")} ${r.tags.join(" ")} ${r.summary} ${r.source} ${TYPE_META[r.type].label}`
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter(Boolean);
}

/**
 * Typo-tolerant relevance score for a resource against query tokens.
 * Returns -1 when any token has no match, so the resource is excluded.
 */
export function scoreResource(r: Resource, tokens: string[]): number {
	const words = resourceWords(r);
	const title = r.title.toLowerCase();
	let score = 0;
	for (const t of tokens) {
		let hit = 0;
		if (title.includes(t)) hit = 3;
		else if (words.some((w) => w.includes(t))) hit = 2;
		else if (
			t.length >= 4 &&
			words.some(
				(w) => Math.abs(w.length - t.length) <= 2 && levenshtein(w, t) <= 1,
			)
		)
			hit = 1;
		if (!hit) return -1;
		score += hit;
	}
	return score;
}
