import {servidor} from "../index"
import {api,helperModuloIp} from "./helpers/modulo_ip"
import PostgresSql from "../driver_db/postgresql"
import { PoolClient } from "pg"
import ModeloIp from "../modelos/modelo_ip"
import { Response } from "supertest"


beforeEach(async () => {
    const DRIVER_POSTGRESQL:PostgresSql=new PostgresSql()
    const CLIENTE:PoolClient=await DRIVER_POSTGRESQL.conectar()
    const modeloIp:ModeloIp = new ModeloIp(DRIVER_POSTGRESQL,CLIENTE)
    await modeloIp.EliminarDatos()
    await modeloIp.resetiarIdTabla()
    DRIVER_POSTGRESQL.cerrarConexion(CLIENTE)
    await helperModuloIp.precargarDatos()
})

describe("pruebas End Point del modulo IP",() => {

    test("generar ips y devolvera 5 ip",async () => {
        let datosGenerar={
            "ip_parte_1":192,
            "ip_parte_2":168,
            "host":1,
            "desde":1,
            "hasta":helperModuloIp.datos.length
        }
        let respuestaApi:Response=await api.post("/configuracion/ip/generar-ip")
        .send(datosGenerar)
        .expect(200)
        expect(helperModuloIp.datos.length).toBe(respuestaApi.body.lista_ips.length)
    })

    test("generar ips sin enviar datos tiene que arrojar un error 400",async () => {
        let respuestaApi:Response=await api.post("/configuracion/ip/generar-ip")
        .send()
        .expect(400)
        expect("400").toBe(respuestaApi.body.codigo_respuesta)
    })

    test("generar ips pero pasando texto tiene que arrojar un error 400",async () => {
        let datosGenerar={
            "ip_parte_1":"192 ",
            "ip_parte_2":"168" ,
            "host":"1 ",
            "desde":"1 ",
            "hasta":helperModuloIp.datos.length
        }
        let respuestaApi:Response=await api.post("/configuracion/ip/generar-ip")
        .send(datosGenerar)
        .expect(400)
        expect("400").toBe(respuestaApi.body.codigo_respuesta)
    })
    // =======
    // =======
    // =======
    // agregar test de validar formato de ip
    test("validar existencia ips ",async () => {
        const LISTA_IPS:string[]=helperModuloIp.obtenerSoloIps()
        const respuestaApi:Response=await api.post("/configuracion/ip/validar-exitencia-ips")
        .send({lista_ips:[]})
        .expect(200)
        expect("200").toBe(respuestaApi.body.codigo_respuesta)
    })

    test("validar existencia ips pasando en ves de un array un string vacio",async () => {
        const respuestaApi:Response=await api.post("/configuracion/ip/validar-exitencia-ips")
        .send({lista_ips:""})
        .expect(400)
        expect("400").toBe(respuestaApi.body.codigo_respuesta)
    })

    test("validar existencia ips sin pasar la propiedad ",async () => {
        const respuestaApi:Response=await api.post("/configuracion/ip/validar-exitencia-ips")
        .expect(400)
        expect("400").toBe(respuestaApi.body.codigo_respuesta)
    })
    // =======
    // =======
    // =======
    test("registrar ip",async () => {
        const ipTest=helperModuloIp.ipTestRegistro
        const respuestaApi:Response=await api.post("/configuracion/ip/registrar")
        .send({lista_ips:[ipTest.ip]})
        .expect(200)
    })
    test("registrar ip sin enviar datos",async () => {
        const respuestaApi:Response=await api.post("/configuracion/ip/registrar")
        .expect(400)
        expect(respuestaApi.body.codigo_respuesta).toBe("400")
    })
    test("registrar ip enviando un string",async () => {
        const ipTest=helperModuloIp.ipTestRegistro
        const respuestaApi:Response=await api.post("/configuracion/ip/registrar")
        .send({lista_ips:""})
        .expect(400)
        expect(respuestaApi.body.codigo_respuesta).toBe("400")
    })
    // =======
    // =======
    // =======
    test("consultar una ip por el id",async () => {
        const ipTest=helperModuloIp.datos[0]
        const respuestaApi:Response= await api.get("/configuracion/ip/consultar/"+ipTest.id_ip)
        .expect(200)
        const ipRespuesta=respuestaApi.body.datos_respuesta
        expect("200").toBe(respuestaApi.body.codigo_respuesta)
        expect(ipTest.id_ip).toEqual(ipRespuesta.id_ip)
    })

    test("consultar una ip por el id el recuros no fue encontrado",async () => {
        const ipTest=helperModuloIp.datos[0]
        const respuestaApi:Response= await api.get("/configuracion/ip/consultar/666")
        .expect(400)
        const ipRespuesta=respuestaApi.body
        expect("400").toBe(ipRespuesta.codigo_respuesta)
    })

})

afterAll(() => {
    servidor.close()
})