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
Object.defineProperty(exports, "__esModule", { value: true });
var authz_1 = require("../middlewares/authz");
var order_1 = require("../models/order");
var store = new order_1.OrderStore();
// INDEX
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.index(req.params.user_id)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(400).json(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// const getOrder = async (req: Request, res: Response) => {
//   try {
//     const order_id = req.params.order_id;
//     const user_id = req.params.user_id;
//     const order = await store.getOrder(
//       order_id,
//       user_id
//     );
//     res.json(order);
//   } catch (err) {
//     res.status(400).json(`${err}`); 
//   }
// };
// SHOW
var checkOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.checkOrderStatus(req.params.order_id)];
            case 1:
                order = _a.sent();
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(400).json("".concat(err_2));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// CREATE
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.params.user_id) {
                    return [2 /*return*/, res.status(400).json('Invalid URL, missing user_id')];
                }
                return [4 /*yield*/, store.create(req.params.user_id)];
            case 1:
                product = _a.sent();
                res.json(product);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(400).json("".concat(err_3));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var completedOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, order, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_id = req.params.user_id;
                return [4 /*yield*/, store.completedOrders(user_id)];
            case 1:
                order = _a.sent();
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(400).json("".concat(err_4));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var addedProduct, closedOrder, orderProducts, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, store.addProduct(req.params.order_id, req.body.quantity, req.body.product_id)];
            case 1:
                addedProduct = _a.sent();
                if (!(req.query.status && req.query.status == 'complete')) return [3 /*break*/, 4];
                return [4 /*yield*/, store.closeOrder(req.params.order_id)];
            case 2:
                closedOrder = _a.sent();
                return [4 /*yield*/, store.getProducts(req.params.order_id)];
            case 3:
                orderProducts = _a.sent();
                return [2 /*return*/, res.json({
                        message: 'order complete',
                        order: closedOrder,
                        products: orderProducts
                    })];
            case 4:
                res.json(addedProduct);
                return [3 /*break*/, 6];
            case 5:
                err_5 = _a.sent();
                res.status(400).json("".concat(err_5));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var closeOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var closedOrder, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.closeOrder(req.params.order_id)];
            case 1:
                closedOrder = _a.sent();
                res.json(closedOrder);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                res.status(400).json("".concat(err_6));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getOrderDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order, products, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, store.checkOrderStatus(req.params.order_id)];
            case 1:
                order = _a.sent();
                return [4 /*yield*/, store.getProducts(req.params.order_id)];
            case 2:
                products = _a.sent();
                res.json({ order: order, products: products });
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                res.status(400).json("".concat(err_7));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var ordersRouter = function (app) {
    app.get('/users/:user_id/orders', authz_1.authzUser, index);
    app.get('/users/:user_id/orders/complete', authz_1.authzUser, completedOrders);
    app.get('/users/:user_id/orders/:order_id', authz_1.authzUser, checkOrder);
    app.post('/users/:user_id/orders', authz_1.authzUser, create);
    app.get('/users/:user_id/orders/:order_id/details', authz_1.authzUser, getOrderDetails);
    app.post('/users/:user_id/orders/:order_id/products', authz_1.authzUser, addProduct);
    app.put('/users/:user_id/orders/:order_id/close', authz_1.authzUser, closeOrder);
};
exports.default = ordersRouter;
