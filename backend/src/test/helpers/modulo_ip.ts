import {app} from "../../index"
import supertest, { Response } from "supertest"
// 
import PostgresSql from "../../driver_db/postgresql"
import { PoolClient } from "pg"
import ModeloIp from "../../modelos/modelo_ip"
import interfaz_modelo_ip from "../../interfaz/modelo/interfaz_modelo_ip"

let api = supertest(app)

let datosIps:interfaz_modelo_ip[]=[
    {
        id_ip:1,
        ip:"192.168.1.1",
        disponibilidad_ip:"1"
    },
    {
        id_ip:2,
        ip:"192.168.1.2",
        disponibilidad_ip:"1"
    },
    {
        id_ip:3,
        ip:"192.168.1.3",
        disponibilidad_ip:"1"
    },
    {
        id_ip:4,
        ip:"192.168.1.4",
        disponibilidad_ip:"1"
    },
    {
        id_ip:5,
        ip:"192.168.1.5",
        disponibilidad_ip:"1"
    }
]

let ipTestRegistro:interfaz_modelo_ip={
    id_ip:6,
    ip:"192.168.1.6",
    disponibilidad_ip:"1"
}


let helperModuloIp={
    datos:datosIps,
    ipTestRegistro,

    obtenerSoloIps:():string[] => {
        return helperModuloIp.datos.map(ip => ip.ip)
    },

    consultarTodos:async ():Promise<string> => {
        const respuestaApi:Response=await api.get("/configuracion/ip/consultar-todos")
        return respuestaApi.body.datos_respuesta
    },

    consultar:async (id:string):Promise<string> => {
        const respuestaApi:Response=await api.get("/configuracion/ip/consultar/"+id)
        return respuestaApi.body.datos_respuesta
    },

    precargarDatos:async () => {
        const DRIVER_POSTGRESQL:PostgresSql=new PostgresSql()
        const CLIENTE:PoolClient=await DRIVER_POSTGRESQL.conectar()
        await helperModuloIp.resetiarTabla(DRIVER_POSTGRESQL,CLIENTE)
        let lista_ip:ModeloIp[]=helperModuloIp.datos.map((datosIp:interfaz_modelo_ip):ModeloIp => {
            let ip:ModeloIp= new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
            ip.setDatos=datosIp
            return ip
        })
        for (const ip of lista_ip) {
            await ip.registrar()
        }
        return async () =>{
            await DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
        }
    },

    resetiarTabla:async (DRIVER_POSTGRESQL:PostgresSql,CLIENTE:PoolClient) =>{
        let modeloIp:ModeloIp= new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
        await modeloIp.EliminarDatos()
        await modeloIp.resetiarIdTabla()
    }

}

export {
    api,
    helperModuloIp
}