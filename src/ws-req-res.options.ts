import { WebSocketRequestResponseServerOptions } from "./ws-req-res.server";

type PartialServerOptions = Pick<WebSocketRequestResponseServerOptions<any>, 
    "broadcastToOtherServers" | "fetchRoomSockets" | "listenFromOtherServers">;

export function optionsSocketIO(serverSocketIO: {
    serverSideEmit: (event: string, ...args: any[]) => any,
    in: (room: string) => any,
    on: (event: string, cb: (...args: any[]) => any) => any
}): PartialServerOptions {
    return {
        broadcastToOtherServers: (event, ...args) => serverSocketIO.serverSideEmit(event, ...args),
        fetchRoomSockets: (room) => serverSocketIO.in(room).fetchSockets(),
        listenFromOtherServers: (event, cb) => serverSocketIO.on(event, cb)
    }
}