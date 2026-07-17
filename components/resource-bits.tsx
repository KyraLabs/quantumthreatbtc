import { Icon } from "@/components/icon";
import {
	REL_META,
	type Relevance,
	type ResourceType,
	TYPE_META,
} from "@/lib/resources";

export function TypeBadge({
	type,
	iconSize = 13,
}: {
	type: ResourceType;
	iconSize?: number;
}) {
	const meta = TYPE_META[type];
	return (
		<span
			className="inline-flex items-center gap-1.5 border border-bd px-2 py-1 font-mono font-medium text-[11px] uppercase tracking-[0.05em]"
			style={{ color: meta.color, background: meta.tint }}
		>
			<Icon name={meta.icon} size={iconSize} />
			{meta.label}
		</span>
	);
}

export function RelevanceDot({ relevance }: { relevance: Relevance }) {
	return (
		<span
			className="h-[7px] w-[7px] flex-none rounded-full"
			style={{ background: REL_META[relevance].color }}
		/>
	);
}

export function RelevanceTag({ relevance }: { relevance: Relevance }) {
	return (
		<span className="inline-flex items-center gap-1.5 text-[12px] text-mut">
			<RelevanceDot relevance={relevance} />
			{REL_META[relevance].label}
		</span>
	);
}
