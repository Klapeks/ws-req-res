import { WSReqRes_QueryData } from "./ws-req-res.types";
interface ISocket {
    on: (event: string, cb: (...args: any[]) => any) => any;
    emit: (...args: any[]) => any;
}
export declare class WebSocketRequestResponseClient {
    readonly options: {
        requestEvent: string;
        responseEvent: string;
        socketClient: ISocket;
        errorParser?: (err: any) => any;
        /** @default 5000 */
        sendAlivePeriod?: number;
    };
    readonly _eventsWithResponse: Map<string, (data?: any) => any>;
    constructor(options: {
        requestEvent: string;
        responseEvent: string;
        socketClient: ISocket;
        errorParser?: (err: any) => any;
        /** @default 5000 */
        sendAlivePeriod?: number;
    });
    onEvent(event: string, cb: (data?: any) => any): void;
    handleQuery(data: WSReqRes_QueryData): Promise<void>;
}
export {};
