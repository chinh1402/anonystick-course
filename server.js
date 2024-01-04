// Setup Port, don't touch this file

const app = require("./src/app")
const PORT = 3055
const server = app.listen(PORT , () => {
    console.log("WSV eCom start with port:", PORT)
})
// process.on("SIGINT", () => {
//     server.close(() => console.log("Exit Server Express"))
//     // notify.ping(...)
// })