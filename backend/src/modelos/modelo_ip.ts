import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"


class ModeloIp implements interfaz_modelo_ip {

    id_ip:string
    ip:string
    disponibulidad_ip:string
    DrivePostgreSql:PostgreSql
    cliente:PoolClient

    constructor(DrivePostgreSql_:PostgreSql,cliente_:PoolClient){
        this.id_ip=""
        this.ip=""
        this.disponibulidad_ip=""
        this.DrivePostgreSql=DrivePostgreSql_
        this.cliente=cliente_
    }

    setDatos(datos:any):void{
        this.id_ip=datos.id_ip
        this.ip=datos.ip
        this.disponibulidad_ip=datos.disponibulidad_ip
    }

    async registrar():Promise<QueryResult>{
        let SQL:string="INSERT INTO tip(ip,disponibulidad_ip) VALUES('"+this.ip+"','"+this.disponibulidad_ip+"') RETURNING id_ip"
        return await this.DrivePostgreSql.query(this.cliente,SQL)
    }

    async consultarPorIp(){
        const SQL:string="SELECT * FROM tip WHERE ip='"+this.ip+"'"
        return await this.DrivePostgreSql.query(this.cliente,SQL)
    }

    async consultarPorId(){
        const SQL:string="SELECT * FROM tip WHERE ip="+this.id_ip+" AND disponibulidad_ip='1';"
        return await this.DrivePostgreSql.query(this.cliente,SQL)
    }

    async resetiarIdTabla(){
        const SQL:string="ALTER SEQUENCE tip_id_ip_seq RESTART WITH 1;"
        return await this.DrivePostgreSql.query(this.cliente,SQL)
    }


}

export default ModeloIp