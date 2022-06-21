import { Router } from "express";
import express from "express";
// controladores
import ControladorIp from "../../controladores/controlador_ip"

let router = Router()

router.post("/generar-ip",ControladorIp.generarIps)


export default router