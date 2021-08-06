const express = require("express")
const port = 3001
const bodyParser = require("body-parser")
const indexRouter = require("./routes/index")
const userRouter = require("./routes/user")

const app = express()
app.use(bodyParser.json())
app.set("views", __dirname + "/views")

app.set("view engine", "pug")

app.use("/", indexRouter)
app.use("/users", userRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
