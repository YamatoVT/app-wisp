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
    generarIps: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.ip_parte_1 && req.body.ip_parte_2 && req.body.host && req.body.desde && req.body.hasta) {
            const exprexion_1 = /[a-zA-Z]/g;
            const exprexion_2 = /\s/g;
            const { ip_parte_1, ip_parte_2, host, desde, hasta } = req.body;
            if (!exprexion_1.test(ip_parte_1) && !exprexion_1.test(ip_parte_2) && !exprexion_1.test(host) && !exprexion_1.test(desde) && !exprexion_1.test(hasta)) {
                if (!exprexion_2.test(ip_parte_1) && !exprexion_2.test(ip_parte_2) && !exprexion_2.test(host) && !exprexion_2.test(desde) && !exprexion_2.test(hasta)) {
                    const FIN = hasta;
                    let listaIP = [];
                    for (let contador = desde; contador <= FIN; contador++) {
                        let ip = ip_parte_1 + "." + ip_parte_2 + "." + host + "." + contador;
                        listaIP.push(ip);
                    }
                    res.type("json");
                    res.status(200).json({ lista_ips: listaIP });
                }
                else {
                    let respuesta = {
                        codigo_respuesta: "400",
                        tipo_mensaje: "danger",
                        mensaje_respuesta: "no se a procesado la solicitud por que no puede tener espacios en blanco"
                    };
                    res.type("json");
                    res.status(400).json(respuesta);
                }
            }
            else {
                let respuesta = {
                    codigo_respuesta: "400",
                    tipo_mensaje: "danger",
                    mensaje_respuesta: "no se a procesado la solicitud por que los datos enviados no son numericos"
                };
                res.type("json");
                res.status(400).json(respuesta);
            }
        }
        else {
            let respuesta = {
                codigo_respuesta: "400",
                tipo_mensaje: "danger",
                mensaje_respuesta: "no se a procesado la solicitud por que falta uno de los sigueinte propiedades (ip_parte_1,ip_parte_2,host,desde,hasta)"
            };
            res.type("json");
            res.status(400).json(respuesta);
        }
    }),
    registrar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let estidoRegistro = true;
        const ERROR = false;
        const OK = true;
        let { lista_ips, DRIVER_POSTGRESQL, CLIENTE } = req.body;
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
        yield DRIVER_POSTGRESQL.cerrarConexion(CLIENTE);
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
                codigo_respuesta: "400",
                tipo_mensaje: "danger",
                mensaje_respuesta: "sucedio un error al registrar, consulte a sistema"
            };
            res.type("json");
            res.status(400).json(respuesta);
        }
    }),
    consultarEndPointNext: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { ip } = req.body;
        const DRIVER_POSTGRESQL = new postgresql_1.default();
        const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
        let modeloip = yield ControladorIp.consultar(id, DRIVER_POSTGRESQL, CLIENTE);
        if (modeloip.length > 0) {
            req.body["DRIVER_POSTGRESQL"] = DRIVER_POSTGRESQL;
            req.body["CLIENTE"] = CLIENTE;
            next();
        }
        else {
            let respuesta = {
                codigo_respuesta: "404",
                tipo_mensaje: "danger",
                mensaje_respuesta: "la ip no esta registrar en la base de datos",
            };
            res.type("json");
            res.status(404).json(respuesta);
        }
    }),
    consultarEndPoint: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const DRIVER_POSTGRESQL = new postgresql_1.default();
        const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
        let ip = yield ControladorIp.consultar(id, DRIVER_POSTGRESQL, CLIENTE);
        yield DRIVER_POSTGRESQL.cerrarConexion(CLIENTE);
        if (ip.length > 0) {
            let respuesta = {
                codigo_respuesta: "200",
                tipo_mensaje: "success",
                mensaje_respuesta: "consulta completada",
                datos_respuesta: ip[0].getDatos
            };
            res.type("json");
            res.status(200).json(respuesta);
        }
        else {
            let respuesta = {
                codigo_respuesta: "400",
                tipo_mensaje: "danger",
                mensaje_respuesta: "la ip no esta registrar en la base de datos",
            };
            res.type("json");
            res.status(400).json(respuesta);
        }
    }),
    consultar: (id, DRIVER_POSTGRESQL, CLIENTE) => __awaiter(void 0, void 0, void 0, function* () {
        let datos = [];
        let modeloIp = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
        modeloIp.setIdIp = id;
        let result = yield modeloIp.consultarPorId();
        if (result.rowCount > 0) {
            for (const row of result.rows) {
                let datos_ip = {
                    id_ip: row.id_ip,
                    ip: row.ip,
                    disponibilidad_ip: row.disponibilidad_ip
                };
                const MODELO_IP = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
                MODELO_IP.setDatos = datos_ip;
                datos.push(MODELO_IP);
            }
        }
        return datos;
    }),
    consultarTodosEndPoint: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const DRIVER_POSTGRESQL = new postgresql_1.default();
        const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
        let lista_ips = yield ControladorIp.consultarTodos(DRIVER_POSTGRESQL, CLIENTE);
        yield DRIVER_POSTGRESQL.cerrarConexion(CLIENTE);
        if (lista_ips.length > 0) {
            let respuesta = {
                codigo_respuesta: "200",
                tipo_mensaje: "success",
                mensaje_respuesta: "consulta completada",
                datos_respuesta: lista_ips.map(ip => ip.getDatos)
            };
            res.type("json");
            res.status(200).json(respuesta);
        }
        else {
            let respuesta = {
                codigo_respuesta: "200",
                tipo_mensaje: "danger",
                mensaje_respuesta: "no hay ips registras en la base de datos",
            };
            res.type("json");
            res.status(200).json(respuesta);
        }
    }),
    consultarTodos: (DRIVER_POSTGRESQL, CLIENTE) => __awaiter(void 0, void 0, void 0, function* () {
        let datos = [];
        let modeloIp = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
        let result = yield modeloIp.consultarTodo();
        if (result.rowCount > 0) {
            for (const row of result.rows) {
                let datos_ip = {
                    id_ip: row.id_ip,
                    ip: row.ip,
                    disponibilidad_ip: row.disponibilidad_ip
                };
                const MODELO_IP = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
                MODELO_IP.setDatos = datos_ip;
                datos.push(MODELO_IP);
            }
        }
        return datos;
    }),
    actualizarDireccion: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { ip, DRIVER_POSTGRESQL, CLIENTE } = req.body;
        let exprexion_1 = /\s/g;
        if (!exprexion_1.test(ip) && ip !== "") {
            const MODELO_IP = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
            MODELO_IP.setIdIp = id;
            MODELO_IP.setIp = ip;
            let result = yield MODELO_IP.actualizarDireccion();
            yield DRIVER_POSTGRESQL.cerrarConexion(CLIENTE);
            if (result.rowCount > 0) {
                let respuesta = {
                    codigo_respuesta: "200",
                    tipo_mensaje: "success",
                    mensaje_respuesta: "actualizacion completada"
                };
                res.type("json");
                res.status(200).json(respuesta);
            }
            else {
                let respuesta = {
                    codigo_respuesta: "400",
                    tipo_mensaje: "danger",
                    mensaje_respuesta: "error al actualizar la direccion ip",
                };
                res.type("json");
                res.status(400).json(respuesta);
            }
        }
        else {
            let respuesta = {
                codigo_respuesta: "400",
                tipo_mensaje: "danger",
                mensaje_respuesta: "error al actualizar la direccion ip por que intento pasar el atributo basio",
            };
            res.type("json");
            res.status(400).json(respuesta);
        }
    }),
    validarExistenciaIpsEndPointNext: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const DRIVER_POSTGRESQL = new postgresql_1.default();
        const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
        if (req.body.lista_ips) {
            let { lista_ips } = req.body;
            if (Object.getPrototypeOf(lista_ips) === Array.prototype) {
                let LISTA_IP = lista_ips.map((direccion_ip) => {
                    const MODELO_IP = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
                    MODELO_IP.setIp = direccion_ip;
                    return MODELO_IP;
                });
                let { LISTA_IP_EXISTENTES, LISTA_IP_NO_EXISTENTES, LISTA_IP_2 } = yield ControladorIp.validarExistenciaIps(LISTA_IP);
                // await DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
                const CANTIDAD_PERMITIDA = 0;
                if (LISTA_IP_EXISTENTES.length == CANTIDAD_PERMITIDA) {
                    req.body.lista_ips = LISTA_IP_2;
                    req.body["DRIVER_POSTGRESQL"] = DRIVER_POSTGRESQL;
                    req.body["CLIENTE"] = CLIENTE;
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
            }
            else {
                let respuesta = {
                    codigo_respuesta: "400",
                    tipo_mensaje: "danger",
                    mensaje_respuesta: "no se a procesado la solicitud por que falta la propiedad lista_ips no fue pasado como un array fue pasado como un " + Object.getPrototypeOf(lista_ips)
                };
                res.type("json");
                res.status(400).json(respuesta);
            }
        }
        else {
            res.type("json");
            let respuesta = {
                codigo_respuesta: "400",
                tipo_mensaje: "warning",
                mensaje_respuesta: "no se a procesado la solicitud por que falta la propiedad lista_ips",
            };
            res.status(400).json(respuesta);
        }
    }),
    validarExistenciaIpsEndPoint: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const DRIVER_POSTGRESQL = new postgresql_1.default();
        const CLIENTE = yield DRIVER_POSTGRESQL.conectar();
        if (req.body.lista_ips) {
            let { lista_ips } = req.body;
            if (Object.getPrototypeOf(lista_ips) === Array.prototype) {
                let LISTA_IP = lista_ips.map((direccion_ip) => {
                    const MODELO_IP = new modelo_ip_1.default(DRIVER_POSTGRESQL, CLIENTE);
                    MODELO_IP.setIp = direccion_ip;
                    return MODELO_IP;
                });
                let { LISTA_IP_EXISTENTES, LISTA_IP_NO_EXISTENTES, LISTA_IP_2 } = yield ControladorIp.validarExistenciaIps(LISTA_IP);
                yield DRIVER_POSTGRESQL.cerrarConexion(CLIENTE);
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
            }
            else {
                let respuesta = {
                    codigo_respuesta: "400",
                    tipo_mensaje: "danger",
                    mensaje_respuesta: "no se a procesado la solicitud por que falta la propiedad lista_ips no fue pasado como un array fue pasado como un " + Object.getPrototypeOf(lista_ips)
                };
                res.type("json");
                res.status(400).json(respuesta);
            }
        }
        else {
            let respuesta = {
                codigo_respuesta: "400",
                tipo_mensaje: "danger",
                mensaje_respuesta: "no se a procesado la solicitud por que falta la propiedad lista_ips"
            };
            res.type("json");
            res.status(400).json(respuesta);
        }
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
};
exports.default = ControladorIp;
