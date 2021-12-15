import { getSession } from "next-auth/react";
import Center from "../components/Center";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";
import Script from "next/script";

export default function Home() {
	return (
		<>
			<Script src="https://sdk.scdn.co/spotify-player.js" />
			<div className="bg-black h-screen overflow-hidden">
				<main className="flex">
					<Sidebar />
					<Center />
				</main>
				<div className="sticky bottom-0">
					<Player />
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);

	return {
		props: {
			session,
		},
	};
}
