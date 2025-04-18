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
exports.WebSocketRequestResponseClient = void 0;
var WebSocketRequestResponseClient = /** @class */ (function () {
    function WebSocketRequestResponseClient(options) {
        var _this = this;
        this.options = options;
        this._eventsWithResponse = new Map();
        options.socketClient.on(this.options.requestEvent, function (data) {
            _this.handleQuery(data);
        });
    }
    WebSocketRequestResponseClient.prototype.onEvent = function (event, cb) {
        this._eventsWithResponse.set(event, cb);
    };
    WebSocketRequestResponseClient.prototype.handleQuery = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var sendResult, aliveInterval, cb, result, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sendResult = function (result) {
                            result.packetId = data.packetId;
                            _this.options.socketClient.emit(_this.options.responseEvent, result);
                        };
                        aliveInterval = setInterval(function () {
                            sendResult({ alive: true });
                        }, this.options.sendAlivePeriod || 5000);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        cb = this._eventsWithResponse.get(data.event);
                        if (!cb)
                            throw "Event not found: " + data.event;
                        result = cb(data.body);
                        if (!result.then) return [3 /*break*/, 3];
                        return [4 /*yield*/, result];
                    case 2:
                        result = _a.sent();
                        _a.label = 3;
                    case 3:
                        clearInterval(aliveInterval);
                        sendResult({ status: 200, isError: false, data: result });
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        clearInterval(aliveInterval);
                        if (this.options.errorParser) {
                            err_1 = this.options.errorParser(err_1);
                        }
                        if (err_1.status && err_1.error) {
                            sendResult({ isError: true, status: err_1.status, data: err_1.error });
                        }
                        else {
                            sendResult({ isError: true, status: 500, data: err_1 });
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return WebSocketRequestResponseClient;
}());
exports.WebSocketRequestResponseClient = WebSocketRequestResponseClient;
