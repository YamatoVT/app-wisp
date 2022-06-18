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
class ModeloIp extends postgresql_1.default {
    constructor() {
        super();
        this.id_ip = "";
        this.ip = "";
        this.disponibulidad_ip = "";
    }
    setDatos(datos) {
        this.id_ip = datos.id_ip;
        this.ip = datos.ip;
        this.disponibulidad_ip = datos.disponibulidad_ip;
    }
    registrar() {
        return __awaiter(this, void 0, void 0, function* () {
            let SQL = "INSERT INTO tip(ip,disponibulidad_ip) VALUES('" + this.ip + "','" + this.disponibulidad_ip + "')";
            return yield this.query(SQL);
        });
    }
}
exports.default = ModeloIp;
