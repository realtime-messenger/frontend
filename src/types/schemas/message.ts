import {ReactionResponse} from "./reactions.ts";
import {UserResponse} from "./user.ts";

export interface MessageResponse {
	id: number;
	chatId: number;
	user: UserResponse
	text: string;
	dateCreated: string;
}

export interface MessageExtendedResponse extends MessageResponse {
	isRead: boolean;
	reactions: ReactionResponse[];
}