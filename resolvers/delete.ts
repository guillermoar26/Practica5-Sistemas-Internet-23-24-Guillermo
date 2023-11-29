// @deno-types="npm:@types/express@4"
import { Request, Response } from 'express';

import { ClientModel } from '../db/client.ts';
import { BookingModel } from '../db/booking.ts';
import { RestaurantModel } from "../db/restaurant.ts";

export const deleteRestaurant = async (
    req: Request<{ id: string }>,
    res: Response<{ message: string } | { error: string }>
): Promise<void> => {
    try {
        const restaurantId: string = req.params.id;

        const restaurant = await RestaurantModel.findByIdAndDelete(restaurantId).exec();
        if (!restaurant) {
            res.status(404).send({ error: 'Restaurant not found' });
            return;
        };

        const bookings = await BookingModel.
            findByIdAndDelete({
                restaurant: restaurantId
            }).exec();
        if (!bookings) {
            res.status(404).send({ error: 'Bookings not found' });
            return;
        };

        const clients = await ClientModel.updateMany({},
            {
                $pull: { bookings: bookings._id }
            }).exec();
        if (!clients) {
            res.status(404).send({ error: 'Clients not found' });
            return;
        };

        res.status(200).send({ message: 'Restaurant and associated bookings deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message || 'Failed to delete restaurant' });
    }
};

export const deleteRestaurants = async (
    req: Request<{}, {}, {}>,
    res: Response<{ message: string } | { error: string }>
): Promise<void> => {
    try {
        const restaurants = await RestaurantModel.deleteMany({}).exec();
        if (!restaurants) {
            res.status(404).send({ error: 'Restaurants not found' });
            return;
        };

        const bookings = await BookingModel.deleteMany({}).exec();
        if (!bookings) {
            res.status(404).send({ error: 'Bookings not found' });
            return;
        };

        const clients = await ClientModel.updateMany({},
            {
                $set: { bookings: [] }
            }).exec();
        if (!clients) {
            res.status(404).send({ error: 'Clients not found' });
            return;
        };

        res.status(200).send({ message: 'Restaurants and bookings deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message || 'Failed to delete restaurants' });
    }
};

export const deleteBooking = async (
    req: Request<{ id: string }>,
    res: Response<{ message: string } | { error: string }>
): Promise<void> => {
    try {
        const bookingId: string = req.params.id;

        const booking = await BookingModel.findByIdAndDelete(bookingId).exec();
        if (!booking) {
            res.status(404).send({ error: 'Booking not found' });
            return;
        };

        const client = await ClientModel.
            findByIdAndUpdate(booking.client, {
                $pull: { bookings: bookingId }
            }).exec();
        if (!client) {
            res.status(404).send({ error: 'Client not found' });
            return;
        };

        const restaurant = await RestaurantModel.
            findByIdAndUpdate(booking.restaurant, {
                $pull: { bookings: bookingId }
            }).exec();
        if (!restaurant) {
            res.status(404).send({ error: 'Restaurant not found' });
            return;
        };

        res.status(200).send({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message || 'Failed to delete booking' });
    }
};
