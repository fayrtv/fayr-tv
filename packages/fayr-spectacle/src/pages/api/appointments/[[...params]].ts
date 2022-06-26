import {
    Body,
    createHandler,
    InternalServerErrorException,
    Post,
    Req,
    UnauthorizedException,
} from "@storyofams/next-api-decorators";
import { ProfileFormData } from "~/components/profile/hooks/useProfileForm";
import { ssrGetUser } from "~/helpers/authentication";
import { DataStore, withSSRContext } from "aws-amplify";
import { User } from "~/types/user";
import { NextApiRequest } from "next";
import { createBooking } from "~/timekit/timekitClient";
import { TimeSlot } from "~/components/appointment/types";

export type AppointmentCustomerInfo = Pick<
    ProfileFormData,
    "address" | "title" | "firstName" | "lastName" | "phone" | "email"
>;

export type CreateAppointment = {
    atStoreID: string;
    timeSlot: TimeSlot;
    message?: string;
    anonymousCustomer?: AppointmentCustomerInfo;
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

        // const appointment = new Appointment({
        //     appointmentAtStoreId: body.atStoreID,
        //     beginDate: body.beginDate,
        //     endDate: body.endDate,
        //     message: body.message,
        //     userID: user?.id,
        //     customerInfo: body.anonymousCustomer
        //         ? JSON.stringify(body.anonymousCustomer)
        //         : undefined,
        // });
        //
        // await dataStore.save(appointment);
        //
        // return serializeModel(appointment);

        try {
            return await createBooking(body.timeSlot, user ?? body.anonymousCustomer!, body.message);
        } catch(err) {
            console.error(err);
            throw new InternalServerErrorException();
        }
    }
}

export default createHandler(AppointmentsController);
