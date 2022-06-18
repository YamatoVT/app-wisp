"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controladores
const controlador_ip_1 = __importDefault(require("../../controladores/controlador_ip"));
let router = (0, express_1.Router)();
router.get("/test", controlador_ip_1.default.test);
exports.default = router;
