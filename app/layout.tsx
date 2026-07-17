import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
	weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
	title: "QuantumThreat BTC — the quantum threat to Bitcoin, indexed",
	description:
		"A curated, searchable index of the material on quantum computing and Bitcoin: papers, BIPs, articles, videos, forum and mailing-list threads, and hardware milestones. Tagged, dated, and rated for relevance.",
};

// Set the persisted theme before paint to avoid a flash of the wrong palette.
const THEME_SCRIPT = `try{var t=localStorage.getItem('qtbtc-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			data-theme="dark"
			className={`${jetbrainsMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body className="flex min-h-full flex-col">
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: inline no-flash theme script */}
				<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
				<a
					href="#qt-main"
					className="absolute top-2 left-[-9999px] z-[200] bg-orange-2 px-3.5 py-2 font-bold text-[#141517] focus:left-3"
				>
					Skip to content
				</a>
				<SiteHeader />
				<main id="qt-main" className="w-full flex-1">
					{children}
				</main>
				<SiteFooter />
			</body>
		</html>
	);
}
