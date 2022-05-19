require('dotenv').config()
const express = require('express')
const masterRouter = require('./routers/masterRouter')

const app = express()
const port = process.env.API_PORT

app.use(express.json())

app.use('/api', masterRouter)

app.get('*', (req, res) => {
    try{
        res.status(404).send({
            message:"Endpoint not found!"
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            error:true,
            message:"Internal server error"
        })
    }
})

app.listen(port, () => {
    console.log('server is up on port ' + port)
})