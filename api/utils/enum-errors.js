const ERR_MSGS = {
    DEFAULT: "Something went Wrong :(",
    DOES_NOT_EXIST:  {
        msg: `Resource does not exist!`,
        tip: `Please check the docs and try again`,
        status: 404
        },
    INVALID_QUERY: {
        msg: "Bad Request",
        tip: "Something in your params/body isn't quite right. It's possible something is missing, or incorrect.",
        status: 400,
    },
    PG: {
        DEFAULT: {
            msg: "Unspecified Server Error",
            tip: "Contact the website admin",
            status: 500,
        },
        "42P01": {
            msg: "Unable to access resource",
            tip: "The server may be down. Please contact the website admin",
            status: 500
        },
        "22P02": {
            msg: "Invalid Data type",
            tip: "check the data type(s) of your parameter/body",
            status: 400,
        },
        "23502":{
            msg: "Missing Value",
            tip: "Something critical was missing from your request. Please check your parameters/body and the documentation before trying again",
            status: 400,
        },
        "23503": {
            msg: "Bad Request",
            tip: "Something in your params/body isn't quite right. It's possible something is missing, or incorrect.",
            status: 400,
          },
    },
}
module.exports = ERR_MSGS;
