import {ReactionResponse} from "./reactions.ts";

export interface MessageResponse {
	id: number;
	chatId: number;
	text: string;
	dateCreated: string;
}

export interface MessageExtendedResponse extends MessageResponse {
	isRead: boolean;
	reactions: ReactionResponse[];
}