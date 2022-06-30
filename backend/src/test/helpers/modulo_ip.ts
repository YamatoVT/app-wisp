import {app} from "../../index"
import supertest from "supertest"
// 
import interfaz_modelo_ip from "../../interfaz/modelo/interfaz_modelo_ip"

let appTest = supertest(app)

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


let helperModuloIp:Object={
    datos:datosIps
}

export {
    appTest,
    helperModuloIp
}