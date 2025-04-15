import { WSReqRes_QueryData, WSReqRes_QueryResult } from "./ws-req-res.types";

interface ISocket {
    on: (event: string, cb: (...args: any[]) => any) => any
    emit: (...args: any[]) => any
}

export class WebSocketRequestResponseClient {
    
    readonly _eventsWithResponse = new Map<string, (data?: any) => any>();

    constructor (readonly options: {
        requestEvent: string,
        responseEvent: string,
        socketClient: ISocket,
        errorParser?: (err: any) => any,
        /** @default 5000 */
        sendAlivePeriod?: number
    }) {
        options.socketClient.on(this.options.requestEvent, (data: any) => {
            this.handleQuery(data);
        });
    }

    onEvent(event: string, cb: (data?: any) => any) {
        this._eventsWithResponse.set(event, cb);
    }

    async handleQuery(data: WSReqRes_QueryData) {
        const sendResult = (result: Omit<WSReqRes_QueryResult, "packetId"> | { alive: true }) => {
            (result as any).packetId = data.packetId;
            this.options.socketClient.emit(this.options.responseEvent, result);
        }
        const aliveInterval = setInterval(() => {
            sendResult({ alive: true });
        }, this.options.sendAlivePeriod || 5000);
        try {
            const cb = this._eventsWithResponse.get(data.event);
            if (!cb) throw "Event not found: " + data.event;
            let result = cb(data.body);
            if (result.then) result = await result;
            clearInterval(aliveInterval);
            sendResult({ status: 200, isError: false, data: result });
        } catch(err: any) {
            clearInterval(aliveInterval);
            if (this.options.errorParser) {
                err = this.options.errorParser(err);
            }
            if (err.status && err.error) {
                sendResult({ isError: true, status: err.status, data: err.error });
            } else {
                sendResult({ isError: true, status: 500, data: err });
            }
        }
    }
}