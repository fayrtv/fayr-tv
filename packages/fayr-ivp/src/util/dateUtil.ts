import moment from "moment/moment";

/**
 * @param timestampWithTimezone e.g. "2022-07-16T14:50:00+02:00"
 */
export const isAfterSpecificTimestamp = (timestampWithTimezone: string) =>
    moment.utc().isAfter(moment.utc(timestampWithTimezone));
