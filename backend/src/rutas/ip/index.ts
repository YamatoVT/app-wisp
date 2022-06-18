import { Router } from "express";
// controladores
import ControladorIp from "../../controladores/controlador_ip"

let router = Router()

router.get("/test",ControladorIp.test)

export default router