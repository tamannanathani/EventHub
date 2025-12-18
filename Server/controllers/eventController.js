import Event from "../models/Event.js";

// Create Event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events (search + filter)
export const getEvents = async (req, res) => {
  const { location, date, search } = req.query;
  const query = {};

  if (location) query.location = location;
  if (date) query.date = { $gte: new Date(date) };
  if (search) query.title = { $regex: search, $options: "i" };

  try {
    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const myEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).sort({ date: 1 }); 
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }


    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot edit this event" });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
