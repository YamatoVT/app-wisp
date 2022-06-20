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
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
class PostgreSql {
    constructor() {
        this.host = process.env.DB_HOST;
        this.port = process.env.DB_PORT;
        this.db = process.env.DB;
        this.user = process.env.DB_USER;
        this.pass = process.env.DB_CLAVE;
        this.config = {
            host: this.host,
            port: this.port,
            database: this.db,
            user: this.user,
            password: this.db
        };
        this.pool = new pg_1.Pool(this.config);
    }
    conectar() {
        return __awaiter(this, void 0, void 0, function* () {
            let cliente = yield this.pool.connect();
            return cliente;
        });
    }
    query(SQL, cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield cliente.query(SQL);
            // cliente.release()
            return result;
        });
    }
    cerrarConexion(cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            cliente.release();
            this.pool.end();
        });
    }
}
exports.default = PostgreSql;
