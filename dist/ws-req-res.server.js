"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketRequestResponseServer = void 0;
var DEFAULT_TIMEOUT = 15000;
var _waitingResults = new Map();
var WebSocketRequestResponseServer = /** @class */ (function () {
    function WebSocketRequestResponseServer(options) {
        var _this = this;
        this.options = options;
        options.listenFromOtherServers(options.responseEvent, function (result) {
            _this.handleQueryResult(result, true);
        });
    }
    WebSocketRequestResponseServer.prototype.addHandlerOnSocket = function (socket) {
        var _this = this;
        socket.on(this.options.responseEvent, function (result) {
            _this.handleQueryResult(result, false);
        });
    };
    WebSocketRequestResponseServer.prototype.packetIdGenerator = function (socket, event) {
        if (this.options.packetIdGenerator) {
            return this.options.packetIdGenerator(socket, event);
        }
        return this.options.requestEvent + '-' + event + '-'
            + Date.now() + '-' + Math.random().toString().substring(2);
    };
    WebSocketRequestResponseServer.prototype.querySocket = function (socket, event, data) {
        var _this = this;
        var packetId = this.packetIdGenerator(socket, event);
        return new Promise(function (resolve, reject) {
            var _timeout = undefined;
            var resetTimeout = function () {
                if (_timeout)
                    clearTimeout(_timeout);
                _timeout = setTimeout(function () {
                    _waitingResults.delete(packetId);
                    reject(new Error("Timeout"));
                }, _this.options.timeout || DEFAULT_TIMEOUT);
            };
            _waitingResults.set(packetId, function (result) {
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
            socket.emit(_this.options.requestEvent, {
                packetId: packetId,
                event: event,
                body: data
            });
        });
    };
    WebSocketRequestResponseServer.prototype.queryRoom = function (room, event, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var socket;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.options.fetchRoomSockets(room)];
                    case 1:
                        socket = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a[0];
                        return [2 /*return*/, this.querySocket(socket, event, data)];
                }
            });
        });
    };
    WebSocketRequestResponseServer.prototype.handleQueryResult = function (result, ignoreBroadcast) {
        var _a;
        if (_waitingResults.has(result.packetId)) {
            (_a = _waitingResults.get(result.packetId)) === null || _a === void 0 ? void 0 : _a(result);
            return;
        }
        if (!ignoreBroadcast) {
            this.options.broadcastToOtherServers(this.options.responseEvent, result);
        }
    };
    return WebSocketRequestResponseServer;
}());
exports.WebSocketRequestResponseServer = WebSocketRequestResponseServer;
