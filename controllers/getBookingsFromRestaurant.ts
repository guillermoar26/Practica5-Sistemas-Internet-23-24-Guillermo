import { BookingModelType } from "../db/booking.ts";
import { ClientModel } from "../db/client.ts";

export const getBookingsFromRestaurant = async (
    bookings: BookingModelType[],
): Promise<{ date: Date, clientName: string, phoneNumber: string }[]> => {
    return await Promise.all(
        bookings.map(async (booking: BookingModelType) => {
            const { client: clientId, date } = booking;
            const client = await ClientModel.findById(clientId).exec();
            const clientName: string = client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
            const phoneNumber: string = client ? client.phoneNumber : "Phone number not given";
            return { date, clientName, phoneNumber };
        })
    );
};
