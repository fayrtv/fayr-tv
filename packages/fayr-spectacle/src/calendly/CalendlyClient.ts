import axios, { AxiosInstance } from "axios";
import { env } from "~/constants/env";

const CALENDLY_API_BASE_URL = "https://api.calendly.com";

export type CalendlyEvent = {
    createdAt: string;
    endTime: string;
    eventGuests: Array<any>;
    eventMemberships: Array<any>;
    eventType: string;
    inviteesCounter: Array<Object>;
    location: Array<Object>;
    name: string;
    startTime: string;
    status: "active" | "canceled";
    updatedAt: string;
    uri: string;
};

export class CalendlyClient {
    _accessToken: string;
    _instance: AxiosInstance;

    constructor(personalAccessToken: string) {
        this._accessToken = personalAccessToken;
        this._instance = axios.create({
            baseURL: CALENDLY_API_BASE_URL,
        });
    }

    get authHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${this._accessToken}`,
            },
        };
    }

    public getMe = async () => {
        const {
            data: { resource },
        } = await this._instance.get("/users/me", this.authHeaders);
        return {
            avatarUrl: resource.avatar_url as string | null,
            createdAt: new Date(resource.created_at),
            currentOrganization: resource.current_organization as string,
            email: resource.email as string,
            name: resource.name as string,
            schedulingUrl: resource.scheduling_url as string,
            slug: resource.slug as string,
            timezone: resource.timezone as string,
            updatedAt: resource.created_at as string,
            uri: resource.uri as string,
        };
    };

    public getUserEventTypes = async (userUri: string) => {
        const { data } = await this._instance.get(`/event_types?user=${userUri}`, this.authHeaders);
        return data;
    };

    public getUserEventType = async (uuid: string) => {
        const { data } = await this._instance.get(`/event_types/${uuid}`, this.authHeaders);

        return data;
    };

    public getOrganizationScheduledEvents = async (
        organizationUri: string,
        status: "active" | "canceled" = "active",
        count: number = 10,
        pageToken?: number,
        maxStartTime?: string,
        minStartTime?: string,
    ): Promise<Array<CalendlyEvent>> => {
        let queryParams = [
            `organization=${organizationUri}`,
            `count=${count}`,
            `status=${status}`,
            `sort=start_time:asc`,
        ];

        if (pageToken) {
            queryParams.push(`page_token=${pageToken}`);
        }
        if (maxStartTime) {
            queryParams.push(`max_start_time=${maxStartTime}`);
        }
        if (minStartTime) {
            queryParams.push(`min_start_time=${minStartTime}`);
        }

        const url = `/scheduled_events?${queryParams.join("&")}`;

        // TODO: Resolve pagination in single method call
        const {
            data: { collection, pagination },
        } = await this._instance.get(url, this.authHeaders);

        return collection.map((d: any) => ({
            createdAt: d.created_at,
            endTime: d.end_time,
            eventGuests: d.event_guests,
            eventMemberships: d.event_memberships,
            eventType: d.event_type,
            inviteesCounter: d.invitees_counter,
            location: d.location,
            name: d.name,
            startTime: d.start_time,
            status: d.status,
            updatedAt: d.updated_at,
            uri: d.uri,
        }));
    };

    public getUserScheduledEvent = async (uuid: string) => {
        const { data } = await this._instance.get(`/scheduled_events/${uuid}`, this.authHeaders);

        return data;
    };

    public getUserScheduledEventInvitees = async (
        uuid: string,
        count: number,
        pageToken: string,
    ) => {
        let queryParams = [`count=${count || 10}`].join("&");

        if (pageToken) queryParams += `&page_token=${pageToken}`;

        const url = `/scheduled_events/${uuid}/invitees?${queryParams}`;

        const { data } = await this._instance.get(url, this.authHeaders);

        return data;
    };

    public markAsNoShow = async (uri: string) => {
        const { data } = await this._instance.post(
            "/invitee_no_shows",
            {
                invitee: uri,
            },
            this.authHeaders,
        );

        return data;
    };

    public undoNoShow = async (inviteeUuid: string) => {
        await this._instance.delete(`/invitee_no_shows/${inviteeUuid}`, this.authHeaders);
    };

    public cancelEvent = async (uuid: string, reason: string) => {
        const { data } = await this._instance.post(
            `/scheduled_events/${uuid}/cancellation`,
            {
                reason: reason,
            },
            this.authHeaders,
        );

        return data;
    };
}

export default new CalendlyClient(env.CALENDLY_ACCESS_TOKEN);
