import express from "express"
import path from "path"
import cors from "cors"
import logger from "morgan"
import dotEnv from "dotenv"
dotEnv.config({ path: path.resolve(__dirname, '../.env') })
// import rutas 
import RouterIp from "./rutas/ip/index"

const {PORT} = process.env 

let app=express()
const puerto = PORT || 5000

// set
app.set("puerto",puerto)
// middleware
app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../public')))

// rutas
app.use("/configuracion/ip",RouterIp)

// export
export = app