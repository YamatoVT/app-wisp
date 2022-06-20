"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
let app = (0, express_1.default)();
const puerto = process.env.PORT || 5000;
// set
app.set("puerto", puerto);
// middleware
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static(__dirname + "/upload"));
// rutas 
const index_1 = __importDefault(require("./rutas/ip/index"));
app.use("/configuracion/ip", index_1.default);
module.exports = app;
