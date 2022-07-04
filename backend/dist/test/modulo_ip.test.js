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
const index_1 = require("../index");
const modulo_ip_1 = require("./helpers/modulo_ip");
const postgresql_1 = __importDefault(require("../driver_db/postgresql"));
const modelo_ip_1 = __importDefault(require("../modelos/modelo_ip"));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const DRIVER_POSTGRESQL = new postgresql_1.default();
    const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
    const modeloIp = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
    yield modeloIp.EliminarDatos();
    yield modeloIp.resetiarIdTabla();
    DRIVER_POSTGRESQL.cerrarConexion(CLIENTE);
}));
afterAll(() => {
    index_1.servidor.close();
});
describe("pruebas End Point del modulo IP", () => {
    test("generar ips y devolvera 5 ip", () => __awaiter(void 0, void 0, void 0, function* () {
        let datosGenerar = {
            "ip_parte_1": 192,
            "ip_parte_2": 168,
            "host": 1,
            "desde": 1,
            "hasta": modulo_ip_1.helperModuloIp.datos.length
        };
        let respuestaApi = yield modulo_ip_1.api.post("/configuracion/ip/generar-ip")
            .send(datosGenerar)
            .expect(200);
        expect(modulo_ip_1.helperModuloIp.datos.length).toBe(respuestaApi.body.lista_ips.length);
    }));
    test("generar ips sin enviar datos tiene que arrojar un error 400", () => __awaiter(void 0, void 0, void 0, function* () {
        let respuestaApi = yield modulo_ip_1.api.post("/configuracion/ip/generar-ip")
            .send()
            .expect(400);
        expect(respuestaApi.body.codigo_respuesta).toBe("400");
    }));
    test("generar ips pero pasando texto tiene que arrojar un error 400", () => __awaiter(void 0, void 0, void 0, function* () {
        let datosGenerar = {
            "ip_parte_1": "192 ",
            "ip_parte_2": "168",
            "host": "1 ",
            "desde": "1 ",
            "hasta": modulo_ip_1.helperModuloIp.datos.length
        };
        let respuestaApi = yield modulo_ip_1.api.post("/configuracion/ip/generar-ip")
            .send(datosGenerar)
            .expect(400);
        expect(respuestaApi.body.codigo_respuesta).toBe("400");
    }));
    // =======
    // =======
    // =======
    // agregar test de validar formato de ip
    test("validar existencia ips ", () => __awaiter(void 0, void 0, void 0, function* () {
        const LISTA_IPS = modulo_ip_1.helperModuloIp.obtenerSoloIps();
        const respuestaApi = yield modulo_ip_1.api.post("/configuracion/ip/validar-exitencia-ips")
            .send({ lista_ips: [] })
            .expect(200);
        expect(respuestaApi.body.codigo_respuesta).toBe("200");
    }));
    test("validar existencia ips pasando en ves de un array un string vacio", () => __awaiter(void 0, void 0, void 0, function* () {
        const respuestaApi = yield modulo_ip_1.api.post("/configuracion/ip/validar-exitencia-ips")
            .send({ lista_ips: "" })
            .expect(400);
        expect(respuestaApi.body.codigo_respuesta).toBe("400");
    }));
    test("validar existencia ips sin pasar la propiedad ", () => __awaiter(void 0, void 0, void 0, function* () {
        const respuestaApi = yield modulo_ip_1.api.post("/configuracion/ip/validar-exitencia-ips")
            .expect(400);
        expect(respuestaApi.body.codigo_respuesta).toBe("400");
    }));
});
