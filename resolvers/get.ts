// @deno-types="npm:@types/express@4"
import { Request, Response } from 'express';

import { ClientModel, ClientModelType } from '../db/client.ts';
import { BookingModel, BookingModelType } from '../db/booking.ts';
import { RestaurantModel, RestaurantModelType } from "../db/restaurant.ts";

import { getBookingsFromRestaurant } from "../controllers/getBookingsFromRestaurant.ts";
import { getBookingsFromClient } from "../controllers/getBookingsFromClient.ts";

export const getClient = async (
    req: Request<{ id: string }>,
    res: Response<ClientModelType | { error: string }>
): Promise<void> => {
    try {
        const clientId: string = req.params.id;

        const client: ClientModelType | null = await ClientModel
            .findById(clientId)
            .select('-__v -createdAt -updatedAt -_id')
            .exec();

        if (!client) {
            res.status(404).send({ error: 'Client not found' });
            return;
        }

        const bookings = await BookingModel.find({ client: clientId }).exec();
        const populatedBookings = await getBookingsFromClient(bookings);

        const clientData = {
            ...client.toObject(),
            bookings: populatedBookings,
        };

        delete clientData._id;
        res.status(200).send(clientData);
    } catch (error) {
        res.status(500).send({ error: error.message || 'Failed to fetch client' });
    }
};

export const getRestaurant = async (
    req: Request<{ id: string }>,
    res: Response<RestaurantModelType | { error: string }>
): Promise<void> => {
    try {
        const restaurantId: string = req.params.id;

        const restaurant: RestaurantModelType | null = await RestaurantModel
            .findById(restaurantId)
            .select('-__v -createdAt -updatedAt -_id')
            .exec();

        if (!restaurant) {
            res.status(404).send({ error: 'Restaurant not found' });
            return;
        }

        const bookings = await BookingModel.find({ restaurant: restaurantId }).exec();
        const populatedBookings = await getBookingsFromRestaurant(bookings);

        const restaurantData = {
            ...restaurant.toObject(),
            bookings: populatedBookings,
        };

        delete restaurantData._id;
        res.status(200).send(restaurantData);
    } catch (error) {
        res.status(500).send({ error: error.message || 'Failed to fetch restaurant' });
    }
};

export const getBooking = async (
    req: Request<{ id: string }>,
    res: Response<BookingModelType | { error: string }>,
): Promise<void> => {
    try {
        const bookingId: string = req.params.id;

        const booking: BookingModelType | null = await BookingModel.findById(bookingId)
            .select('-__v -createdAt -updatedAt')
            .exec();

        if (!booking) {
            res.status(404).send({ error: 'Booking not found' });
            return;
        }

        const client = await ClientModel.findById(booking.client).exec();
        const restaurant = await RestaurantModel.findById(booking.restaurant).exec();

        if (!client || !restaurant) {
            res.status(404).send({ error: 'Booking not found!' });
            return;
        }

        const populatedBooking = {
            ...booking.toObject(),
            client: client.firstName + ' ' + client.lastName,
            restaurant: restaurant.name,
        };

        delete populatedBooking._id;
        res.status(200).send(populatedBooking);
    } catch (error) {
        res.status(500).send({ error: error.message || 'Failed to fetch booking' });
    }
};
