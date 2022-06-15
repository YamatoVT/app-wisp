import app from "./app"

console.log(app.get("puerto"))

let Server=app.listen(app.get("puerto"),() => {
    console.log("ejecutando app en el puerto "+app.get("puerto"))
})