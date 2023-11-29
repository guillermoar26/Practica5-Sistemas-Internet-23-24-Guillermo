export type Client = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    DNI: string,
    bookings: Array<Omit<Booking, "client">>
};

export type Restaurant = {
    id: string,
    name: string,
    CIF: string,
    address: string,
    bookings: Array<Omit<Booking, "restaurant">>
};

export type Booking = {
    id: string,
    date?: Date,
    client: string,
    restaurant: string,
};