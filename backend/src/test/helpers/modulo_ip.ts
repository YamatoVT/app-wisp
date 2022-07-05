import {app} from "../../index"
import supertest, { Response } from "supertest"
// 
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
        const respuestaApi:Response=await api.post("/configuracion/ip/registrar")
        .send({lista_ips:helperModuloIp.obtenerSoloIps()})
        return respuestaApi.body
    }
}

export {
    api,
    helperModuloIp
}