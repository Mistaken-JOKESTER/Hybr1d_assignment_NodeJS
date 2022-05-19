const validate_register_data = (username, password, type) => {
    const missing_fields = []
    const invalid_fields = []

    if(!username || username.trim() == ""){
        missing_fields.push('username')
    } else if(typeof username !== "string" || username.length >= 60 || !/^[A-Za-z0-9_]*$/.test(username)){
        invalid_fields.push({field: 'username', message: 'username must be string of length less than 60 characters and can include alphabets, number, "_".'})
    }

    if(!password || password.trim() == ""){
        missing_fields.push('password')
    } else if(typeof password !== "string"){
        invalid_fields.push({field: 'password', message: "password must be of type string."})
    } else if(!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password)){
        invalid_fields.push({field: 'password', message: "password must have atleast 8 character including 1 upper case, 1 special charcter(!@#$&*) and 1 numeric character."})
    }

    if(!type|| type.trim() == ""){
        missing_fields.push('type')
    } else if(typeof password !== "string" || !['buyer','seller'].includes(type.toLowerCase())){
        invalid_fields.push({field: 'type', message: "type must be string and have one of two values (buyer,seller)."})
    }

    if(missing_fields.length || invalid_fields.length){
        return {
            invalid_missing_fields: true,
            missing_fields,
            invalid_fields
        }
    } else {
        return {
            invalid_missing_fields:false
        }
    }
}

const validate_login_data = (username, password, type) => {
    const missing_fields = []
    invalid_fields = []
    const invalid_login = false

    if(!username || username.trim() == ""){
        missing_fields.push('username')
    } else if(typeof username !== "string" || username.length >= 60){
        invalid_login = true
    }

    if(!password || password.trim() == ""){
        missing_fields.push('password')
    } else if(typeof username !== "string" || username.length >= 60 || !/^[A-Za-z0-9_]*$/.test(username)){
        invalid_login = true
    }

    if(!type){
        missing_fields.push('type')
    } else if(typeof password !== "string" || !['buyer','seller'].includes(type.toLowerCase())){
        invalid_fields.push({field: 'type', message: "type must be string and have one of two values (buyer,seller)."})
    }

    if(missing_fields.length || invalid_fields.length){
        return {
            invalid_missing_fields: true,
            missing_fields,
            invalid_fields
        }
    } else {
        return {
            invalid_missing_fields:false,
            invalid_login
        }
    }
}

module.exports = {validate_register_data, validate_login_data}