import { Router } from "express";
import express from "express";
// controladores
import ControladorIp from "../../controladores/controlador_ip"

let router = Router()

router.post("/generar-ip",ControladorIp.generarIps)
router.post("/validar-exitencia-ips",ControladorIp.validarExistenciaIpsEndPoint)
router.post("/registrar",ControladorIp.validarExistenciaIpsEndPointNext,ControladorIp.registrar)
router.get("/consultar/:id",ControladorIp.consultarEndPoint)
router.get("/consultar-todos",ControladorIp.consultarTodosEndPoint)
// router.put("/actualizar/:id",ControladorIp.actualizarDireccion)

export default router