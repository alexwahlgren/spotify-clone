import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
	return (
		<div
			className="flex flex-col items-center min-h-screen 
            w-full justify-center bg-gradient-to-b from-black to-gray-900"
		>
			<img
				className="w-52 mb-5"
				src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
				alt=""
			/>
			{Object.values(providers).map((provider) => (
				<div key={provider.name}>
					<button
						className="bg-[#18D860] text-white p-5 rounded-full
                        hover:bg-[#106631] transition-all duration-200 ease-in-out"
						onClick={() =>
							signIn(provider.id, { callbackUrl: "/" })
						}
					>
						Login with {provider.name}
					</button>
				</div>
			))}
		</div>
	);
}

export default Login;

export async function getServerSideProps() {
	const providers = await getProviders();

	return {
		props: {
			providers,
		},
	};
}
