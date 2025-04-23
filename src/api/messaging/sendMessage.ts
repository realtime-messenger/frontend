import {Client} from "@stomp/stompjs";

export const sendMessageChat = (
	client: Client,
	chatId: number,
	text: string
) => {

	client.publish({
		destination: "/app/send-message-chat",
		body: JSON.stringify({'chatId': chatId, 'text': text})
	})
}

export const sendMessagePrivate = (
	client: Client,
	userId: number,
	text: string
) => {

	client.publish({
		destination: "/app/send-message-private",
		body: JSON.stringify({'userId': userId, 'text': text})
	})
}