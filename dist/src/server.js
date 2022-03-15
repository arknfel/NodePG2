"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var books_1 = __importDefault(require("./handlers/books"));
var app = (0, express_1.default)();
var ADDRESS = '127.0.0.1';
var PORT = 3000;
app.use(body_parser_1.default.json());
(0, books_1.default)(app);
app.listen(3000, function () {
    console.log("starting app on ".concat(ADDRESS, ":").concat(PORT));
});
// VIEWS
// All books
// app.get('/books', async function(req: Request, res: Response) {
//   const store = new BookStore();
//   await store.index()
//     .then(result => {
//       res.json(result);
//     });
// });
// GET book by id
// app.get('/books/:id', function(req: Request, res: Response) {
//   const store = new BookStore();
//   store.get(req.params.id)
//     .then(result => {
//       res.json(result);
//     });
// });
// CREATE book
// app.post('/books', function(req: Request, res: Response) {
//   const store = new BookStore();
//   store.create(req.body)
//     .then(result => {
//       res.json(result);
//     });
// });
// // UPDATE book by id
// app.put('/books/:id', function(req: Request, res: Response) {
//   const store = new BookStore();
//   store.update(req.params.id, req.body)
//     .then(result => {
//       res.json(result);
//     });
// });
// // DELETE book by id
// app.delete('/books/:id', function(req: Request, res: Response) {
//   const store = new BookStore();
//   store.delete(req.params.id)
//     .then(result => {
//       res.json(result);
//     });
// });
