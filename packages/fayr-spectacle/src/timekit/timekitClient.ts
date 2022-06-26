import { TimeSlot } from "~/components/appointment/types";

const timekit = require("timekit-sdk");
import { env } from "~/constants/env";

timekit.configure({
    appKey: env.TIMEKIT_API_KEY,
    convertResponseToCamelcase: true,
});

const PROJECT_ID = "c078564a-b4c4-4b9b-8060-cdcf684fdb7c";

export const fetchAvailability = async (): Promise<
    Array<{
        start: string;
        end: string;
        resources: Array<any>;
    }>
> => {
    const response = await timekit.fetchAvailability({
        projectId: PROJECT_ID,
    });
    return response.data;
};

export const createBooking = async (timeSlot: TimeSlot) => {
    const response = await timekit.createBooking({
        projectId: PROJECT_ID,
        // https://help.timekit.io/en/articles/1389944-introduction-to-booking-graphs
        graph: "instant",
        resourceId: timeSlot.resourceID,
        start: timeSlot.startUTC,
        end: timeSlot.endUTC,
        // TODO: Adjust
        what: "What Test",
        where: "Where test",
        // TODO: pass
        customer: {
            name: "Marty McFly",
            email: "development@fayrtv.com",
            phone: "1-591-001-5403",
            voip: "McFly",
            timezone: "America/Los_Angeles",
        },
    });
    return response.data;
};
