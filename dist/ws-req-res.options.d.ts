import { WebSocketRequestResponseServerOptions } from "./ws-req-res.server";
type PartialServerOptions = Pick<WebSocketRequestResponseServerOptions<any>, "broadcastToOtherServers" | "fetchRoomSockets" | "listenFromOtherServers">;
export declare function optionsSocketIO(serverSocketIO: {
    serverSideEmit: (event: string, ...args: any[]) => any;
    in: (room: string) => any;
    on: (event: string, cb: (...args: any[]) => any) => any;
}): PartialServerOptions;
export {};
