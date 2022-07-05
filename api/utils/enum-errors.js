const ERR_MSGS = {
    DEFAULT: "Something went Wrong :(",
    DOES_NOT_EXIST: (value, helper) => { return {
        msg: `${helper}: ${value} does not exist`,
        tip: `try a different ${helper}`
        }
    },
    PG: {
        DEFAULT: {
            msg: "Unspecified Server Error",
            tip: "Contact the website admin"
        },
        "42P01": {
            msg: "Unable to access Table or Database",
            tip: "The server may be down. Please contact the website admin"
        },
        "22P02": {
            msg: "Invalid Data type",
            tip: "check the data type(s) of your parameter/body"
        },
        "23502":{
            msg: "Null value",
            tip: "something is missing! check your params/body"
        }
    },
};
module.exports = ERR_MSGS;