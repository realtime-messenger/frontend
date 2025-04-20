export const getRefreshToken: () => string | null = () => {
	return localStorage.getItem("refreshToken")
}
export const getAccessToken: () => string | null = () => {
	return localStorage.getItem("accessToken")
}

export const setRefreshToken = (token: string) => {
	localStorage.setItem("refreshToken", token)
}
export const setAccessToken = (token: string) => {
	localStorage.setItem("accessToken", token)
}