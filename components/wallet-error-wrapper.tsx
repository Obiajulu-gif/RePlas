"use client";

import dynamic from "next/dynamic";

const WalletErrorHandler = dynamic(
	() => import("./wallet-error-handler").then((mod) => mod.WalletErrorHandler),
	{ ssr: false }
);

export function WalletErrorWrapper() {
	return <WalletErrorHandler />;
}
