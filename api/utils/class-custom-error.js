/**
 * @status number, html status code of the rror
 * @msg string, message for the Error to send
 * @tip string, tip for how to fix the problem
 * @code will destructure from the error sent to it
 */

const ERR_MSGS = require("./enum-errors");

class CustomError {
    status;
    msg;
    tip;
    constructor(status = 500, msg = "An Unspecified Error Occurred", tip = "Did you try turning it off and on again?", {code}){

        if (!code){
            this.status = status;
            this.msg = msg;
            this.tip = tip;
        } else {
            let pgError = (ERR_MSGS.PG[code]) ? ERR_MSGS.PG[code] : ERR_MSGS.PG.DEFAULT;
            this.status = pgError.status;
            this.msg = pgError.msg;
            this.tip = pgError.tip;
        }
        }
    }

module.exports = CustomError;