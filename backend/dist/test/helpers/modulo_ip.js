"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helperModuloIp = exports.api = void 0;
const index_1 = require("../../index");
const supertest_1 = __importDefault(require("supertest"));
let api = (0, supertest_1.default)(index_1.app);
exports.api = api;
let datosIps = [
    {
        id_ip: 1,
        ip: "192.168.1.1",
        disponibilidad_ip: "1"
    },
    {
        id_ip: 2,
        ip: "192.168.1.2",
        disponibilidad_ip: "1"
    },
    {
        id_ip: 3,
        ip: "192.168.1.3",
        disponibilidad_ip: "1"
    },
    {
        id_ip: 4,
        ip: "192.168.1.4",
        disponibilidad_ip: "1"
    },
    {
        id_ip: 5,
        ip: "192.168.1.5",
        disponibilidad_ip: "1"
    }
];
let helperModuloIp = {
    datos: datosIps,
    obtenerSoloIps: () => {
        return helperModuloIp.datos.map(ip => ip.ip);
    }
};
exports.helperModuloIp = helperModuloIp;
