const CustomError = require("../utils/class-custom-error");


exports.pathErrorHandler = (req, res) => {
        res.status(404).send({msg: "Path Not Found :("});
}

exports.customErrorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        console.error(err.msg);
        res.status(err.status).send(err.details)
    } else {
        next(err)
    }

}
exports.unhandledErrorHandler = (err, req, res, next) => {
    console.error(err, "<------ unhandled Error");
    res.status(500).send({error: err});
}