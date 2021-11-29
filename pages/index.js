import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function Home() {
	return (
		<div className="">
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* main */}
			<main>
				{/* sidebar */}
				<Sidebar />
			</main>
		</div>
	);
}
