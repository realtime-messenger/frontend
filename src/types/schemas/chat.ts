import {MessageExtendedResponse} from "./message.ts";
import {UserResponse} from "./user.ts";

export interface ChatResponse {
	id: number;
	title: string;
	type: string;
	dateCreated: string;

	interlocutor: UserResponse;
}

export interface ChatExtendedResponse extends ChatResponse {
	lastMessage: MessageExtendedResponse | null;
}