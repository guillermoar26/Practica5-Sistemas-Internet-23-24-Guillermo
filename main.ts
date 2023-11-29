import express from "express";
import mongoose from "mongoose";

import { getBooking, getClient, getRestaurant } from "./resolvers/get.ts";
import { postBooking, postClient, postRestaurant } from "./resolvers/post.ts";
import { deleteBooking, deleteRestaurant, deleteRestaurants } from "./resolvers/delete.ts";

const MONGO_URL: string | undefined = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.log("Url not found in env");
  Deno.exit(1);
}

mongoose.connect(MONGO_URL);

const app = express();
app.use(express.json());

app
  .get("/client/:id", getClient)
  .get("/restaurant/:id", getRestaurant)
  .delete("/restaurant/:id", deleteRestaurant)
  .delete("/restaurant/", deleteRestaurants)
  .post("/client", postClient)
  .post("/restaurant", postRestaurant)
  .post("/booking", postBooking)
  .get("/booking/:id", getBooking)
  .delete("/booking/:id", deleteBooking)

app.listen(3000, (): void => {
  console.info("🚀 Server listening on http://localhost:3000/");
});


