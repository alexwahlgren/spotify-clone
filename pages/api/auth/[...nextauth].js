import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
	try {
		spotifyApi.setAccessToken(token.accessToken);
		spotifyApi.setRefreshToken(token.refreshToken);

		const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
		console.log("REFRESHED TOKEN IS: ", refreshedToken);
		return {
			...token,
			accessToken: refreshedToken.accessToken,
			accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify api
			refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
			// Replace if new one came back else fall back to old refresh token
		};
	} catch (error) {
		console.log(error);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}

export default NextAuth({
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			authorization: LOGIN_URL,
		}),
	],
	secret: process.env.JWT_SECRET,
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, account, user }) {
			// Initial sign in
			if (account && user) {
				return {
					...token,
					accessToken: account.access_token,
					refreshToken: account.refresh_token,
					username: account.providerAccountId,
					accessTokenExpires: account.expires_at * 1000, // handling expires in millseconds (not seconds)
				};
			}

			// Return previous token if access token has not expired yet
			if (Date.now() < token.accessTokenExpires && token.accessToken) {
				// console.log("EXISTING ACCESS TOKEN IS VALID");
				return token;
			}

			// Access token has expired, so we need to refresh it...
			console.log(
				"EXISTING ACCESS TOKEN HAS EXPIRED OR IS UNVALID, REFRESHING..."
			);
			return await refreshAccessToken(token);
		},
		async session({ session, token }) {
			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.username = token.username;
			return session;
		},
	},
});
