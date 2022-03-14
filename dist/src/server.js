"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var book_1 = require("./models/book");
var app = (0, express_1.default)();
var ADDRESS = '127.0.0.1';
var PORT = 3000;
app.use(body_parser_1.default.json());
// VIEWS
// All books
app.get('/books', function (req, res) {
    var store = new book_1.BookStore();
    store.all()
        .then(function (result) {
        res.json(result);
    });
});
// GET book by id
app.get('/books/:id', function (req, res) {
    var store = new book_1.BookStore();
    store.get(req.params.id)
        .then(function (result) {
        res.json(result);
    });
});
// CREATE book
app.post('/books', function (req, res) {
    var store = new book_1.BookStore();
    store.create(req.body)
        .then(function (result) {
        res.json(result);
    });
});
// UPDATE book by id
app.put('/books/:id', function (req, res) {
    var store = new book_1.BookStore();
    store.update(req.params.id, req.body)
        .then(function (result) {
        res.json(result);
    });
});
// DELETE book by id
app.delete('/books/:id', function (req, res) {
    var store = new book_1.BookStore();
    store.delete(req.params.id)
        .then(function (result) {
        res.json(result);
    });
});
app.listen(3000, function () {
    console.log("starting app on ".concat(ADDRESS, ":").concat(PORT));
});
