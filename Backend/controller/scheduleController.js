import TrekSchedule from "../models/TrekSchedule.js";

// GET /api/schedules
export const getSchedules = async (req, res) => {
  try {
    const schedules = await TrekSchedule.find({}).populate("trek_id").populate("vendor_id").populate("guide_id");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/schedules
export const createSchedule = async (req, res) => {
  try {
    const schedule = new TrekSchedule(req.body);
    const createdSchedule = await schedule.save();
    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/schedules/:id/seats
export const updateSeats = async (req, res) => {
  try {
    const { available_seats } = req.body;
    const schedule = await TrekSchedule.findByIdAndUpdate(
      req.params.id, 
      { available_seats }, 
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/schedules/guide
export const getGuideSchedules = async (req, res) => {
  try {
    const schedules = await TrekSchedule.find({ guide_id: req.user.id }).populate("trek_id").populate("vendor_id");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
