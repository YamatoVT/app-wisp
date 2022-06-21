import { Request, Response } from "express"
import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
import ModeloIp from "../modelos/modelo_ip"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"

let ControladorIp={

    registrar: async function (req:Request,res:Response) {
        const DRIVER_POSTGRESQL:PostgreSql= new PostgreSql()
        const CLIENTE:PoolClient = await DRIVER_POSTGRESQL.conectar()
        let {datos_cliente} = req.body
        /*
        const IPS:Object[] = datos_cliente.ips
        for (const IP of IPS) {
            const IP_NO_ECONTRADA:boolean=false
            let modeloIp: ModeloIp = new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
            modeloIp.setDatos(IP)
            let ipEncontrada:boolean=await this.validarDisponivilidadIp(modeloIp)
            if(ipEncontrada == IP_NO_ECONTRADA){

            }
            else{
                
            }
        }
        */
        

    },

    consultar: async (req:Request,res:Response) => {

    },

    consultarTodos: async (req:Request,res:Response) => {

    },

    actualizar:async (req:Request,res:Response) => {

    },

    generarIps: async (req:Request,res:Response) => {
        let {datos_cliente} = req.body
        let {ip_parte_1,ip_parte_2,host,desde,hasta} = datos_cliente
        let fin:number=hasta as number
        let listaIP:string[]=[]
        for (let contador:number=desde as number; contador <= fin; contador++){
            let ip:string=ip_parte_1+"."+ip_parte_2+"."+host+"."+contador
            listaIP.push(ip)
        }
        res.type("json")
        res.status(200).json({listaIP})
    },

    validarDisponivilidadIps: async (req:Request,res:Response) => {

    },

    validarDisponivilidadIp: async (modeloIp:ModeloIp):Promise<boolean>=> {
        let result:QueryResult=await modeloIp.consultarPorId()
        return (result.rowCount>0)? true: false
    },

    validarExitenciaIps:async (req:Request,res:Response) => {

    },

    validarExitenciaIp: async (modeloIp:ModeloIp):Promise<boolean>=> {
        let result:QueryResult=await modeloIp.consultarPorIp()
        return (result.rowCount>0)? true: false
    },

    obtenerContratoPorIp: async (req:Request,res:Response) => {

    }

}

export default ControladorIp