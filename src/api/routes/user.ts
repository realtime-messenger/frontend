import {MyIdResponse, UserResponse} from "../../types/schemas/user.ts";
import {getAccessToken} from "../../utils/localStorageManager.ts";
import axios from "axios";
import {API_HOST} from "../../config.ts";

export const getUsers = async (
	pattern: string
): Promise<UserResponse[]> => {

	const accessToken = getAccessToken()

	const config = {
		params: {
			query: pattern
		},
		headers: {
			Authorization: `Bearer ${accessToken}`,
		}
	}

	const response = await axios.get(API_HOST + "/api/v1/user", config)
	return response.data
}

export const getMyId = async (): Promise<MyIdResponse> => {

	const accessToken = getAccessToken()

	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		}
	}

	const response = await axios.get(API_HOST + "/api/v1/user/myId", config)
	return response.data
}

