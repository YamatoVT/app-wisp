"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controladores
const controlador_ip_1 = __importDefault(require("../../controladores/controlador_ip"));
let router = (0, express_1.Router)();
router.post("/generar-ip", controlador_ip_1.default.generarIps);
router.post("/validar-exitencia-ips", controlador_ip_1.default.validarExistenciaIpsEndPoint);
router.post("/registrar", controlador_ip_1.default.validarExistenciaIpsEndPointNext, controlador_ip_1.default.registrar);
exports.default = router;
