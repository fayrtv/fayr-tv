import { TimeSlot } from "~/components/appointment/types";

const timekit = require("timekit-sdk");
import { env } from "~/constants/env";
import { AppointmentCustomerInfo } from "~/pages/api/appointments/[[...params]]";
import { formatCustomerName, formatFormalAddress } from "~/types/user";

timekit.configure({
    appKey: env.TIMEKIT_API_KEY,
    convertResponseToCamelcase: true,
});

export type Resource = {
    id: string;
    name: string;
    timezone: string;
};

const PROJECT_ID = "c078564a-b4c4-4b9b-8060-cdcf684fdb7c";

export const fetchAvailability = async (forResourceID: string): Promise<TimeSlot[]> => {
    const response: {
        data: Array<{
            start: string;
            end: string;
            resources: Array<Resource>;
        }>;
    } = await timekit.fetchAvailability({
        projectId: PROJECT_ID,
    });

    return response.data
        .filter((x) => x.resources.some((x) => x.id === forResourceID))
        .map(
            (x) =>
                ({
                    startUTC: x.start,
                    endUTC: x.end,
                    resourceID: forResourceID,
                } as TimeSlot),
        );
};

export const createBooking = async (timeSlot: TimeSlot, customer: AppointmentCustomerInfo) => {
    const response = await timekit.createBooking({
        projectId: PROJECT_ID,
        // https://help.timekit.io/en/articles/1389944-introduction-to-booking-graphs
        graph: "instant",
        resourceId: timeSlot.resourceID,
        start: timeSlot.startUTC,
        end: timeSlot.endUTC,
        // TODO: pass
        customer: {
            name: formatFormalAddress(customer),
            // TODO: Pass in once we have premium subscription of Timekit
            email: "development@fayrtv.com",
            phone: customer.phone,
            address: customer.address,
            title: customer.title,
            firstName: customer.firstName,
            lastName: customer.lastName,
            // voip: "McFly",
            // timezone: "America/Los_Angeles",
        },
    });
    return response.data;
};

export const getProjectResourceIDs = async (): Promise<string[]> => {
    return (await timekit.getProjectResources({ id: PROJECT_ID })).data;
};

export const getAllResources = async (): Promise<Array<Resource & { email: string }>> => {
    return (await timekit.getResources()).data;
};
