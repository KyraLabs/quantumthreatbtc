"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Icon } from "@/components/icon";

export function HeroSearch({ totalCount }: { totalCount: number }) {
	const [query, setQuery] = useState("");
	const router = useRouter();

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		const q = query.trim();
		router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
	}

	return (
		<form
			onSubmit={onSubmit}
			className="mt-[34px] flex max-w-[640px] flex-wrap gap-2.5"
		>
			<div className="flex h-[54px] min-w-[260px] flex-1 items-center gap-2.5 border border-bd-2 bg-card px-4 shadow-[var(--shadow-sm)]">
				<Icon name="search" size={16} className="text-mut" />
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search e.g. Shor, P2QRH, address exposure…"
					aria-label="Search resources"
					className="min-w-0 flex-1 border-0 bg-transparent text-[16px] text-tx outline-none"
				/>
			</div>
			<button
				type="submit"
				className="h-[54px] cursor-pointer border-0 bg-orange-2 px-[26px] font-bold text-[15px] text-[#141517] tracking-[0.01em] hover:bg-orange"
			>
				Search {totalCount} resources
			</button>
		</form>
	);
}
