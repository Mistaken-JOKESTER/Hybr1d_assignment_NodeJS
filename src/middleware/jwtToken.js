const jwt = require('jsonwebtoken')
const DB_QUERY_SYNC = require('../database/query')

const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET )
}

const token_exesist = async (my_token, user_id, type) => {
    const token_query = await DB_QUERY_SYNC(`Select token from jwt_tokens where user_id = ? and type = ?`, [Number(user_id), type == 'buyer'?1:2])
    if(token_query.error){
        return {
            error:true,
            message: "Failed to validate token"
        }
    } else {
        for (let i = 0; i < token_query.data.length; i++) {
            const token = token_query.data[i].token;
            if(token == my_token){
                return {
                    invalid:false
                }
            }
        }

        return {
            invalid:true
        }
    }
}

module.exports = {generateToken, token_exesist}