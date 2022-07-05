const ERR_MSGS = {
    DEFAULT: "Something went Wrong :(",
    DEFAULT_W_SOURCE: (source) => `Something went wrong with ${source} :(`,
    PG: {
        DEFAULT: (code)=>{
            `msg: PG ERROR ${code},
            tip: please refer to the psql website for more details https://www.postgresql.org/docs/current/errcodes-appendix.html`
        },
        "42P01": {
            msg: "The table or database you tried to reference may not exist",
            tip: "Make sure your PSQL server has been spun up and seeded"
        },
        "22P02": {
            msg: "Invalid text representation",
            tip: "check the data type of your parameter"
        }
    },
};
module.exports = ERR_MSGS;