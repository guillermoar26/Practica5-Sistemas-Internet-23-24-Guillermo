// @deno-types="npm:@types/express@4"
import { Request, Response } from "express";

import { ClientModel, ClientModelType } from "../db/client.ts";
import { RestaurantModel, RestaurantModelType } from "../db/restaurant.ts";
import { BookingModel } from "../db/booking.ts";

export const postClient = async (
    req: Request<{}, {}, ClientModelType>,
    res: Response<ClientModelType | { error: string }>
): Promise<void> => {
    try {
        const { firstName, lastName, email, phoneNumber, DNI } = req.body;

        const clientData: ClientModelType = new ClientModel({
            firstName,
            lastName,
            email,
            phoneNumber,
            DNI,
            bookings: [],
        });

        const savedClient: ClientModelType = await clientData.save();
        res.status(201).send(savedClient);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const postRestaurant = async (
    req: Request<{}, {}, RestaurantModelType>,
    res: Response<RestaurantModelType | { error: string }>
): Promise<void> => {
    try {
        const { name, CIF, address } = req.body;

        const restaurantData: RestaurantModelType = new RestaurantModel({
            name,
            CIF,
            address,
            bookings: [],
        });

        const savedRestaurant: RestaurantModelType = await restaurantData.save();
        res.status(201).send(savedRestaurant);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const postBooking = async (
    req: Request<{}, {}, { clientId: string, restaurantId: string, date: string }>,
    res: Response<{ message: string } | { error: string }>
): Promise<void> => {
    try {
        const { clientId, restaurantId, date } = req.body;

        const clientData: ClientModelType | null = await ClientModel.findById(clientId).exec();
        if (!clientData) {
            res.status(404).send({ error: 'Client not found' });
            return;
        }

        const restaurantData: RestaurantModelType | null = await RestaurantModel.findById(restaurantId).exec();
        if (!restaurantData) {
            res.status(404).send({ error: 'Restaurant not found' });
            return;
        }

        const bookingExists = await BookingModel.findOne({ client: clientId, restaurant: restaurantId, date: date }).exec();
        if (bookingExists) {
            res.status(400).send({ error: 'Booking already exists' });
            return;
        }

        const bookingData = {
            client: clientId,
            restaurant: restaurantId,
            date,  // 2023-12-12T08:30:00
        };

        const savedBooking = await new BookingModel(bookingData).save();

        clientData.bookings.push(savedBooking._id);
        await clientData.save();

        restaurantData.bookings.push(savedBooking._id);
        await restaurantData.save();

        res.status(201).send({ message: 'Booking created successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

