import { Request, Response } from "express"
import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
import ModeloIp from "../modelos/modelo_ip"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"

let ControladorIp={

    test:async (req:Request,res:Response):Promise<void> =>{
        let DriverPostgreSql=new PostgreSql()
        let cliente:PoolClient= await DriverPostgreSql.conectar()
        let modeloIp:ModeloIp=new ModeloIp(DriverPostgreSql,cliente)
        res.type("json")
        res.status(200).json({msj:"hola"})
        res.end()
    },

    registrar: async function (req:Request,res:Response) {

    },

    consultar: async (req:Request,res:Response) => {

    },

    consultarTodos: async (req:Request,res:Response) => {

    },

    actualizar:async (req:Request,res:Response) => {

    },

    generarIps: async (req:Request,res:Response) => {

    },

    validarDisponivilidadIps: async (req:Request,res:Response) => {

    },

    obtenerContratoPorIp: async (req:Request,res:Response) => {

    }

}

export default ControladorIp