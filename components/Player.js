import {
	HeartIcon,
	VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
	RewindIcon,
	SwitchHorizontalIcon,
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	ReplyIcon,
	VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();

	const [currentTrackId, setCurrentTrackId] =
		useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);
	const songInfo = useSongInfo();

	// Init spotify player
	if (typeof window !== "undefined") {
		window.onSpotifyWebPlaybackSDKReady = () => {
			initSpotifyPlayer(spotifyApi.getAccessToken(), spotifyApi);
		};
	}

	const fetchCurrentSong = () => {
		if (!songInfo) {
			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				// console.log("data: ", data);
				// console.log("Now playing: ", data.body?.item.id);
				setCurrentTrackId(data.body?.item?.id);

				spotifyApi.getMyCurrentPlaybackState().then((data) => {
					setIsPlaying(data.body?.is_playing);
				});
			});
		}
	};

	const handlePlayPause = () => {
		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			if (data.body.is_playing) {
				spotifyApi.pause();
				setIsPlaying(false);
			} else {
				spotifyApi.play();
				setIsPlaying(true);
			}
		});
	};

	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackIdState, spotifyApi, session]);

	useEffect(() => {
		if (songInfo && volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			spotifyApi.setVolume(volume).catch((err) => {});
		}, 500),
		[]
	);
	return (
		<div
			className="h-24 bg-gradient-to-b from-black 
            to-[#0a0e17] text-white grid grid-cols-3 text-xs
            md:text-base px-2 md:px-8 border-t-[0.1px] border-gray-900"
		>
			{/* left */}
			<div className="flex items-center space-x-4">
				<img
					className="hidden md:inline h-10 w-10"
					src={songInfo?.album.images?.[0].url}
					alt=""
				/>
				<div>
					<h3 className="w-36 lg:w-64 truncate">{songInfo?.name}</h3>
					<p className="w-36 lg:w-64 truncate text-gray-300">
						{songInfo?.artists?.[0]?.name}
					</p>
				</div>
			</div>

			{/* center */}
			<div className="flex items-center justify-evenly">
				<SwitchHorizontalIcon className="button" />
				<RewindIcon className="button" />
				{isPlaying ? (
					<PauseIcon
						onClick={handlePlayPause}
						className="button w-10 h-10"
					/>
				) : (
					<PlayIcon
						onClick={handlePlayPause}
						className="button w-10 h-10"
					/>
				)}
				<FastForwardIcon className="button" />
				<ReplyIcon className="button" />
			</div>
			{/* right */}
			<div
				className="flex items-center space-x-3 md:space-x-4 
                justify-end pr-5"
			>
				<VolumeDownIcon
					onClick={() => volume > 0 && setVolume(volume - 10)}
					className="button"
				/>
				<input
					className="w-14 md:w-28 h-0.5 bg-grey rounded outline-none slider-thumb"
					type="range"
					value={volume}
					onChange={(e) => setVolume(Number(e.target.value))}
					min={0}
					max={100}
				/>
				<VolumeUpIcon
					onClick={() => volume < 100 && setVolume(volume + 10)}
					className="button"
				/>
			</div>
		</div>
	);
}

const initSpotifyPlayer = (token, spotifyApi) => {
	const _player = new window.Spotify.Player({
		name: "spotify-clone",
		getOAuthToken: (cb) => cb(token),
	});
	// Error handling
	_player.addListener("initialization_error", ({ message }) => {
		console.error(message);
	});
	_player.addListener("authentication_error", ({ message }) => {
		console.error(message);
	});
	_player.addListener("account_error", ({ message }) => {
		console.error(message);
	});
	_player.addListener("playback_error", ({ message }) => {
		console.error(message);
	});

	// Playback status updates
	// _player.addListener("player_state_changed", (state) => {
	// 	console.log(state);
	// });

	// Ready
	_player.addListener("ready", ({ device_id }) => {
		spotifyApi.transferMyPlayback([device_id]);
		// console.log(_player);
	});

	// Not Ready
	_player.addListener("not_ready", ({ device_id }) => {
		console.log("Device ID has gone offline", device_id);
	});

	// Connect to the player!
	_player.connect();
};

export default Player;
