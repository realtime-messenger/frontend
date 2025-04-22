import {getAccessToken} from "../../utils/localStorageManager.ts";
import axios from "axios";
import {API_HOST} from "../../config.ts";
import {MessageExtendedResponse} from "../../types/schemas/message.ts";

export const getLastMessages = async (
): Promise<MessageExtendedResponse[]> => {

	const accessToken = getAccessToken()

	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		}
	}

	const response = await axios.get(API_HOST + "/api/v1/message/lasts", config)
	return response.data
}


export const getMessages = async (
	chatId: number,
	skip: number,
	limit: number
): Promise<MessageExtendedResponse[]> => {

	const accessToken = getAccessToken()

	const config = {
		params: {
			chatId: chatId,
			skip: skip,
			limit: limit
		},
		headers: {
			Authorization: `Bearer ${accessToken}`,
		}
	}

	const response = await axios.get(API_HOST + "/api/v1/message", config)
	return response.data
}