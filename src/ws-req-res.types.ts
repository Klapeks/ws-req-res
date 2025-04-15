
export interface WSReqRes_QueryData {
    packetId: string,
    event: string,
    body?: any
}
export interface WSReqRes_QueryResult {
    packetId: string,
    isError: boolean,
    status: number,
    data: any,
    alive?: boolean
}