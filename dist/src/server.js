"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dashboards_1 = __importDefault(require("./handlers/dashboards"));
var orders_1 = __importDefault(require("./handlers/orders"));
var products_1 = __importDefault(require("./handlers/products"));
var users_1 = __importDefault(require("./handlers/users"));
var app = (0, express_1.default)();
var ADDRESS = '127.0.0.1';
var PORT = 3000;
app.use(express_1.default.json());
(0, users_1.default)(app);
(0, products_1.default)(app);
(0, orders_1.default)(app);
(0, dashboards_1.default)(app);
app.listen(3000, function () {
    console.log("starting app on ".concat(ADDRESS, ":").concat(PORT));
});
exports.default = app;
