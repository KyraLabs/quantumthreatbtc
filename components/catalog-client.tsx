"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { RelevanceDot, TypeBadge } from "@/components/resource-bits";
import {
	authorStr,
	formatDate,
	REL_META,
	RESOURCES,
	type Relevance,
	type Resource,
	type ResourceType,
	type SortKey,
	scoreResource,
	sortList,
	TYPE_META,
} from "@/lib/resources";

type FacetKey = "types" | "rels" | "topics" | "authors";

interface Filters {
	types: Set<ResourceType>;
	rels: Set<Relevance>;
	topics: Set<string>;
	authors: Set<string>;
	from: string;
	to: string;
}

const PAGE_SIZE = 12;

function emptyFilters(): Filters {
	return {
		types: new Set(),
		rels: new Set(),
		topics: new Set(),
		authors: new Set(),
		from: "",
		to: "",
	};
}

export function CatalogClient({
	initialQuery,
	autoFocus,
}: {
	initialQuery: string;
	autoFocus: boolean;
}) {
	const [query, setQuery] = useState(initialQuery);
	const [filters, setFilters] = useState<Filters>(emptyFilters);
	const [sort, setSort] = useState<SortKey>("relevance");
	const [density, setDensity] = useState<"comfortable" | "compact">(
		"comfortable",
	);
	const [visible, setVisible] = useState(PAGE_SIZE);
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (autoFocus) searchRef.current?.focus();
	}, [autoFocus]);

	const count = useMemo(
		() => (pred: (r: Resource) => boolean) => RESOURCES.filter(pred).length,
		[],
	);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
		let list = RESOURCES.slice();
		if (filters.types.size)
			list = list.filter((r) => filters.types.has(r.type));
		if (filters.rels.size)
			list = list.filter((r) => filters.rels.has(r.relevance));
		if (filters.topics.size)
			list = list.filter((r) => r.tags.some((t) => filters.topics.has(t)));
		if (filters.authors.size)
			list = list.filter((r) => r.authors.some((a) => filters.authors.has(a)));
		if (filters.from) list = list.filter((r) => r.date >= filters.from);
		if (filters.to) list = list.filter((r) => r.date <= filters.to);

		if (tokens.length) {
			return list
				.map((r) => ({ r, s: scoreResource(r, tokens) }))
				.filter((x) => x.s >= 0)
				.sort((a, b) => b.s - a.s || (a.r.date < b.r.date ? 1 : -1))
				.map((x) => x.r);
		}
		return sortList(list, sort);
	}, [query, filters, sort]);

	// Facets are computed against the full catalog, independent of active filters.
	const facetTypes = (Object.keys(TYPE_META) as ResourceType[]).map((k) => ({
		key: k,
		label: TYPE_META[k].label,
		count: count((r) => r.type === k),
	}));
	const facetRels = (Object.keys(REL_META) as Relevance[]).map((k) => ({
		key: k,
		label: REL_META[k].label,
		color: REL_META[k].color,
		count: count((r) => r.relevance === k),
	}));
	const facetTopics = Array.from(new Set(RESOURCES.flatMap((r) => r.tags)));
	const authorCount = useMemo(() => {
		const m: Record<string, number> = {};
		for (const r of RESOURCES)
			for (const a of r.authors) m[a] = (m[a] ?? 0) + 1;
		return m;
	}, []);
	const topAuthors = Object.keys(authorCount)
		.sort((a, b) => authorCount[b] - authorCount[a])
		.slice(0, 8);

	function toggle<K extends FacetKey>(
		key: K,
		val: Filters[K] extends Set<infer T> ? T : never,
	) {
		setFilters((s) => {
			const next = new Set(s[key] as Set<unknown>);
			next.has(val) ? next.delete(val) : next.add(val);
			return { ...s, [key]: next };
		});
		setVisible(PAGE_SIZE);
	}

	function clearFilters() {
		setFilters(emptyFilters());
		setVisible(PAGE_SIZE);
	}

	// Active filter chips.
	const chips: { kind: string; label: string; onRemove: () => void }[] = [];
	for (const v of filters.types)
		chips.push({
			kind: "type",
			label: TYPE_META[v].label,
			onRemove: () => toggle("types", v),
		});
	for (const v of filters.rels)
		chips.push({
			kind: "relevance",
			label: REL_META[v].label,
			onRemove: () => toggle("rels", v),
		});
	for (const v of filters.topics)
		chips.push({
			kind: "topic",
			label: v,
			onRemove: () => toggle("topics", v),
		});
	for (const v of filters.authors)
		chips.push({
			kind: "author",
			label: v,
			onRemove: () => toggle("authors", v),
		});
	if (filters.from)
		chips.push({
			kind: "from",
			label: filters.from,
			onRemove: () => setFilters((s) => ({ ...s, from: "" })),
		});
	if (filters.to)
		chips.push({
			kind: "to",
			label: filters.to,
			onRemove: () => setFilters((s) => ({ ...s, to: "" })),
		});
	const hasFilters = chips.length > 0;
	const hasQuery = query.trim().length > 0;

	const shown = results.slice(0, visible);
	const showSummary = density === "comfortable";
	const cardPad = showSummary ? "20px" : "14px 18px";
	const moreCount = Math.min(PAGE_SIZE, results.length - visible);

	const facetInputClass = "h-[15px] w-[15px] cursor-pointer";
	const facetLabelClass =
		"flex cursor-pointer items-center gap-[9px] px-2 py-1.5 text-[13.5px] text-tx-2 hover:bg-bg-3";
	const facetHeadClass =
		"mb-2.5 font-bold text-[12px] uppercase tracking-[0.1em] text-tx-2";

	return (
		<div
			className="mx-auto max-w-[1320px] px-6 pt-7 pb-16"
			style={{ animation: "qtfade 0.3s ease" }}
		>
			<div className="mb-[18px]">
				<div className="font-mono text-[12px] uppercase tracking-[0.14em] text-mut">
					Catalog
				</div>
				<h1 className="mt-1.5 font-bold text-[30px] tracking-[-0.02em] text-tx">
					Browse the index
				</h1>
			</div>

			{/* Search */}
			<div className="flex h-[52px] items-center gap-2.5 border border-bd-2 bg-card px-4 shadow-[var(--shadow-sm)]">
				<Icon name="search" size={16} className="text-mut" />
				<input
					ref={searchRef}
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setVisible(PAGE_SIZE);
					}}
					placeholder="Search titles, authors, tags, summaries…  (typo-tolerant)"
					aria-label="Search resources"
					className="min-w-0 flex-1 border-0 bg-transparent text-[16px] text-tx outline-none"
				/>
				{hasQuery && (
					<button
						type="button"
						onClick={() => {
							setQuery("");
							setVisible(PAGE_SIZE);
						}}
						aria-label="Clear search"
						className="grid cursor-pointer place-items-center border-0 bg-transparent text-mut hover:text-tx"
					>
						<Icon name="x" size={16} />
					</button>
				)}
			</div>

			<div className="mt-[22px] flex flex-wrap items-start gap-[26px]">
				{/* Filters */}
				<aside className="sticky top-[84px] flex w-[250px] flex-none flex-col gap-[22px]">
					<div className="flex items-center justify-between">
						<span className="font-mono text-[12px] uppercase tracking-[0.14em] text-mut">
							Filters
						</span>
						{hasFilters && (
							<button
								type="button"
								onClick={clearFilters}
								className="cursor-pointer border-0 bg-transparent font-mono text-[12.5px] text-cyan"
							>
								Clear all
							</button>
						)}
					</div>

					<div>
						<div className={facetHeadClass}>Type</div>
						<div className="flex flex-col gap-0.5">
							{facetTypes.map((f) => (
								<label key={f.key} className={facetLabelClass}>
									<input
										type="checkbox"
										checked={filters.types.has(f.key)}
										onChange={() => toggle("types", f.key)}
										className={facetInputClass}
									/>
									<span className="flex-1">{f.label}</span>
									<span className="font-mono text-[11.5px] text-faint">
										{f.count}
									</span>
								</label>
							))}
						</div>
					</div>

					<div>
						<div className={facetHeadClass}>Quantum relevance</div>
						<div className="flex flex-col gap-0.5">
							{facetRels.map((f) => (
								<label key={f.key} className={facetLabelClass}>
									<input
										type="checkbox"
										checked={filters.rels.has(f.key)}
										onChange={() => toggle("rels", f.key)}
										className={facetInputClass}
									/>
									<span
										className="h-2 w-2 flex-none rounded-full"
										style={{ background: f.color }}
									/>
									<span className="flex-1">{f.label}</span>
									<span className="font-mono text-[11.5px] text-faint">
										{f.count}
									</span>
								</label>
							))}
						</div>
					</div>

					<div>
						<div className={facetHeadClass}>Topic</div>
						<div className="flex flex-wrap gap-1.5">
							{facetTopics.map((t) => {
								const active = filters.topics.has(t);
								return (
									<button
										key={t}
										type="button"
										onClick={() => toggle("topics", t)}
										className="cursor-pointer border px-2.5 py-[5px] font-mono text-[11.5px]"
										style={{
											borderColor: active ? "var(--cyan)" : "var(--bd)",
											background: active ? "var(--tint-cyan)" : "var(--bg-3)",
											color: active ? "var(--cyan)" : "var(--mut)",
										}}
									>
										{t}
									</button>
								);
							})}
						</div>
					</div>

					<div>
						<div className={facetHeadClass}>Author</div>
						<div className="flex flex-col gap-0.5">
							{topAuthors.map((a) => (
								<label key={a} className={facetLabelClass}>
									<input
										type="checkbox"
										checked={filters.authors.has(a)}
										onChange={() => toggle("authors", a)}
										className={facetInputClass}
									/>
									<span className="flex-1 truncate">{a}</span>
									<span className="font-mono text-[11.5px] text-faint">
										{authorCount[a]}
									</span>
								</label>
							))}
						</div>
					</div>

					<div>
						<div className={facetHeadClass}>Published</div>
						<div className="flex items-center gap-2">
							<input
								type="date"
								value={filters.from}
								onChange={(e) =>
									setFilters((s) => ({ ...s, from: e.target.value }))
								}
								aria-label="From date"
								className="min-w-0 flex-1 border border-bd bg-bg-3 px-2 py-[7px] font-mono text-[12.5px] text-tx-2"
							/>
							<span className="text-faint">–</span>
							<input
								type="date"
								value={filters.to}
								onChange={(e) =>
									setFilters((s) => ({ ...s, to: e.target.value }))
								}
								aria-label="To date"
								className="min-w-0 flex-1 border border-bd bg-bg-3 px-2 py-[7px] font-mono text-[12.5px] text-tx-2"
							/>
						</div>
					</div>
				</aside>

				{/* Results */}
				<div className="min-w-[320px] flex-1">
					<div className="mb-3.5 flex flex-wrap items-center justify-between gap-3.5">
						<div className="text-[14px] text-mut">
							<strong className="font-mono text-tx">{results.length}</strong>{" "}
							{results.length === 1 ? "resource" : "resources"}
							{hasQuery && (
								<span>
									{" for “"}
									<span className="text-tx-2">{query}</span>
									{"”"}
								</span>
							)}
						</div>
						<div className="flex items-center gap-3">
							<div className="flex overflow-hidden border border-bd">
								<button
									type="button"
									onClick={() => setDensity("comfortable")}
									aria-label="Comfortable density"
									title="Comfortable"
									className="grid h-8 w-[34px] cursor-pointer place-items-center border-0"
									style={{
										background:
											density === "comfortable" ? "var(--bg-3)" : "transparent",
										color:
											density === "comfortable" ? "var(--tx)" : "var(--mut)",
									}}
								>
									<Icon name="rows-3" size={15} />
								</button>
								<button
									type="button"
									onClick={() => setDensity("compact")}
									aria-label="Compact density"
									title="Compact"
									className="grid h-8 w-[34px] cursor-pointer place-items-center border-0 border-l border-l-bd"
									style={{
										background:
											density === "compact" ? "var(--bg-3)" : "transparent",
										color: density === "compact" ? "var(--tx)" : "var(--mut)",
									}}
								>
									<Icon name="list" size={15} />
								</button>
							</div>
							<label className="flex items-center gap-2 text-[13px] text-mut">
								Sort
								<select
									value={sort}
									onChange={(e) => setSort(e.target.value as SortKey)}
									className="cursor-pointer border border-bd bg-bg-3 px-2.5 py-[7px] text-[13px] text-tx-2"
								>
									<option value="relevance">Best match</option>
									<option value="newest">Newest first</option>
									<option value="oldest">Oldest first</option>
									<option value="threat">Quantum relevance</option>
								</select>
							</label>
						</div>
					</div>

					{hasFilters && (
						<div className="mb-4 flex flex-wrap gap-[7px]">
							{chips.map((c) => (
								<button
									key={`${c.kind}:${c.label}`}
									type="button"
									onClick={c.onRemove}
									className="inline-flex cursor-pointer items-center gap-[7px] border border-bd-2 bg-bg-3 py-[5px] pr-2 pl-[11px] font-mono text-[12.5px] text-tx-2 hover:border-red"
								>
									<span className="text-faint">{c.kind}</span>
									{c.label}
									<Icon name="x" size={13} />
								</button>
							))}
						</div>
					)}

					{results.length > 0 ? (
						<>
							<div className="flex flex-col gap-3">
								{shown.map((r) => (
									<article
										key={r.id}
										className="flex items-start gap-4 border border-bd bg-card transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-bd-2"
										style={{ padding: cardPad }}
									>
										<div className="min-w-0 flex-1">
											<div className="mb-2 flex flex-wrap items-center gap-2.5">
												<TypeBadge type={r.type} />
												<span className="inline-flex items-center gap-1.5 text-[12px] text-mut">
													<RelevanceDot relevance={r.relevance} />
													{REL_META[r.relevance].label}
												</span>
												<span className="font-mono text-[11.5px] text-faint">
													{formatDate(r.date)}
												</span>
											</div>
											<Link href={`/resource/${r.id}`} className="no-underline">
												<h3 className="m-0 font-bold text-[17.5px] leading-[1.3] tracking-[-0.01em] text-tx">
													{r.title}
												</h3>
											</Link>
											<div className="mt-[5px] text-[13px] text-mut">
												{authorStr(r.authors)} · {r.source}
											</div>
											{showSummary && (
												<p className="mt-2.5 line-clamp-2 text-[14px] leading-[1.55] text-tx-2">
													{r.summary}
												</p>
											)}
											<div className="mt-3 flex flex-wrap gap-1.5">
												{r.tags.map((tag) => (
													<Link
														key={tag}
														href={`/topic/${encodeURIComponent(tag)}`}
														className="bg-[var(--tint-neutral)] px-2.5 py-[3px] font-mono text-[11px] text-mut no-underline hover:text-cyan"
													>
														{tag}
													</Link>
												))}
											</div>
										</div>
										<div className="flex flex-none flex-col items-end gap-2.5 self-stretch">
											<a
												href={r.url}
												target="_blank"
												rel="noopener"
												aria-label="Open original source"
												title="Open original source"
												className="grid h-[34px] w-[34px] place-items-center border border-bd text-tx-2 hover:border-cyan hover:text-cyan"
											>
												<Icon name="external-link" size={15} />
											</a>
											<Link
												href={`/resource/${r.id}`}
												aria-label="Open resource"
												className="mt-auto text-faint"
											>
												<Icon name="chevron-right" size={16} />
											</Link>
										</div>
									</article>
								))}
							</div>

							{results.length > visible && (
								<div className="mt-[26px] flex justify-center">
									<button
										type="button"
										onClick={() => setVisible((v) => v + PAGE_SIZE)}
										className="cursor-pointer border border-bd-2 bg-transparent px-[22px] py-[11px] font-medium text-[14px] text-tx hover:bg-bg-3"
									>
										Show {moreCount} more
									</button>
								</div>
							)}
						</>
					) : (
						<div className="border border-dashed border-bd-2 bg-card px-6 py-[72px] text-center">
							<div className="mx-auto grid h-[52px] w-[52px] place-items-center border border-bd text-faint">
								<Icon name="search-x" size={24} />
							</div>
							<h3 className="mt-[18px] mb-1.5 font-bold text-[18px] text-tx">
								No resources match your filters
							</h3>
							<p className="mx-auto max-w-[44ch] text-[14px] text-mut">
								Try removing a filter or broadening your search. Our search
								tolerates small typos, but not everything is indexed yet.
							</p>
							<button
								type="button"
								onClick={() => {
									clearFilters();
									setQuery("");
								}}
								className="mt-5 cursor-pointer border-0 bg-orange-2 px-5 py-2.5 font-bold text-[#141517]"
							>
								Reset everything
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
