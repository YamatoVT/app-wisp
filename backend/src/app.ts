import express from "express"
import cors from "cors"
import logger from "morgan"
import dotEnv from "dotenv"
dotEnv.config()

let app=express()
const puerto = process.env.PORT || 5000
// set
app.set("puerto",puerto)
// middleware
app.use(cors())
app.use(logger("dev"))
app.use(express.static(__dirname+"/upload"))
// rutas 
import RouterIp from "./rutas/ip/index"

app.use("/configuracion/ip",RouterIp)
// export
export = app