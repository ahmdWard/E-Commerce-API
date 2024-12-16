
const dotenv =require('dotenv')
const app = require('./app')

dotenv.config()

const port = process.env.PORT || 3000;

app.use ('/',(req,res)=>{
    res.send("Hello from server side")
})
app.listen(port,()=>{
    console.log(`server is running at port ${port} 🚀🚀`)
})
