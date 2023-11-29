import mongoose from "mongoose";
import { Client } from "../types.ts";

const Schema = mongoose.Schema;

const clientSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String, required: true, unique: true },
        DNI: { type: String, required: true, unique: true },
        bookings: [
            { type: Schema.Types.ObjectId, required: true, ref: "Booking" },
        ],
    },
    { timestamps: true }
);

clientSchema
    .path("email")
    .validate(function (email: string): boolean {
        const normalizedMail: string = email.replace(/\s/g, "");
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(normalizedMail);
    }, 'The email field is not valid')

clientSchema
    .path("phoneNumber")
    .validate(function (phone: string): boolean {
        const normalizedPhone: string = phone.replace(/\s/g, "");
        const phoneRegex = /^(?:(?:\+|00)34)?[6-9]\d{8}$/;
        return phoneRegex.test(normalizedPhone);
    }, 'The phone field is not valid')

clientSchema
    .path("DNI")
    .validate(function (dni: string): boolean {
        const normalizedDni: string = dni.replace(/\s/g, "");
        const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        return dniRegex.test(normalizedDni);
    }, 'The DNI field is not valid')

export type ClientModelType = mongoose.Document &
    Omit<Client, "id" | "bookings"> & {
        bookings: Array<mongoose.Types.ObjectId>;
    };

export const ClientModel = mongoose.model<ClientModelType>(
    "Client",
    clientSchema
);
