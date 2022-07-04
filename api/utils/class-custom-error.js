/**
 * @status number, html status code of the rror
 * @logMessage string, message for the Error to send
 * @body object, any other information to include with the error
 */

class CustomError {
    status;
    logMessage;
    body;
    constructor(status = 500, logMessage = "An Error Occurred", body = {}){
        this.status = status;
        this.logMessage = logMessage;
        this.body = body;
    }
}

module.exports = CustomError;