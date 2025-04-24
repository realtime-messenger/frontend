import {MessageExtendedResponse} from "../types/schemas/message.ts";

export const useMessageSort = (messages: MessageExtendedResponse[]) => {
	messages.sort(
		(a, b) => {
			return a.id - b.id
		}
	)

	return messages
}
