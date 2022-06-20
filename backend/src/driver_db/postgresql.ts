import DriverInterfaz from "../interfaz/driver_db"
import {Pool, PoolClient, QueryResult} from "pg"
import dotEnv from "dotenv"
import path from "path"
dotEnv.config({ path: path.resolve(__dirname, '../.env') })

class PostgreSql implements DriverInterfaz{

    host: string
    port: string
    db: string
    user: string
    pass: string
    config: Object
    pool: Pool

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
        this.pool=new Pool(this.config)
    }
    

    async conectar():Promise<PoolClient>{
        let cliente:PoolClient= await this.pool.connect()
        return cliente
    }

    async query(SQL:string,cliente:PoolClient):Promise<QueryResult>{
        let result:QueryResult=await cliente.query(SQL)
        // cliente.release()
        return result
    }
    
    async cerrarConexion(cliente:PoolClient):Promise<void>{
        cliente.release()
        this.pool.end()
    }

}

export default PostgreSql