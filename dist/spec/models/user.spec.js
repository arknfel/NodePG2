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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("../../src/models/user");
var database_1 = __importDefault(require("../../src/database"));
var store = new user_1.UserStore();
describe("User Model", function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
            var conn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query('TRUNCATE users RESTART IDENTITY CASCADE;')];
                    case 2:
                        _a.sent();
                        conn.release();
                        return [2 /*return*/];
                }
            });
        }); });
        user = {
            firstname: "testUser",
            lastname: "lastname",
            password: "UshallnotPASS"
        };
        it('index() returns []', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.index()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('method create() return a User', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.create(user)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: 1,
                            firstname: 'testUser',
                            lastname: 'lastname'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('method get(user_id) return a User by id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.get('1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: 1,
                            firstname: 'testUser',
                            lastname: 'lastname'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('method userExists() return a User if exists', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conn, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, store.userExists(user.firstname, conn)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        expect(result.length).toEqual(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('method authenticate() return User or null', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.authenticate(user.firstname, user.password)];
                    case 1:
                        result = _a.sent();
                        expect(result === null || result === void 0 ? void 0 : result.id).toEqual(1);
                        return [4 /*yield*/, store.authenticate(user.firstname, 'AwrongPass')];
                    case 2:
                        // invalid password
                        result = _a.sent();
                        expect(result).toEqual(null);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
