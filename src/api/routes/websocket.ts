import { Stomp } from '@stomp/stompjs';
import {getAccessToken} from "../../utils/localStorageManager.ts";
import {PING_INGOING, PING_OUTGOING, WS_HOST} from "../../config.ts";

export const connectWebsocket = () => {
	const accessToken = getAccessToken()
	const brokerURL =  WS_HOST + "/ws?token=" + accessToken

	const ws = new WebSocket(brokerURL)
	const client = Stomp.over(ws);

	client.heartbeat.outgoing = PING_OUTGOING;
	client.heartbeat.incoming = PING_INGOING;

	client.debug = () => {}

	client.activate()

	return client
}