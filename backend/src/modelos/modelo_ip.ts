import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"


class ModeloIp implements interfaz_modelo_ip {

    id_ip:number
    ip:string
    disponibilidad_ip:string
    DrivePostgreSql:PostgreSql
    cliente:PoolClient

    constructor(DrivePostgreSql_:PostgreSql,cliente_:PoolClient){
        this.id_ip=0
        this.ip=""
        this.disponibilidad_ip=""
        this.DrivePostgreSql=DrivePostgreSql_
        this.cliente=cliente_
    }

    set setDatos(ip:interfaz_modelo_ip){
        this.id_ip=ip.id_ip
        this.ip=ip.ip
        this.disponibilidad_ip=ip.disponibilidad_ip
    }

    get getDatos():interfaz_modelo_ip{
        let datos:interfaz_modelo_ip={
            id_ip:this.id_ip,
            ip:this.ip,
            disponibilidad_ip:this.disponibilidad_ip
        }
        return datos
    }

    set setIdIp(id:number){
        this.id_ip=id
    }

    get getIdIp():number{
        return this.id_ip
    }

    set setIp(ip_:string){
        this.ip=ip_
    }

    get getIp():string{
        return this.ip
    }

    set setDisponibilidadIp(Disponibilidad:string){
        this.disponibilidad_ip=Disponibilidad
    }

    get getDisponibilidadIp():string{
        return this.disponibilidad_ip
    }

    async registrar():Promise<QueryResult>{
        let SQL:string="INSERT INTO tip(ip,disponibilidad_ip) VALUES($1,'1') RETURNING id_ip"
        let datos:any[]=[this.ip]
        return await this.DrivePostgreSql.query(this.cliente,SQL,datos)
    }

    async actualizarDireccion():Promise<QueryResult>{
        let SQL:string="UPDATE tip SET ip=$1 WHERE id_ip=$2"
        let datos:any[]=[this.ip,this.id_ip]
        return await this.DrivePostgreSql.query(this.cliente,SQL,datos)
    }

    async consultarPorIp(){
        const SQL:string=`SELECT * FROM tip WHERE ip=$1;`
        let datos:string[]=[this.ip]
        return await this.DrivePostgreSql.query(this.cliente,SQL,datos)
    }

    async consultarPorId(){
        const SQL:string="SELECT * FROM tip WHERE id_ip=$1;"
        let datos:any[]=[this.id_ip]
        return await this.DrivePostgreSql.query(this.cliente,SQL,datos)
    }

    async consultarPorIdYDisponibilidad(){
        const SQL:string="SELECT * FROM tip WHERE id_ip=$1 AND disponibilidad_ip='1';"
        let datos:any[]=[this.id_ip]
        return await this.DrivePostgreSql.query(this.cliente,SQL,datos)
    }

    async consultarTodo(){
        const SQL:string="SELECT * FROM tip;"
        return await this.DrivePostgreSql.query(this.cliente,SQL)
    }

    async resetiarIdTabla(){
        const SQL:string="ALTER SEQUENCE tip_id_ip_seq RESTART WITH 1;"
        return await this.DrivePostgreSql.query(this.cliente,SQL)
    }


}

export default ModeloIp