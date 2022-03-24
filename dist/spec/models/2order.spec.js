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
var order_1 = require("../../src/models/order");
var database_1 = __importDefault(require("../../src/database"));
var orderStore = new order_1.OrderStore();
describe("Order Model", function () {
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
      VALUES ('testProduct01', 42.42);").then(function () { return conn.release(); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var order = {
        user_id: '1',
        status: 'active'
    };
    it('create() returns an Order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, orderStore.create(order.user_id)];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual({
                        id: 1,
                        user_id: '1',
                        status: 'active'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('getOrder() returns an Order by user_id, order_id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, orderStore.getOrder('1', '1')];
                case 1:
                    result = _a.sent();
                    expect({
                        id: result.id,
                        user_id: result.user_id,
                        status: result.status
                    }).toEqual({
                        id: 1,
                        user_id: '1',
                        status: 'active'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('checkOrderStatus() returns Order by order_id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, orderStore.checkOrderStatus('1')];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual({
                        id: 1,
                        user_id: '1',
                        status: 'active'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // // Checks for Order status
    // // addProduct() adds an order_products entry if Order is active
    // // throws error if Order was complete while adding a product.
    it('addProduct() returns Order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, orderStore.addProduct('1', '5', '1')];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual({
                        order_id: '1',
                        quantity: 5,
                        product_id: '1'
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('completedOrders() returns all completed Orders by user_id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var conn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.default.connect()];
                case 1:
                    conn = _a.sent();
                    // setting order to be complete
                    return [4 /*yield*/, conn.query("UPDATE orders SET status='complete' \
      WHERE id=1;")];
                case 2:
                    // setting order to be complete
                    _a.sent();
                    conn.release();
                    return [4 /*yield*/, orderStore.completedOrders('1')];
                case 3:
                    result = _a.sent();
                    expect(result.length).toEqual(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('checkOrderStatus() expects order_id 1 status to be complete', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, orderStore.checkOrderStatus('1')];
                case 1:
                    result = _a.sent();
                    expect(result.status).toEqual('complete');
                    return [2 /*return*/];
            }
        });
    }); });
    it('addProduct() throws err since order status is complete', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expectAsync(orderStore.addProduct('1', '5', '1'))
                        .toBeRejectedWithError(/.+already complete/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // closeOrder() throws an err if order is already complete
    // if Order status is 'active', update it to 'complete'
    it('closeOrder() throws err if order is complete, else, closes order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var conn, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expectAsync(orderStore.closeOrder('1'))
                        .toBeRejectedWithError(/.+already complete/)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, database_1.default.connect()];
                case 2:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query("UPDATE orders SET status='active' \
    WHERE id=1;")];
                case 3:
                    _a.sent();
                    conn.release();
                    return [4 /*yield*/, orderStore.closeOrder('1')];
                case 4:
                    result = _a.sent();
                    expect(result.status).toEqual('complete');
                    return [2 /*return*/];
            }
        });
    }); });
    it('getProducts()', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, orderStore.getProducts(1)];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    expect(result.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
