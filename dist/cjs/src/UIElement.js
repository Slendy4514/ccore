"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var UIElement = (function () {
    function UIElement(json, db) {
        this.father = [];
        this.name = json.name;
        this.selectors = json.selectors;
        this.father = json.father;
        this.url = json.url;
        this.defaultAction = json.defaultAction || "get";
        this.database = db;
    }
    UIElement.prototype.getSelector = function (at) {
        if (at === void 0) { at = 0; }
        return this.selectors[at].selector;
    };
    UIElement.prototype.getSelectorType = function (at) {
        if (at === void 0) { at = 0; }
        return this.selectors[at]["type"];
    };
    UIElement.prototype.getPath = function (at) {
        if (at === void 0) { at = 0; }
        return this.father[at] || null;
    };
    UIElement.prototype.execute = function (args_1) {
        return __awaiter(this, arguments, void 0, function (args, action) {
            var element;
            var _this = this;
            if (action === void 0) { action = this.defaultAction; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!_a.elementActions[action])
                            throw Error("Action not found");
                        return [4, _a.elementActions.get(this, args)
                                .catch(function (error) { return _a.callbacks.onSelectorError(_this, error, _a.elementActions[action], __assign(__assign({}, args), { element: _this })); })];
                    case 1:
                        element = _b.sent();
                        if (element)
                            _a.callbacks.onSelectorSuccess(this, args);
                        if (action === "get")
                            return [2, element];
                        if (!element) return [3, 3];
                        return [4, _a.elementActions[action](this, args)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!(!element && this.father.length === 0)) return [3, 5];
                        return [4, this.checkURL(args, action)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [4, this.pathFinder(args)
                            .then(function () { return _a.callbacks.onPathSuccess(_this, args); })
                            .catch(function (error) { return _a.callbacks.onPathError(_this, error, _this.pathFinder, args); })];
                    case 6:
                        _b.sent();
                        return [4, _a.elementActions[action](this, args)];
                    case 7:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    UIElement.prototype.checkURL = function (args_1) {
        return __awaiter(this, arguments, void 0, function (args, action) {
            var currentUrl;
            if (action === void 0) { action = this.defaultAction; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, _a.globalActions.getUrl()];
                    case 1:
                        currentUrl = _b.sent();
                        if (currentUrl === this.url)
                            throw Error("Element not found on spected url");
                        return [4, _a.globalActions.url(this.url)];
                    case 2:
                        _b.sent();
                        return [4, this.execute(args, action)];
                    case 3:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    UIElement.prototype.pathFinder = function (args, at) {
        return __awaiter(this, void 0, void 0, function () {
            var path, father;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        path = this.getPath(at);
                        if (!path)
                            return [2];
                        if (!!path.element) return [3, 2];
                        return [4, _a.globalActions[path.action](__assign(__assign({}, args), path.params))];
                    case 1: return [2, _b.sent()];
                    case 2: return [4, this.database.getElement(path.element)];
                    case 3:
                        father = _b.sent();
                        if (!father)
                            throw Error("Father element not found");
                        return [4, father.execute(__assign(__assign({}, args), path.params), path.action)];
                    case 4:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    var _a;
    _a = UIElement;
    UIElement.callbacks = {
        onSelectorSuccess: function (element) { return __awaiter(void 0, void 0, void 0, function () { return __generator(_a, function (_b) {
            return [2];
        }); }); },
        onSelectorError: function (element, error) { return __awaiter(void 0, void 0, void 0, function () { return __generator(_a, function (_b) {
            return [2];
        }); }); },
        onPathSuccess: function (element, args) { return __awaiter(void 0, void 0, void 0, function () { return __generator(_a, function (_b) {
            return [2];
        }); }); },
        onPathError: function (element, error, cb) { return __awaiter(void 0, void 0, void 0, function () { return __generator(_a, function (_b) {
            return [2];
        }); }); }
    };
    return UIElement;
}());
exports.default = UIElement;
//# sourceMappingURL=UIElement.js.map