import dayjs from "dayjs";

export const getCurrentDay = ()=> {
    return dayjs().format("YYYY-MM-DD");
}
