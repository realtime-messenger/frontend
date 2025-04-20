import {jwtDecode, JwtPayload} from "jwt-decode";
import {getAccessToken, getRefreshToken, setAccessToken} from "./localStorageManager";
import {refreshRequest} from "../api/routes/auth.ts";

export const timeToExpireRefresh = () => {
	if (!getAccessToken()) {
		return -1
	}
	const refreshToken: string = getRefreshToken()!
	const decoded: JwtPayload = jwtDecode(refreshToken)
	const currentTimeStamp = Math.floor((new Date()).getTime() / 1000)

	return decoded.exp! - currentTimeStamp
}


export const timeToExpireAccess = () => {
	if (getAccessToken() === null || getAccessToken() === "") {
		return -1
	}
	const accessToken: string = getAccessToken()!
	const decoded: JwtPayload = jwtDecode(accessToken)
	const currentTimeStamp = Math.floor((new Date()).getTime() / 1000)

	return decoded.exp! - currentTimeStamp
}

export const checkIfLoggedIn = () => {
	if (!getAccessToken()) {
		return false
	}

	return timeToExpireRefresh() > 0
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export const refreshAccessToken = async () => {
	try {
		const result = await refreshRequest()
		setAccessToken(result.accessToken)
	} catch (error) {
		setAccessToken("")
	}
}

export const joinStyles = (...args: string[]): string => {
	return args.join(' ');
}