import { WSReqRes_QueryResult } from "./ws-req-res.types";
interface IRemoteSocket {
    emit: (...args: any[]) => any;
}
interface IConnectedSocket {
    on: (event: string, cb: (...args: any[]) => any) => any;
    emit: (...args: any[]) => any;
}
export interface WebSocketRequestResponseServerOptions<TRemoteSocket extends IRemoteSocket> {
    requestEvent: string;
    responseEvent: string;
    listenFromOtherServers: (event: string, cb: (...args: any[]) => any) => any;
    fetchRoomSockets: (room: string) => Promise<TRemoteSocket[]>;
    broadcastToOtherServers: (...args: any[]) => any;
    /** @default 15000 */
    timeout?: number;
    packetIdGenerator?: (socket: TRemoteSocket, event: string) => string;
}
export declare class WebSocketRequestResponseServer<TRemoteSocket extends IRemoteSocket> {
    readonly options: WebSocketRequestResponseServerOptions<TRemoteSocket>;
    constructor(options: WebSocketRequestResponseServerOptions<TRemoteSocket>);
    addHandlerOnSocket(socket: IConnectedSocket): void;
    packetIdGenerator(socket: TRemoteSocket, event: string): string;
    querySocket(socket: TRemoteSocket, event: string, data: any): Promise<any>;
    queryRoom(room: string, event: string, data: any): Promise<any>;
    handleQueryResult(result: WSReqRes_QueryResult, ignoreBroadcast: boolean): void;
}
export {};
