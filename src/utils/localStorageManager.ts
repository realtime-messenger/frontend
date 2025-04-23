export const getRefreshToken: () => string | null = () => {
	return localStorage.getItem("refreshToken")
}
export const getAccessToken: () => string | null = () => {
	return localStorage.getItem("accessToken")
}
export const getUserId = () => {
	return Number(localStorage.getItem("userId"))
}

export const setRefreshToken = (token: string) => {
	localStorage.setItem("refreshToken", token)
}
export const setAccessToken = (token: string) => {
	localStorage.setItem("accessToken", token)
}
export const setUserId = (userId: string) => {
	localStorage.setItem("userId", userId)
}