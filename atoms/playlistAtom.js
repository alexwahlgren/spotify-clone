import { atom } from "recoil";

export const playlistState = atom({
	key: "playlistAtomState",
	default: null,
});

export const playlistIdState = atom({
	key: "playlistIdState",
	default: "2dCvJIDw3thBcsD5pfkNjo", // FIX
});
