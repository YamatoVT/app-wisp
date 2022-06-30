"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.servidor = exports.app = void 0;
const app_1 = __importDefault(require("./app"));
exports.app = app_1.default;
let servidor = app_1.default.listen(app_1.default.get("puerto"), () => {
    console.log("ejecutando app en el puerto " + app_1.default.get("puerto"));
});
exports.servidor = servidor;
