import {BaseEvent} from "./baseEvent.ts";
import {ChatResponse} from "../schemas/chat.ts";


export interface NewChatEvent extends BaseEvent{
	chat: ChatResponse
}