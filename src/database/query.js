const pool = require('./pool')


const DB_QUERY_SYNC = (query, data) => {
    return new Promise(async (resolve, reject) => {
        await pool.getConnection((err, connection) => {
            //checking if any errors
            if(err){
                console.log(err)
                return resolve({error: true})
            }

            connection.query(query, data, function (error, results, fields) {
                //checking if any error
                if (error) {
                        connection.release()
                        console.log("Error in DB Query >>>>>>>>>>>>>>>>>", error)
                        return resolve({error:true})
                }
                //disconnecting form database and send success respose
                connection.release()
                resolve({error:false, data: results})
                
            })
        })
    })
}

module.exports = DB_QUERY_SYNC