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
    tip;
    constructor(status = 500, msg = "An Unspecified Error Occurred", tip = "Did you try turning it off and on again?", {code}){
        this.status = status;
        this.msg = (!code) ? msg : 
            (ERR_MSGS.PG[code]) ? ERR_MSGS.PG[code].msg : ERR_MSGS.PG.DEFAULT.msg;
        this.tip = (!code) ? tip : 
            (ERR_MSGS.PG[code]) ? ERR_MSGS.PG[code].tip : ERR_MSGS.PG.DEFAULT.tip;    
        }
    }

module.exports = CustomError;