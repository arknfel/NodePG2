"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var books_1 = __importDefault(require("./handlers/books"));
var users_1 = __importDefault(require("./handlers/users"));
var app = (0, express_1.default)();
var ADDRESS = '127.0.0.1';
var PORT = 3000;
app.use(body_parser_1.default.json());
(0, books_1.default)(app);
(0, users_1.default)(app);
app.listen(3000, function () {
    console.log("starting app on ".concat(ADDRESS, ":").concat(PORT));
});
