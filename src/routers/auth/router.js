const DB_QUERY_SYNC = require('../../database/query')
const { validate_login_data, validate_register_data } = require('./helperFunction')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../../middleware/jwtToken')
const router = require('express').Router()


router.post('/register', async (req, res) => {
    try{
        //type: 'buyer'
        //type: 'seller'
        const { username, password, type } = req.body

        //validating user data
        const data_validation = validate_register_data(username, password, type)
        if(data_validation.invalid_missing_fields){
            return res.status(422).send({
                message: "data validation failed",
                missing_fields: data_validation.missing_fields,
                invalid_fields: data_validation.invalid_fields
            })
        }

        const bcrypt_password = await bcrypt.hash(password, 8)
        let query = `Call add_new_${type.toLowerCase()}(?,?);`

        //adding user to db
        const query_result = await DB_QUERY_SYNC(query, [username,  bcrypt_password])
        if(query_result.error){
            return res.status(500).send({
                message: "Due to some internal issue failed to register user, please try agin."
            })
        }

        if(query_result.data[0][0].status == 0){
            return res.status(422).send({
                message: `${type} with give user name areadly exesist.`
            })
        }

        res.send({
            message: "Congratulations! you are registred successfully."
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            error:true,
            message:"Internal server error"
        })
    }
})

router.post('/login', async (req, res) => {
    try{
        //type: 'buyer'
        //type: 'seller'
        const { username, password, type } = req.body

        //validating user data
        const data_validation = validate_login_data(username, password, type)
        if(data_validation.invalid_missing_fields){
            return res.status(422).send({
                message: "data validation failed",
                missing_fields: data_validation.missing_fields,
                invalid_fields: data_validation.invalid_fields
            })
        }

        if(data_validation.invalid){
            return res.status(404).send({
                message: "username or password is invalid."
            })
        }

        let query = `Call login_${type.toLowerCase()}(?);`

        //loging in user to db
        const query_result = await DB_QUERY_SYNC(query, [username])
        if(query_result.error){
            return res.status(500).send({
                message: "Due to some internal issue failed to validate user, please try agin."
            })
        }

        if(query_result.data[0][0].status == 0 || !(await bcrypt.compare(password, query_result.data[1][0].password))){
            return res.status(422).send({
                message: `username or password is invalid.`
            })
        }

        //genrating and storing jwt token
        const token = generateToken({user_id: query_result.data[1][0].id, type})
        const add_token_query = await DB_QUERY_SYNC(`Insert into jwt_tokens(user_id, type, token) values (?,?,?);`, [query_result.data[1][0].id, type.toLowerCase() == 'buyer'?1:2, token])
        if(add_token_query.error){
            return res.status(500).send({
                message: "Due to some internal issue failed to store auth token, please try agin."
            })
        }

        res.send({
            message: `Welcome ${query_result.data[1][0].username}`,
            auth_token: token
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            error:true,
            message:"Internal server error"
        })
    }
})

module.exports = router