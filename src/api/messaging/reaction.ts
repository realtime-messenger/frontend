import {Client} from "@stomp/stompjs";

export const setReaction = (
	client: Client,
	messageId: number,
	reaction: string
) => {

	client.publish({
		destination: "/app/set-reaction",
		body: JSON.stringify({'messageId': messageId, 'reaction': reaction})
	})
}

export const deleteReaction = (
	client: Client,
	reactionId: number
) => {

	client.publish({
		destination: "/app/delete-reaction",
		body: JSON.stringify({'reactionId': reactionId})
	})
}