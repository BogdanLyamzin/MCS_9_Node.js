const dayjs = require("dayjs");

const getCurrentDay = ()=> {
    return dayjs().format("YYYY-MM-DD");
}

module.exports = {
    getCurrentDay,
}