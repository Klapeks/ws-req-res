import { WSReqRes_QueryResult } from "./ws-req-res.types";
interface ISocket {
    on: (event: string, cb: (...args: any[]) => any) => any;
    emit: (...args: any[]) => any;
}
export declare class WebSocketRequestResponseServer<TSocket extends ISocket> {
    readonly options: {
        requestEvent: string;
        responseEvent: string;
        listenFromOtherServers: (event: string, cb: (...args: any[]) => any) => any;
        fetchRoomSockets: (room: string) => Promise<TSocket[]>;
        broadcastToOtherServers: (...args: any[]) => any;
        /** @default 15000 */
        timeout?: number;
        packetIdGenerator?: (socket: ISocket, event: string) => string;
    };
    constructor(options: {
        requestEvent: string;
        responseEvent: string;
        listenFromOtherServers: (event: string, cb: (...args: any[]) => any) => any;
        fetchRoomSockets: (room: string) => Promise<TSocket[]>;
        broadcastToOtherServers: (...args: any[]) => any;
        /** @default 15000 */
        timeout?: number;
        packetIdGenerator?: (socket: ISocket, event: string) => string;
    });
    addHandlerOnSocket(socket: ISocket): void;
    packetIdGenerator(socket: ISocket, event: string): string;
    querySocket(socket: ISocket, event: string, data: any): Promise<unknown>;
    queryRoom(room: string, event: string, data: any): Promise<unknown>;
    handleQueryResult(result: WSReqRes_QueryResult, ignoreBroadcast: boolean): void;
}
export {};
