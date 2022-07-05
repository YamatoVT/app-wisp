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
let ipTestRegistro = {
    id_ip: 6,
    ip: "192.168.1.6",
    disponibilidad_ip: "1"
};
let helperModuloIp = {
    datos: datosIps,
    ipTestRegistro,
    obtenerSoloIps: () => {
        return helperModuloIp.datos.map(ip => ip.ip);
    },
    consultarTodos: () => __awaiter(void 0, void 0, void 0, function* () {
        const respuestaApi = yield api.get("/configuracion/ip/consultar-todos");
        return respuestaApi.body.datos_respuesta;
    }),
    consultar: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const respuestaApi = yield api.get("/configuracion/ip/consultar/" + id);
        return respuestaApi.body.datos_respuesta;
    }),
    precargarDatos: () => __awaiter(void 0, void 0, void 0, function* () {
        const respuestaApi = yield api.post("/configuracion/ip/registrar")
            .send({ lista_ips: helperModuloIp.obtenerSoloIps() });
        return respuestaApi.body;
    })
};
exports.helperModuloIp = helperModuloIp;
