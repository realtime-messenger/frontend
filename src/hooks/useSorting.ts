import {MessageExtendedResponse} from "../types/schemas/message.ts";

export const useMessageSort = (
	messages: MessageExtendedResponse[] | null | undefined
) => {
	if (messages === null || messages === undefined) {
		return []
	}

	messages.sort(
		(a, b) => {
			return a.id - b.id
		}
	)

	return messages
}
