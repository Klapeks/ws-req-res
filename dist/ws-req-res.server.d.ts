import { WSReqRes_QueryResult } from "./ws-req-res.types";
interface IRemoteSocket {
    emit: (...args: any[]) => any;
}
interface IConnectedSocket {
    on: (event: string, cb: (...args: any[]) => any) => any;
    emit: (...args: any[]) => any;
}
export declare class WebSocketRequestResponseServer<TRemoteSocket extends IRemoteSocket> {
    readonly options: {
        requestEvent: string;
        responseEvent: string;
        listenFromOtherServers: (event: string, cb: (...args: any[]) => any) => any;
        fetchRoomSockets: (room: string) => Promise<TRemoteSocket[]>;
        broadcastToOtherServers: (...args: any[]) => any;
        /** @default 15000 */
        timeout?: number;
        packetIdGenerator?: (socket: TRemoteSocket, event: string) => string;
    };
    constructor(options: {
        requestEvent: string;
        responseEvent: string;
        listenFromOtherServers: (event: string, cb: (...args: any[]) => any) => any;
        fetchRoomSockets: (room: string) => Promise<TRemoteSocket[]>;
        broadcastToOtherServers: (...args: any[]) => any;
        /** @default 15000 */
        timeout?: number;
        packetIdGenerator?: (socket: TRemoteSocket, event: string) => string;
    });
    addHandlerOnSocket(socket: IConnectedSocket): void;
    packetIdGenerator(socket: TRemoteSocket, event: string): string;
    querySocket(socket: TRemoteSocket, event: string, data: any): Promise<unknown>;
    queryRoom(room: string, event: string, data: any): Promise<unknown>;
    handleQueryResult(result: WSReqRes_QueryResult, ignoreBroadcast: boolean): void;
}
export {};
