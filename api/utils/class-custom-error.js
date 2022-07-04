/**
 * @status number, html status code of the rror
 * @msg string, message for the Error to send
 * @code psql error code
 * @add_details object, any other information to include with the error
 */

const ERR_MSGS = require("./enum-errors");

class CustomError {
    status;
    msg;
    details;
    code;
    pgDetails;
    constructor(status = 500, msg = "An Unspecified Error Occurred", {code}, add_details = {}, ){
        this.status = status;
        this.msg = msg;
        this.code = code;
        this.add_details = add_details;
        this.pgDetails = (!code) ? {msg: "no pg code detected"} : 
            (ERR_MSGS.PG[code]) ? ERR_MSGS.PG[code] : ERR_MSGS.PG.DEFAULT(code); 
            
        }
    }

module.exports = CustomError;