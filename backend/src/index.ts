
import app from "./app"

let servidor=app.listen(app.get("puerto"),() => {
    console.log("ejecutando app en el puerto "+app.get("puerto"))
})

export {
    app,
    servidor
}