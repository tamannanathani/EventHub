import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export const createBooking = async (req, res) => {
  try {
    const { eventId, name, email, mobile, quantity } = req.body;

    //atomically decrease availableSeats
    const event = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: quantity } },
      { $inc: { availableSeats: -quantity } },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // total amount
    const totalAmount = quantity * event.price;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      name,
      email,
      mobile,
      quantity,
      totalAmount
    });
    res.status(201).json({ booking, availableSeats: event.availableSeats });
} catch (error) {
    res.status(500).json({ error: error.message });
  }
};
