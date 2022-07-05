const ERR_MSGS = {
  DEFAULT: "Something went Wrong :(",
  DOES_NOT_EXIST: (value, helper) => {
    return {
      msg: `${helper}: ${value} does not exist`,
      tip: `try a different ${helper}`,
      status: 404,
    };
  },
  THINGS_MISSING : {
        msg: "Your request was missing important data",
        tip: "Please check the docs and refactor your request before resubmitting",
        status: 400,
  },
  PG: {
    DEFAULT: {
      msg: "Unspecified Server Error",
      tip: "Contact the website admin",
      status: 500,
    },
    "42P01": {
      msg: "Unable to access Table or Database",
      tip: "The server may be down. Please contact the website admin",
      status: 500,
    },
    "22P02": {
      msg: "Invalid Data type",
      tip: "check the data type(s) of your parameter/body",
      status: 400,
    },
    "23502": {
      msg: "Null value",
      tip: "something is missing! check your params/body",
      status: 400,
    },
    "23503": {
      msg: "Invalid Key",
      tip: "something in your params/body isn't quite right. ",
      status: 400,
    },
  },
};
module.exports = ERR_MSGS;
