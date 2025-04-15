import { WSReqRes_QueryData, WSReqRes_QueryResult } from "./ws-req-res.types";


interface IRemoteSocket {
    emit: (...args: any[]) => any
}
interface IConnectedSocket {
    on: (event: string, cb: (...args: any[]) => any) => any
    emit: (...args: any[]) => any
}

const DEFAULT_TIMEOUT = 15_000;
const _waitingResults = new Map<string, (result: WSReqRes_QueryResult) => void>();

export class WebSocketRequestResponseServer<TRemoteSocket extends IRemoteSocket> {

    constructor (readonly options: {
        requestEvent: string,
        responseEvent: string,
        listenFromOtherServers: (event: string, cb: (...args: any[]) => any) => any,
        fetchRoomSockets: (room: string) => Promise<TRemoteSocket[]>,
        broadcastToOtherServers: (...args: any[]) => any,

        /** @default 15000 */
        timeout?: number,
        packetIdGenerator?: (socket: TRemoteSocket, event: string) => string
    }) {
        options.listenFromOtherServers(options.responseEvent, (result: any) => {
            this.handleQueryResult(result, true);
        })
    }

    addHandlerOnSocket(socket: IConnectedSocket) {
        socket.on(this.options.responseEvent, (result) => {
            this.handleQueryResult(result, false);
        })
    }

    packetIdGenerator(socket: TRemoteSocket, event: string) {
        if (this.options.packetIdGenerator) {
            return this.options.packetIdGenerator(socket, event);
        }
        return this.options.requestEvent + '-' + event + '-'
            + Date.now() + '-' + Math.random().toString().substring(2);
    }

    querySocket(socket: TRemoteSocket, event: string, data: any) {
        const packetId = this.packetIdGenerator(socket, event);

        return new Promise((resolve, reject) => {
            let _timeout = undefined as any;
            const resetTimeout = () => {
                if (_timeout) clearTimeout(_timeout);
                _timeout = setTimeout(() => {
                    _waitingResults.delete(packetId);
                    reject(new Error("Timeout"));
                }, this.options.timeout || DEFAULT_TIMEOUT);
            }
            
            _waitingResults.set(packetId, (result) => {
                if (result.alive) {
                    resetTimeout();
                    return;
                }
                clearTimeout(_timeout);
                _waitingResults.delete(packetId);
                if (result.isError || result.status >= 400) {
                    return reject(result.data);
                }
                resolve(result.data);
            });

            resetTimeout();
            socket.emit(this.options.requestEvent, {
                packetId, event, body: data
            } satisfies WSReqRes_QueryData);
        })
    }

    async queryRoom(room: string, event: string, data: any) {
        const socket = (await this.options.fetchRoomSockets(room))?.[0];
        return this.querySocket(socket, event, data);
    }

    handleQueryResult(result: WSReqRes_QueryResult, ignoreBroadcast: boolean) {
        if (_waitingResults.has(result.packetId)) {
            _waitingResults.get(result.packetId)?.(result);
            return;
        }
        if (!ignoreBroadcast) {
            this.options.broadcastToOtherServers(
                this.options.responseEvent, result);
        }
    }
}