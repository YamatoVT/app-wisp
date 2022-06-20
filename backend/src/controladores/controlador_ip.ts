import { Request, Response } from "express"
import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
import ModeloIp from "../modelos/modelo_ip"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"

let ControladorIp={

    test:async function (req:Request,res:Response):Promise<void> {
        let DriverPostgreSql=new PostgreSql()
        let cliente:PoolClient= await DriverPostgreSql.conectar()
        let modeloIp:ModeloIp=new ModeloIp(DriverPostgreSql,cliente)
        
        let ip:interfaz_modelo_ip={
            id_ip:"",
            ip:"192.168.1.0",
            disponibulidad_ip:"1"
        }
        modeloIp.setDatos(ip)
        let result=await modeloIp.registrar()
        console.log("datos =>>> ",result)
        DriverPostgreSql.cerrarConexion(cliente)

        
        res.writeHead(200,{"Content-Type":"Application/json"})
        res.write(JSON.stringify({"msj":"hola"}))
        res.end()

    }

}

export default ControladorIp