import {getAccessToken} from "../../utils/localStorageManager.ts";
import axios from "axios";
import {API_HOST} from "../../config.ts";
import {ChatResponse} from "../../types/schemas/chat.ts";

export const getChats = async (): Promise<ChatResponse[]> => {

	const accessToken = getAccessToken()

	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		}
	}

	const response = await axios.get(API_HOST + "/api/v1/chat", config)

	return response.data
}

