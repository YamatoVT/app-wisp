import DriverInterfaz from "../interfaz/driver_db"
import {Pool} from "pg"
import dotEnv from "dotenv"
dotEnv.config()

class PostgreSql implements DriverInterfaz{

    host: string
    port: string
    db: string
    user: string
    pass: string
    config: Object

    constructor(){
        this.host=process.env.DB_HOST as string
        this.port=process.env.DB_PORT as string
        this.db=process.env.DB as string
        this.user=process.env.DB_USER as string
        this.pass=process.env.DB_CLAVE as string
        this.config={
            host: this.host,
            port: this.port,
            database: this.db,
            user: this.user,
            password: this.db
        }
        let configPool=new Pool(this.config)
    }

}