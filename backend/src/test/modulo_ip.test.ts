import {servidor} from "../index"
import {api,helperModuloIp} from "./helpers/modulo_ip"
import { Response } from "supertest"


beforeEach(async () => {
    let cerrarConexion=await helperModuloIp.precargarDatos()
    await cerrarConexion()
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
        expect(respuestaApi.body.lista_ips.length).toBe(helperModuloIp.datos.length)
    })

    test("generar ips sin enviar datos tiene que arrojar un error 400",async () => {
        let respuestaApi:Response=await api.post("/configuracion/ip/generar-ip")
        .send()
        .expect(400)
        expect(respuestaApi.body.codigo_respuesta).toBe("400")
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
        expect(respuestaApi.body.codigo_respuesta).toBe("400")
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
        expect(respuestaApi.body.codigo_respuesta).toBe("200")
    })

    test("validar existencia ips pasando en ves de un array un string vacio",async () => {
        const respuestaApi:Response=await api.post("/configuracion/ip/validar-exitencia-ips")
        .send({lista_ips:""})
        .expect(400)
        expect(respuestaApi.body.codigo_respuesta).toBe("400")
    })

    test("validar existencia ips sin pasar la propiedad ",async () => {
        const respuestaApi:Response=await api.post("/configuracion/ip/validar-exitencia-ips")
        .expect(400)
        expect(respuestaApi.body.codigo_respuesta).toBe("400")
    })
    // =======
    // =======
    // =======
    test("registrar ip",async () => {
        const ipTest=helperModuloIp.ipTestRegistro
        const respuestaApi:Response=await api.post("/configuracion/ip/registrar")
        .send({lista_ips:[ipTest.ip]})
        .expect(200)
        expect(respuestaApi.body.codigo_respuesta).toBe("200")
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
        expect(ipRespuesta.id_ip).toEqual(ipTest.id_ip)
    })

    test("consultar una ip por el id el recuros no fue encontrado",async () => {
        const ipTest=helperModuloIp.datos[0]
        const respuestaApi:Response= await api.get("/configuracion/ip/consultar/666")
        .expect(400)
        const ipRespuesta=respuestaApi.body
        expect(ipRespuesta.codigo_respuesta).toBe("400")
    })
    // =======
    // =======
    // =======
    test("consultar todo tiene que devolver 5",async () => {
        // helperModuloIp.datos
        const respuestaApi:Response= await api.get("/configuracion/ip/consultar-todos")
        .expect(200)
        const ipRespuesta=respuestaApi.body
        expect("200").toBe(ipRespuesta.codigo_respuesta)
        expect(ipRespuesta.datos_respuesta.length).toBe(helperModuloIp.datos.length)
    })
    // =======
    // =======
    // =======
    test("actualizar registo tiene que actualizar el registro con id 1",async () => {
        let ipTest=helperModuloIp.datos[0]
        ipTest.ip="192.168.1.11"
        const respuestaApi:Response= await api.put("/configuracion/ip/actualizar-direccion/"+ipTest.id_ip)
        .send({ip:ipTest.ip})
        .expect(200)
        const ipRespuesta=respuestaApi.body
        expect(ipRespuesta.codigo_respuesta).toBe("200")
    })

    test("actualizar un registo que no existe 666",async () => {
        let idIpNoexiste:string="666"
        let ip="192.168.1.666"
        const respuestaApi:Response= await api.put("/configuracion/ip/actualizar-direccion/"+idIpNoexiste)
        .send({ip:ip})
        .expect(404)
        const ipRespuesta=respuestaApi.body
        expect(ipRespuesta.codigo_respuesta).toBe("404")
    })

    test("actualizar registo tiene que actualizar el registro con id 1 pero sin pasr una ip",async () => {
        let ipTest=helperModuloIp.datos[0]
        ipTest.ip=""
        const respuestaApi:Response= await api.put("/configuracion/ip/actualizar-direccion/"+ipTest.id_ip)
        .send({ip:ipTest.ip})
        .expect(400)
        const ipRespuesta=respuestaApi.body
        console.log(ipRespuesta)
        expect(ipRespuesta.codigo_respuesta).toBe("400")
    })

})

afterAll(() => {
    servidor.close()
})