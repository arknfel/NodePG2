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
var supertest_1 = __importDefault(require("supertest"));
var database_1 = __importDefault(require("../../src/database"));
var server_1 = __importDefault(require("../../src/server"));
var request = (0, supertest_1.default)(server_1.default);
describe('Dashboards Handler', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var conn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.default.connect()];
                case 1:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query("TRUNCATE users RESTART IDENTITY CASCADE;")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, conn.query("TRUNCATE orders RESTART IDENTITY CASCADE;")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, conn.query("TRUNCATE products RESTART IDENTITY CASCADE;")];
                case 4:
                    _a.sent();
                    // creating a mock user to satisfy foriegn-key constrains 
                    return [4 /*yield*/, conn.query("INSERT INTO users (username, firstname, lastname, password, isAdmin) \
      VALUES ('testUser', '__', '__', 'UshallnotPASS', '0');")];
                case 5:
                    // creating a mock user to satisfy foriegn-key constrains 
                    _a.sent();
                    // creating a mock order
                    return [4 /*yield*/, conn.query("INSERT INTO orders (user_id, status) \
      VALUES (1, 'complete')")];
                case 6:
                    // creating a mock order
                    _a.sent();
                    // creating 6 products
                    return [4 /*yield*/, conn.query("INSERT INTO products (name, price) \
      VALUES ('testProduct01', 42.42); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct02', 10); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct03', 5.50); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct04', 100); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct05', 2022.25); \
      INSERT INTO products (name, price) \
      VALUES ('testProduct06', 99);")];
                case 7:
                    // creating 6 products
                    _a.sent();
                    // creating 6 add-product actions
                    return [4 /*yield*/, conn.query("INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (2, 1, 1); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (3, 1, 2); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (4, 1, 3); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (5, 1, 4); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (6, 1, 5); \
      INSERT INTO order_products \
      (quantity, order_id, product_id) \
      VALUES (1, 1, 6);")];
                case 8:
                    // creating 6 add-product actions
                    _a.sent();
                    conn.release();
                    return [2 /*return*/];
            }
        });
    }); }); // BEFORE ALL ends
    it('topFiveSellers return top 5 sellers in terms of quantity', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/reports/top-five-sellers')];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual([
                        { name: 'testProduct05', price: '$2,022.25' },
                        { name: 'testProduct04', price: '$100.00' },
                        { name: 'testProduct03', price: '$5.50' },
                        { name: 'testProduct02', price: '$10.00' },
                        { name: 'testProduct01', price: '$42.42' }
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
