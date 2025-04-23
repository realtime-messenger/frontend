import {BaseEvent} from "./baseEvent.ts";
import {ReactionResponse} from "../schemas/reactions.ts";


export interface NewReactionEvent extends BaseEvent{
	reaction: ReactionResponse
}


export interface DeleteReactionEvent extends BaseEvent{
	reaction: ReactionResponse
}