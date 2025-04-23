import {MessageExtendedResponse} from "../schemas/message.ts";
import {BaseEvent} from "./baseEvent.ts";


export interface NewMessageEvent extends BaseEvent{
	message: MessageExtendedResponse
}