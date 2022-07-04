const CustomError = require("../utils/class-custom-error");


exports.pathErrorHandler = (req, res) => {
        res.status(404).send({msg: "Path Not Found :("});
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        console.log(err.logMessage);
        res.status(err.status).send(err.body)
    } else {
        next(err)
    }

}
exports.unhandledErrorHandler = (err, req, res, next) => {
    console.log(err, "<------ unhandled Error");
    res.status(500).send({error: err});
}