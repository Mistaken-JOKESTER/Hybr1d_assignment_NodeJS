const jwt = require('jsonwebtoken')
const { token_exesist } = require('./jwtToken')

const auth = (req_type) => {
    return async (req, res, next) => {
        try{
            const token = await req.header('Authorization').replace('Bearer ', '')
            if(!token){
                console.log(1)
                return res.status(401).send({
                    message: "invalid token."
                })
            }

            //decoding token and checking if payload is present
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const {user_id, type} = decoded
            
            if(!user_id || isNaN(Number(user_id)) || !type || !(['buyer', 'seller'].includes(type)) || type !== req_type){
                console.log(2)
                return res.status(401).send({
                    message: "invalid token."
                })
            }
            
            //vrefying with db if token belong to user
            let exesist = await token_exesist(token, user_id, type)
            if(exesist.error){
                return res.status(500).send({
                    message: await exesist.message
                })
            }

            if(exesist.invalid){
                console.log(3)
                return res.status(401).send({
                    message: "invalid token."
                })
            }

            req.user_type = type
            req.user_id = Number(user_id)
        
            next()
        } catch(error){
            console.log(error)
            res.status(401).send({error: 'invalid token.'})
        }
    }
}

module.exports = auth