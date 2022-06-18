import app from "./app"

let Server=app.listen(app.get("puerto"),() => {
    console.log("ejecutando app en el puerto "+app.get("puerto"))
})