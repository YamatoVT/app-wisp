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
Object.defineProperty(exports, "__esModule", { value: true });
class ModeloIp {
    constructor(DrivePostgreSql_, cliente_) {
        this.id_ip = "";
        this.ip = "";
        this.disponibulidad_ip = "";
        this.DrivePostgreSql = DrivePostgreSql_;
        this.cliente = cliente_;
    }
    setDatos(datos) {
        this.id_ip = datos.id_ip;
        this.ip = datos.ip;
        this.disponibulidad_ip = datos.disponibulidad_ip;
    }
    registrar() {
        return __awaiter(this, void 0, void 0, function* () {
            let SQL = "INSERT INTO tip(ip,disponibulidad_ip) VALUES('" + this.ip + "','" + this.disponibulidad_ip + "') RETURNING id_ip";
            return yield this.DrivePostgreSql.query(this.cliente, SQL);
        });
    }
    consultarPorIp() {
        return __awaiter(this, void 0, void 0, function* () {
            const SQL = "SELECT * FROM tip WHERE ip='" + this.ip + "'";
            return yield this.DrivePostgreSql.query(this.cliente, SQL);
        });
    }
    consultarPorId() {
        return __awaiter(this, void 0, void 0, function* () {
            const SQL = "SELECT * FROM tip WHERE ip=" + this.id_ip + " AND disponibulidad_ip='1';";
            return yield this.DrivePostgreSql.query(this.cliente, SQL);
        });
    }
    resetiarIdTabla() {
        return __awaiter(this, void 0, void 0, function* () {
            const SQL = "ALTER SEQUENCE tip_id_ip_seq RESTART WITH 1;";
            return yield this.DrivePostgreSql.query(this.cliente, SQL);
        });
    }
}
exports.default = ModeloIp;
