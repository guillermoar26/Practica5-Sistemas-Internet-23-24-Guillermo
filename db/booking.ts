import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        date: { type: Date, required: false, default: Date.now },
        client: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Client"
        },
        restaurant: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Restaurant"
        },
    },
    { timestamps: true }
);

bookingSchema
    .path("date")
    .validate(function (date: Date): boolean {
        const now = new Date();
        return date > now;
    }, 'Bookings must be today or later');

export type BookingModelType = mongoose.Document & {
    date: Date;
    client: mongoose.Types.ObjectId;
    restaurant: mongoose.Types.ObjectId;
};

export const BookingModel = mongoose.model<BookingModelType>(
    "Booking",
    bookingSchema
);
