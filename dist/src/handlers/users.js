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
var user_1 = require("../models/user");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var authz_1 = require("../middlewares/authz");
var store = new user_1.UserStore();
var index = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.index()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(400).json('Unable to get users.')];
            case 3: return [2 /*return*/];
        }
    });
}); };
var get = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.params.user_id) {
                    return [2 /*return*/, res.status(401).json('Missing user_id.')];
                }
                return [4 /*yield*/, store.get(req.params.user_id)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, res.status(400).json(err_2)];
            case 3: return [2 /*return*/];
        }
    });
}); };
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, secret, token, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.username
                    || !req.body.password) {
                    return [2 /*return*/, res.status(401).json('Missing required fields.')];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.create({
                        username: req.body.username,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        password: req.body.password
                    })];
            case 2:
                newUser = _a.sent();
                if (!newUser) {
                    return [2 /*return*/, res.status(401).json('User exists.')];
                }
                secret = process.env.TOKEN_SECRET;
                token = jsonwebtoken_1.default.sign({ user: newUser }, secret);
                res.setHeader('Authorization', "Bearer ".concat(token));
                res.json("token generated: ".concat(token));
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(400);
                res.json(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var signin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, secret, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.username || !req.body.password) {
                    return [2 /*return*/, res.status(401).json('invalid credntials')];
                }
                return [4 /*yield*/, store.authenticate(req.body.username, req.body.password)];
            case 1:
                user = _a.sent();
                if (user) {
                    secret = process.env.TOKEN_SECRET;
                    token = jsonwebtoken_1.default.sign({ user: user }, secret);
                    res.setHeader('Authorization', "Bearer ".concat(token));
                    res.json("token generated: ".concat(token));
                }
                else {
                    res.status(401).json('User does not exist, may need to signup');
                }
                return [2 /*return*/];
        }
    });
}); };
var usersRouter = function (app) {
    app.get('/users', authz_1.adminAuthToken, index);
    app.get('/users/:user_id', authz_1.authzUser, get);
    app.post('/users/login', signin);
    app.post('/users', signup);
};
exports.default = usersRouter;
