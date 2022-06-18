import { default as calendly } from "~/calendly/CalendlyClient";

export type TimeSlot = {
    startUTC: number;
    endUTC: number;
};

export const getUnavailableSlots = async (): Promise<Array<TimeSlot>> => {
    const me = await calendly.getMe();
    const events = await calendly.getOrganizationScheduledEvents(me.currentOrganization, "active");
    return events.map((ev) => ({
        startUTC: Date.parse(ev.startTime),
        endUTC: Date.parse(ev.endTime),
    }));
};

export const getAvailableSlotsForDay = async () => {};
