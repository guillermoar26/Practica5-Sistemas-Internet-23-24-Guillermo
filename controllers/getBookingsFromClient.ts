import { BookingModelType } from "../db/booking.ts";
import { RestaurantModel } from "../db/restaurant.ts";

export const getBookingsFromClient = async (
    bookings: BookingModelType[],
): Promise<{ date: Date, restaurantName: string, address: string }[]> => {
    return await Promise.all(
        bookings.map(async (booking: BookingModelType) => {
            const { restaurant: restaurantId, date } = booking;
            const restaurant = await RestaurantModel.findById(restaurantId).exec();
            const restaurantName: string = restaurant ? restaurant.name : "No restaurant name provided?";
            const address: string = restaurant ? restaurant.address : "No address provided?";
            return { date, restaurantName, address };
        })
    );
};
