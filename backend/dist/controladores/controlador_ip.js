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
    registrar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const DRIVER_POSTGRESQL = new postgresql_1.default();
        const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
        let estidoRegistro = true;
        const ERROR = false;
        const OK = true;
        let { lista_ips } = req.body;
        for (const MODELO_IP of lista_ips) {
            let resul = yield MODELO_IP.registrar();
            if (resul.rowCount == 1) {
                estidoRegistro = true;
            }
            else {
                estidoRegistro = false;
                break;
            }
        }
        if (estidoRegistro === OK) {
            let respuesta = {
                codigo_respuesta: "200",
                tipo_mensaje: "success",
                mensaje_respuesta: "registro completado"
            };
            res.type("json");
            res.status(200).json(respuesta);
        }
        if (estidoRegistro === ERROR) {
            let respuesta = {
                codigo_respuesta: "500",
                tipo_mensaje: "danger",
                mensaje_respuesta: "sucedio un error consulte a sistema"
            };
            res.type("json");
            res.status(500).json(respuesta);
        }
    }),
    consultar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    consultarTodos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    actualizarDireccion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    }),
    generarIps: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { ip_parte_1, ip_parte_2, host, desde, hasta } = req.body;
        const FIN = hasta;
        let listaIP = [];
        for (let contador = desde; contador <= FIN; contador++) {
            let ip = ip_parte_1 + "." + ip_parte_2 + "." + host + "." + contador;
            listaIP.push(ip);
        }
        res.type("json");
        res.status(200).json({ lista_ips: listaIP });
    }),
    // validarDisponivilidadIps: async () => {
    // },
    // validarDisponivilidadIp: async (modeloIp:ModeloIp):Promise<boolean>=> {
    //     let result:QueryResult=await modeloIp.consultarPorId()
    //     return (result.rowCount>0)? true: false
    // },
    validarExistenciaIpsEndPointNext: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const DRIVER_POSTGRESQL = new postgresql_1.default();
        const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
        let { lista_ips } = req.body;
        let LISTA_IP = lista_ips.map((direccion_ip) => {
            const MODELO_IP = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
            MODELO_IP.setIp = direccion_ip;
            return MODELO_IP;
        });
        let { LISTA_IP_EXISTENTES, LISTA_IP_NO_EXISTENTES, LISTA_IP_2 } = yield ControladorIp.validarExistenciaIps(LISTA_IP);
        const CANTIDAD_PERMITIDA = 0;
        if (LISTA_IP_EXISTENTES.length == CANTIDAD_PERMITIDA) {
            req.body.lista_ips = LISTA_IP_2;
            next();
        }
        else {
            res.type("json");
            let respuesta = {
                codigo_respuesta: "200",
                tipo_mensaje: "warning",
                mensaje_respuesta: "no se pudo procesar su solicitud de registro por el siguiente motivo, no se pueden volver a registrar ips que ya estan registrar",
                datos_respuesta: {
                    lista_ip_existentes: LISTA_IP_EXISTENTES,
                }
            };
            res.status(200).json(respuesta);
        }
    }),
    validarExistenciaIpsEndPoint: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const DRIVER_POSTGRESQL = new postgresql_1.default();
        const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
        let { lista_ips } = req.body;
        let LISTA_IP = lista_ips.map((direccion_ip) => {
            const MODELO_IP = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
            MODELO_IP.setIp = direccion_ip;
            return MODELO_IP;
        });
        let { LISTA_IP_EXISTENTES, LISTA_IP_NO_EXISTENTES, LISTA_IP_2 } = yield ControladorIp.validarExistenciaIps(LISTA_IP);
        LISTA_IP = LISTA_IP_2;
        res.type("json");
        let respuesta = {
            codigo_respuesta: "200",
            tipo_mensaje: "success",
            mensaje_respuesta: "soliciudad porcesada con exito",
            datos_respuesta: {
                lista_ip_existentes: LISTA_IP_EXISTENTES,
                lista_ip_no_existentes: LISTA_IP_NO_EXISTENTES,
                total_ip_existente: LISTA_IP_EXISTENTES.length,
                total_ip_no_existente: LISTA_IP_NO_EXISTENTES.length
            }
        };
        res.status(200).json(respuesta);
    }),
    validarExistenciaIps: (LISTA_IP) => __awaiter(void 0, void 0, void 0, function* () {
        const LISTA_IP_EXISTENTES = [];
        const LISTA_IP_NO_EXISTENTES = [];
        for (let contador = 0; contador < LISTA_IP.length; contador++) {
            const MODELO_IP = LISTA_IP[contador];
            const RESULT = yield MODELO_IP.consultarPorIp();
            if (RESULT.rowCount > 0) {
                MODELO_IP.setIdIp = RESULT.rows[0].id_ip;
                MODELO_IP.setDisponibilidadIp = RESULT.rows[0].disponibilidad_ip;
                LISTA_IP_EXISTENTES.push(MODELO_IP.getIp);
            }
            else {
                LISTA_IP_NO_EXISTENTES.push(MODELO_IP.getIp);
            }
        }
        return {
            LISTA_IP_EXISTENTES,
            LISTA_IP_NO_EXISTENTES,
            LISTA_IP_2: LISTA_IP
        };
    }),
    validarExistenciaIp: (modeloIp) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield modeloIp.consultarPorIp();
        return (result.rowCount > 0) ? true : false;
    }),
    obtenerContratoPorIp: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
exports.default = ControladorIp;
