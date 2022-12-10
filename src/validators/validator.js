function isValidUserName(userName){
    if(typeof userName!="string"){
        return false
    }
    if(!/^[a-zA-Z ]{2,30}$/.test(userName)){
        return false
    }
    return true
}


function isValidPassword(password){
    if(typeof password!="string"){
        return false
    }
    if(!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%@&? "])[a-zA-Z0-9!#$@%&?]{8,}$/.test(password) ){
        return false
    }
    return true
}

module.exports={isValidUserName,isValidPassword}