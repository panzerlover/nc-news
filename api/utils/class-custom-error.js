/**
 * @status number, html status code of the rror
 * @logMessage string, message for the Error to send
 * @body object, any other information to include with the error
 */

class CustomError {
    status;
    msg;
    details;
    constructor(status = 500, msg = "An Unspecified Error Occurred", details = {}){
        this.status = status;
        this.msg = msg;
        this.details = details;
    }
}

module.exports = CustomError;