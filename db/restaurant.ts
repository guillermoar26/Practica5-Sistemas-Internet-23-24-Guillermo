import mongoose from "mongoose";
import { Restaurant } from "../types.ts";

const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        CIF: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        bookings: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Booking"
        }]
    },
    { timestamps: true }
);

restaurantSchema
    .path("CIF")
    .validate(function (cif: string): boolean {
        const normalizedCif: string = cif.replace(/\s/g, "");
        const cifRegex = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
        return cifRegex.test(normalizedCif);
    }, 'The CIF field is not valid')

export type RestaurantModelType = mongoose.Document &
    Omit<Restaurant, "id" | "bookings"> & {
        bookings: Array<mongoose.Types.ObjectId>;
    };

export const RestaurantModel = mongoose.model<RestaurantModelType>(
    "Restaurant",
    restaurantSchema
);