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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var supertest_1 = __importDefault(require("supertest"));
var database_1 = __importDefault(require("../../src/database"));
var server_1 = __importDefault(require("../../src/server"));
var request = (0, supertest_1.default)(server_1.default);
describe('Orders Handler, all endpoints require a valid user-token', function () {
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
                    // creating a user and a product to satisfy foriegn-key constrains 
                    return [4 /*yield*/, conn.query("INSERT INTO users (firstname, lastname, password) \
      VALUES ('testUser', 'lastname', 'UshallnotPASS');")];
                case 3:
                    // creating a user and a product to satisfy foriegn-key constrains 
                    _a.sent();
                    return [4 /*yield*/, conn.query("INSERT INTO products (name, price) \
      VALUES ('testProduct01', 42.42);")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, conn.query("INSERT INTO products (name, price) \
    VALUES ('testProduct02', 10);")];
                case 5:
                    _a.sent();
                    conn.release();
                    return [2 /*return*/];
            }
        });
    }); });
    var user = {
        id: 1,
        firstname: 'testUser',
        lastname: 'lastname',
        password: 'UshallnotPASS'
    };
    var secret = process.env.TOKEN_SECRET;
    var spareToken = jsonwebtoken_1.default.sign({
        user: {
            id: user.id,
            firstname: user.firstname
        }
    }, secret);
    // CREATE
    it('create order, expect 200 and order obj', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // create first order
                return [4 /*yield*/, request.post('/users/1/orders')
                        .set('Authorization', "Bearer ".concat(spareToken))
                    // create second order
                ];
                case 1:
                    // create first order
                    _a.sent();
                    return [4 /*yield*/, request.post('/users/1/orders')
                            .set('Authorization', "Bearer ".concat(spareToken))];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual({
                        id: 2,
                        user_id: '1',
                        status: 'active'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // INDEX
    it('index, expect 200 and list of active orders', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/users/1/orders')
                        .set('Authorization', "Bearer ".concat(spareToken))];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    // order-senstive
                    expect(response.body).toEqual([
                        { id: 1, user_id: '1', status: 'active' },
                        { id: 2, user_id: '1', status: 'active' }
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    // SHOW
    it('checkOrder, expect 200 and order obj', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/users/1/orders/1')
                        .set('Authorization', "Bearer ".concat(spareToken))];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual({
                        id: 1,
                        user_id: '1',
                        status: 'active'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    //
    it('addProduct, expect 200 and order_product obj', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.post('/users/1/orders/1/products')
                        .set('Authorization', "Bearer ".concat(spareToken))
                        .send({
                        quantity: '3',
                        product_id: '1'
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, request.post('/users/1/orders/1/products')
                            .set('Authorization', "Bearer ".concat(spareToken))
                            .send({
                            quantity: '5',
                            product_id: '2'
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual({
                        quantity: 5,
                        order_id: '1',
                        product_id: '2'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('closeOrder, expect 200 and closed order obj', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.put('/users/1/orders/1/close')
                        .set('Authorization', "Bearer ".concat(spareToken))];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual({
                        id: 1,
                        user_id: '1',
                        status: 'complete'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('show complete orders, expect 200 and closed order obj', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/users/1/orders/complete')
                        .set('Authorization', "Bearer ".concat(spareToken))];
                case 1:
                    response = _a.sent();
                    // console.log(Object.entries(response.body));
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual([{ id: 1, user_id: '1', status: 'complete' }]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('getOrderDetails, expect 200 and order details obj', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get('/users/1/orders/1/details')
                        .set('Authorization', "Bearer ".concat(spareToken))];
                case 1:
                    response = _a.sent();
                    expect(response.status).toBe(200);
                    expect(response.body).toEqual({
                        order: { id: 1, user_id: '1', status: 'complete' },
                        products: [
                            {
                                name: 'testProduct01',
                                quantity: '3',
                                price: '$42.42',
                                cost: '$127.26'
                            },
                            {
                                name: 'testProduct02',
                                quantity: '5',
                                price: '$10.00',
                                cost: '$50.00'
                            }
                        ]
                    });
                    console.log(response.body);
                    return [2 /*return*/];
            }
        });
    }); });
});
