import { NextFunction, Request, Response } from "express"
import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
import ModeloIp from "../modelos/modelo_ip"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"

let ControladorIp={

    registrar: async (req:Request,res:Response) => {
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

    actualizarDireccion:async (req:Request,res:Response) => {

    },

    generarIps: async (req:Request,res:Response) => {
        const {ip_parte_1,ip_parte_2,host,desde,hasta} = req.body
        const FIN:number=hasta as number
        let listaIP:string[]=[]
        for (let contador:number=desde as number; contador <= FIN; contador++){
            let ip:string=ip_parte_1+"."+ip_parte_2+"."+host+"."+contador
            listaIP.push(ip)
        }
        res.type("json")
        res.status(200).json({lista_ips:listaIP})
    },

    // validarDisponivilidadIps: async () => {

    // },

    // validarDisponivilidadIp: async (modeloIp:ModeloIp):Promise<boolean>=> {
    //     let result:QueryResult=await modeloIp.consultarPorId()
    //     return (result.rowCount>0)? true: false
    // },

    validarExistenciaIpsEndPointNext:async (req:Request,res:Response,next:NextFunction) => {

    },

    validarExistenciaIpsEndPoint:async (req:Request,res:Response) => {
        const DRIVER_POSTGRESQL:PostgreSql=new PostgreSql()
        const CLIENTE:PoolClient=await DRIVER_POSTGRESQL.conectar()
        let {lista_ips} = req.body
        let LISTA_IP:ModeloIp[]=lista_ips.map((direccion_ip : string) => {
            const MODELO_IP= new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
            MODELO_IP.setIp=direccion_ip
            return MODELO_IP
        })
        let {LISTA_IP_EXISTENTES, LISTA_IP_NO_EXISTENTES, LISTA_IP_2} = await ControladorIp.validarExistenciaIps(LISTA_IP)
        LISTA_IP=LISTA_IP_2
        res.type("json")
        res.status(200).json({
            LISTA_IP_EXISTENTES, 
            LISTA_IP_NO_EXISTENTES
        })
    },

    validarExistenciaIps: async (LISTA_IP:ModeloIp[]):Promise<any> => {
        const LISTA_IP_EXISTENTES:string[]=[]
        const LISTA_IP_NO_EXISTENTES:string[]=[]
        for(let contador:number=0; contador<LISTA_IP.length;contador++){
            const MODELO_IP:ModeloIp=LISTA_IP[contador]
            
            const RESULT:QueryResult=await MODELO_IP.consultarPorIp()
            if(RESULT.rowCount>0){
                MODELO_IP.setIdIp=RESULT.rows[0].id_ip
                MODELO_IP.setDisponibilidadIp=RESULT.rows[0].disponibilidad_ip
                LISTA_IP_EXISTENTES.push(MODELO_IP.getIp)
            }
            else{
                LISTA_IP_NO_EXISTENTES.push(MODELO_IP.getIp)
            }
            console.log(MODELO_IP)
            console.log(LISTA_IP[contador])
        }
        return {
            LISTA_IP_EXISTENTES, 
            LISTA_IP_NO_EXISTENTES, 
            LISTA_IP_2:LISTA_IP
        }
    },

    validarExistenciaIp: async (modeloIp:ModeloIp):Promise<boolean> => {
        let result:QueryResult=await modeloIp.consultarPorIp()
        return (result.rowCount>0)? true: false
    },

    obtenerContratoPorIp: async function(req:Request,res:Response){

    }

}

export default ControladorIp