import process from "process";

const isDevMode: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export default isDevMode;
