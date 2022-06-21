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
let ControladorIp = {
    registrar: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const DRIVER_POSTGRESQL = new postgresql_1.default();
            const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
            let { datos_cliente } = req.body;
            /*
            const IPS:Object[] = datos_cliente.ips
            for (const IP of IPS) {
                const IP_NO_ECONTRADA:boolean=false
                let modeloIp: ModeloIp = new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
                modeloIp.setDatos(IP)
                let ipEncontrada:boolean=await this.validarDisponivilidadIp(modeloIp)
                if(ipEncontrada == IP_NO_ECONTRADA){
    
                }
                else{
                    
                }
            }
            */
        });
    },
    consultar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    consultarTodos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    actualizar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    generarIps: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { datos_cliente } = req.body;
        let { ip_parte_1, ip_parte_2, host, desde, hasta } = datos_cliente;
        let fin = hasta;
        let listaIP = [];
        for (let contador = desde; contador <= fin; contador++) {
            let ip = ip_parte_1 + "." + ip_parte_2 + "." + host + "." + contador;
            listaIP.push(ip);
        }
        res.type("json");
        res.status(200).json({ listaIP });
    }),
    validarDisponivilidadIps: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    validarDisponivilidadIp: (modeloIp) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield modeloIp.consultarPorId();
        return (result.rowCount > 0) ? true : false;
    }),
    validarExitenciaIps: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    validarExitenciaIp: (modeloIp) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield modeloIp.consultarPorIp();
        return (result.rowCount > 0) ? true : false;
    }),
    obtenerContratoPorIp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    })
};
exports.default = ControladorIp;
