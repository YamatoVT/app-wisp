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
const postgresql_1 = __importDefault(require("../driver_db/postgresql"));
const modelo_ip_1 = __importDefault(require("../modelos/modelo_ip"));
let ControladorIp = {
    test: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let DriverPostgreSql = new postgresql_1.default();
            let cliente = yield DriverPostgreSql.conectar();
            let modeloIp = new modelo_ip_1.default(DriverPostgreSql, cliente);
            let ip = {
                id_ip: "",
                ip: "192.168.1.0",
                disponibulidad_ip: "1"
            };
            modeloIp.setDatos(ip);
            let result = yield modeloIp.registrar();
            console.log("datos =>>> ", result);
            DriverPostgreSql.cerrarConexion(cliente);
            res.writeHead(200, { "Content-Type": "Application/json" });
            res.write(JSON.stringify({ "msj": "hola" }));
            res.end();
        });
    }
};
exports.default = ControladorIp;
