"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
        let configPool = new pg_1.Pool(this.config);
    }
}
