import DriverInterfaz from "../interfaz/driver_db"
import {Pool, PoolClient, QueryResult} from "pg"
import dotEnv from "dotenv"
import path from "path"
dotEnv.config({ path: path.resolve(__dirname, '../.env') })

class PostgreSql implements DriverInterfaz{

    host: string
    port: string
    db_name: string
    user: string
    pass: string
    config: Object
    pool: Pool

    constructor(){
        this.host=(process.env.DB_HOST)? process.env.DB_HOST as string: ""
        this.port=(process.env.DB_PORT)? process.env.DB_PORT as string: ""
        this.db_name=(process.env.DB_NAME)? process.env.DB_NAME as string: ""
        this.user=(process.env.DB_USER)? process.env.DB_USER as string: ""
        this.pass=(process.env.DB_PASS)? process.env.DB_PASS as string: ""
        this.config={
            host: this.host,
            port: this.port,
            database: this.db_name,
            user: this.user,
            password: this.pass
        }
        this.pool=new Pool(this.config)
    }

    setHost(host_:string){
        this.host=host_
    }

    setPort(port_:string){
        this.port=port_
    }

    setDBame(db_name_:string){
        this.db_name=db_name_
    }

    setUser(user_:string){
        this.user=user_
    }

    setPass(pass_:string){
        this.pass=pass_
    }
    

    async conectar():Promise<PoolClient>{
        let cliente:PoolClient= await this.pool.connect()
        return cliente
    }

    async query(cliente:PoolClient,SQL:string,datos?:any[]):Promise<QueryResult>{
        if(datos){
            let result:QueryResult=await cliente.query(SQL,datos)
            return result
        }
        else{
            let result:QueryResult=await cliente.query(SQL)
            return result
        }
        

    }
    
    async cerrarConexion(cliente:PoolClient):Promise<void>{
        cliente.release()
        this.pool.end()
    }

}

export default PostgreSql