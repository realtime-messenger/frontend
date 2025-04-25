import {BaseEvent} from "./baseEvent.ts";

export interface UserTypingEvent extends BaseEvent{
	userId: number
	chatId: number
}
