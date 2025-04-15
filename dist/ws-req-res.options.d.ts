export declare const wsReqResOptions: {
    socketIO(serverSocketIO: {
        serverSideEmit: (event: string, ...args: any[]) => any;
        in: (room: string) => any;
        on: (event: string, cb: (...args: any[]) => any) => any;
    }): {
        broadcastToOtherServers: (event: any, ...args: any[]) => any;
        fetchRoomSockets: (room: string) => any;
        listenFromOtherServers: (event: string, cb: (...args: any[]) => any) => any;
    };
};
