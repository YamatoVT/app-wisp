import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"


class ModeloIp extends PostgreSql implements interfaz_modelo_ip {

    id_ip:string
    ip:string
    disponibulidad_ip:string

    constructor(){
        super()
        this.id_ip=""
        this.ip=""
        this.disponibulidad_ip=""
    }

    setDatos(datos:any):void{
        this.id_ip=datos.id_ip
        this.ip=datos.ip
        this.disponibulidad_ip=datos.disponibulidad_ip
    }

    async registrar():Promise<QueryResult>{
        let SQL:string="INSERT INTO tip(ip,disponibulidad_ip) VALUES('"+this.ip+"','"+this.disponibulidad_ip+"')"
        return await this.query(SQL)
    }


}

export default ModeloIp