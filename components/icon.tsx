import type { CSSProperties } from "react";

const LUCIDE_BASE = "https://unpkg.com/lucide-static@0.469.0/icons";

interface IconProps {
	/** Lucide icon name, e.g. "search", "arrow-right". */
	name: string;
	size?: number;
	className?: string;
	style?: CSSProperties;
}

/**
 * Renders a Lucide glyph as a CSS mask so it inherits `currentColor`.
 * Loaded from the lucide-static CDN, matching the source design system.
 */
export function Icon({ name, size = 14, className, style }: IconProps) {
	const url = `${LUCIDE_BASE}/${name}.svg`;
	return (
		<span
			aria-hidden="true"
			className={className}
			style={{
				display: "inline-block",
				width: size,
				height: size,
				flex: "0 0 auto",
				background: "currentColor",
				WebkitMaskImage: `url(${url})`,
				maskImage: `url(${url})`,
				WebkitMaskRepeat: "no-repeat",
				maskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
				maskPosition: "center",
				WebkitMaskSize: "contain",
				maskSize: "contain",
				...style,
			}}
		/>
	);
}
