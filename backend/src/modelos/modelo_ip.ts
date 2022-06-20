import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"


class ModeloIp implements interfaz_modelo_ip {

    id_ip:string
    ip:string
    disponibulidad_ip:string
    drivePostgreSql:PostgreSql
    cliente:PoolClient

    constructor(drivePostgreSql_:PostgreSql,cliente_:PoolClient){
        this.id_ip=""
        this.ip=""
        this.disponibulidad_ip=""
        this.drivePostgreSql=drivePostgreSql_
        this.cliente=cliente_
    }

    setDatos(datos:any):void{
        this.id_ip=datos.id_ip
        this.ip=datos.ip
        this.disponibulidad_ip=datos.disponibulidad_ip
    }

    async registrar():Promise<QueryResult>{
        let SQL:string="INSERT INTO tip(ip,disponibulidad_ip) VALUES('"+this.ip+"','"+this.disponibulidad_ip+"') RETURNING id_ip"
        return await this.drivePostgreSql.query(this.cliente,SQL)
    }


}

export default ModeloIp