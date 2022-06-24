import { NextFunction, Request, Response } from "express"
import { PoolClient, QueryResult } from "pg"
import PostgreSql from "../driver_db/postgresql"
import ModeloIp from "../modelos/modelo_ip"
//  interfaz
import interfaz_modelo_ip from "../interfaz/modelo/interfaz_modelo_ip"
import interfaz_respuesta_servidor from "../interfaz/interfaz_respuesta_servidor"

let ControladorIp={

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

    registrar: async (req:Request,res:Response) => {
        let estidoRegistro:boolean=true
        const ERROR:boolean=false
        const OK:boolean=true
        let {lista_ips,DRIVER_POSTGRESQL,CLIENTE} = req.body
        for (const MODELO_IP of lista_ips) {
            let resul:QueryResult=await MODELO_IP.registrar()
            if(resul.rowCount==1){
                estidoRegistro=true
            }
            else{
                estidoRegistro=false
                break
            }
        }
        await DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
        if(estidoRegistro===OK){
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"200",
                tipo_mensaje:"success",
                mensaje_respuesta:"registro completado"
            }
            res.type("json")
            res.status(200).json(respuesta)
        }
        if(estidoRegistro===ERROR){
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"500",
                tipo_mensaje:"danger",
                mensaje_respuesta:"sucedio un error consulte a sistema"
            }
            res.type("json")
            res.status(500).json(respuesta)
        }
    },

    consultarEndPointNext: async (req:Request,res:Response,next:NextFunction) => {
        const {id} = req.params
        const DRIVER_POSTGRESQL:PostgreSql=new PostgreSql()
        const CLIENTE:PoolClient=await DRIVER_POSTGRESQL.conectar()
        let ip:ModeloIp[]=await ControladorIp.consultar(id,DRIVER_POSTGRESQL,CLIENTE)
        if(ip.length>0){
            req.body["DRIVER_POSTGRESQL"]=DRIVER_POSTGRESQL
            req.body["CLIENTE"]=CLIENTE
            next()
        }
        else{
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"404",
                tipo_mensaje:"danger",
                mensaje_respuesta:"la ip no esta registrar en la base de datos",
            }
            res.type("json")
            res.status(200).json(respuesta)
        }
    },

    consultarEndPoint: async (req:Request,res:Response) => {
        const {id} = req.params
        const DRIVER_POSTGRESQL:PostgreSql=new PostgreSql()
        const CLIENTE:PoolClient=await DRIVER_POSTGRESQL.conectar()
        let ip:ModeloIp[]=await ControladorIp.consultar(id,DRIVER_POSTGRESQL,CLIENTE)
        await DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
        if(ip.length>0){
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"200",
                tipo_mensaje:"success",
                mensaje_respuesta:"consulta completada",
                datos_respuesta:ip[0].getDatos
            }
            res.type("json")
            res.status(200).json(respuesta)
        }
        else{
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"200",
                tipo_mensaje:"danger",
                mensaje_respuesta:"la ip no esta registrar en la base de datos",
            }
            res.type("json")
            res.status(200).json(respuesta)
        }
    },

    consultar: async (id:string,DRIVER_POSTGRESQL:PostgreSql,CLIENTE:PoolClient) => {
        let datos:ModeloIp[]=[]
        let modeloIp:ModeloIp=new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
        modeloIp.setIdIp=(id as unknown) as number
        let result:QueryResult=await modeloIp.consultarPorId()
        if(result.rowCount>0){
            for (const row of result.rows) {
                let datos_ip:interfaz_modelo_ip={
                    id_ip:row.id_ip,
                    ip:row.ip,
                    disponibilidad_ip:row.disponibilidad_ip
                }
                const MODELO_IP:ModeloIp=new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
                MODELO_IP.setDatos=datos_ip
                datos.push(MODELO_IP)
                
            }
        }
        return datos
    },

    consultarTodosEndPoint: async (req:Request,res:Response) => {
        const DRIVER_POSTGRESQL:PostgreSql=new PostgreSql()
        const CLIENTE:PoolClient=await DRIVER_POSTGRESQL.conectar()
        let lista_ips:ModeloIp[]=await ControladorIp.consultarTodos(DRIVER_POSTGRESQL,CLIENTE)
        await DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
        if(lista_ips.length>0){
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"200",
                tipo_mensaje:"success",
                mensaje_respuesta:"consulta completada",
                datos_respuesta:lista_ips.map(ip => ip.getDatos)
            }
            res.type("json")
            res.status(200).json(respuesta)
        }
        else{
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"200",
                tipo_mensaje:"danger",
                mensaje_respuesta:"no hay ips registras en la base de datos",
            }
            res.type("json")
            res.status(200).json(respuesta)
        }
    },

    consultarTodos: async (DRIVER_POSTGRESQL:PostgreSql,CLIENTE:PoolClient) => {
        let datos:ModeloIp[]=[]
        let modeloIp:ModeloIp=new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
        let result:QueryResult=await modeloIp.consultarTodo()
        if(result.rowCount>0){
            for (const row of result.rows) {
                let datos_ip:interfaz_modelo_ip={
                    id_ip:row.id_ip,
                    ip:row.ip,
                    disponibilidad_ip:row.disponibilidad_ip
                }
                const MODELO_IP:ModeloIp=new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
                MODELO_IP.setDatos=datos_ip
                datos.push(MODELO_IP)
            }
        }
        return datos
    },

    actualizarDireccion:async (req:Request,res:Response) => {
        const {id} = req.params
        const {ip,DRIVER_POSTGRESQL,CLIENTE} = req.body
        const MODELO_IP:ModeloIp=new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
        MODELO_IP.setIdIp=(id as unknown) as number
        MODELO_IP.setIp=ip
        let result:QueryResult=await MODELO_IP.actualizarDireccion()
        await DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
        if(result.rowCount>0){
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"200",
                tipo_mensaje:"success",
                mensaje_respuesta:"actualizacion completada"
            }
            res.type("json")
            res.status(200).json(respuesta)
        }
        else{
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"200",
                tipo_mensaje:"danger",
                mensaje_respuesta:"error al actualizar la direccion ip",
            }
            res.type("json")
            res.status(200).json(respuesta)
        }
    },

    validarExistenciaIpsEndPointNext:async (req:Request,res:Response,next:NextFunction) => {
        const DRIVER_POSTGRESQL:PostgreSql=new PostgreSql()
        const CLIENTE:PoolClient=await DRIVER_POSTGRESQL.conectar()
        let {lista_ips} = req.body
        let LISTA_IP:ModeloIp[]=lista_ips.map((direccion_ip : string) => {
            const MODELO_IP= new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
            MODELO_IP.setIp=direccion_ip
            return MODELO_IP
        })
        let {LISTA_IP_EXISTENTES, LISTA_IP_NO_EXISTENTES, LISTA_IP_2}  = await ControladorIp.validarExistenciaIps(LISTA_IP)
        // await DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
        const CANTIDAD_PERMITIDA:number = 0
        if(LISTA_IP_EXISTENTES.length==CANTIDAD_PERMITIDA){
            req.body.lista_ips=LISTA_IP_2
            req.body["DRIVER_POSTGRESQL"]=DRIVER_POSTGRESQL
            req.body["CLIENTE"]=CLIENTE
            next()
        }
        else{
            res.type("json")
            let respuesta:interfaz_respuesta_servidor={
                codigo_respuesta:"200",
                tipo_mensaje:"warning",
                mensaje_respuesta:"no se pudo procesar su solicitud de registro por el siguiente motivo, no se pueden volver a registrar ips que ya estan registrar",
                datos_respuesta:{
                    lista_ip_existentes:LISTA_IP_EXISTENTES,
                }
            }
            res.status(200).json(respuesta)
        }

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
        await DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
        LISTA_IP=LISTA_IP_2
        res.type("json")
        let respuesta:interfaz_respuesta_servidor={
            codigo_respuesta:"200",
            tipo_mensaje:"success",
            mensaje_respuesta:"soliciudad porcesada con exito",
            datos_respuesta:{
                lista_ip_existentes:LISTA_IP_EXISTENTES,
                lista_ip_no_existentes:LISTA_IP_NO_EXISTENTES,
                total_ip_existente:LISTA_IP_EXISTENTES.length,
                total_ip_no_existente:LISTA_IP_NO_EXISTENTES.length
            }
        }
        res.status(200).json(respuesta)
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

        // validarDisponivilidadIps: async () => {

    // },

    // validarDisponivilidadIp: async (modeloIp:ModeloIp):Promise<boolean>=> {
    //     let result:QueryResult=await modeloIp.consultarPorId()
    //     return (result.rowCount>0)? true: false
    // },

}

export default ControladorIp