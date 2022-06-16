import {
    BadRequestException,
    Body,
    createHandler,
    Post,
    Req,
    UnauthorizedException,
    ValidationPipe,
} from "@storyofams/next-api-decorators";
import { ProfileFormData } from "~/components/profile/hooks/useProfileForm";
import { Appointment } from "~/models";
import { ssrGetUser } from "~/helpers/authentication";
import { DataStore, withSSRContext } from "aws-amplify";
import { User } from "~/types/user";
import { NextApiRequest } from "next";
import { serializeModel } from "~/models/amplify-models";

export type CreateAppointment = {
    atStoreID: string;
    beginDate: string;
    endDate: string;
    message?: string;
    anonymousCustomer?: Pick<
        ProfileFormData,
        "address" | "title" | "firstName" | "lastName" | "phone" | "email"
    >;
};

class AppointmentsController {
    @Post()
    public async patch(@Body() body: CreateAppointment, @Req() req: NextApiRequest) {
        const SSR = withSSRContext({ req });
        const dataStore = SSR.DataStore as typeof DataStore;

        let user: User | undefined | null;
        if (!body.anonymousCustomer) {
            user = await ssrGetUser(req);
            if (!user) {
                throw new UnauthorizedException(
                    "Unable to retrieve user for presumably authenticated request",
                );
            }
        }

        const appointment = new Appointment({
            appointmentAtStoreId: body.atStoreID,
            beginDate: body.beginDate,
            endDate: body.endDate,
            message: body.message,
            userID: user?.id,
            customerInfo: body.anonymousCustomer
                ? JSON.stringify(body.anonymousCustomer)
                : undefined,
        });

        await dataStore.save(appointment);

        return serializeModel(appointment);
    }
}

export default createHandler(AppointmentsController);
