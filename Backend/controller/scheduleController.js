import TrekSchedule from "../models/TrekSchedule.js";
import Trek from "../models/Trek.js";
import Notification from "../models/Notification.js";

// GET /api/schedules
export const getSchedules = async (req, res) => {
  try {
    const schedules = await TrekSchedule.find({})
      .populate("trek_id")
      .populate("guide_id", "name email");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/schedules
export const createSchedule = async (req, res) => {
  try {
    const { trek_id, date, available_seats } = req.body;
    
    // Look up the Trek to verify ownership and calculate duration
    const trek = await Trek.findById(trek_id);
    if (!trek) return res.status(404).json({ message: "Trek blueprint not found" });

    // Ensure the guide trying to create the schedule actually owns the trek blueprint
    if (trek.guide_id.toString() !== req.user.id) {
       return res.status(403).json({ message: "Unauthorized to schedule this trek" });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + trek.duration_days);

    const schedule = new TrekSchedule({
      trek_id,
      guide_id: req.user.id,
      date: startDate,
      start_date: startDate,
      end_date: endDate,
      available_seats: Number(available_seats),
      total_seats: Number(available_seats)
    });
    
    const createdSchedule = await schedule.save();

    await Notification.create({
      user_id: req.user.id,
      type: "schedule_created",
      message: `Opened new schedule for "${trek.trek_name}" departing on ${startDate.toLocaleDateString()}`
    });

    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/schedules/:id
export const updateSchedule = async (req, res) => {
  try {
    const { date, available_seats } = req.body;
    const schedule = await TrekSchedule.findById(req.params.id).populate("trek_id");
    
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    // Authorization
    if (schedule.guide_id.toString() !== req.user.id) {
       return res.status(403).json({ message: "Unauthorized to update this schedule" });
    }

    // Update and re-calculate end date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + (schedule.trek_id?.duration_days || 0));

    schedule.date = startDate;
    schedule.start_date = startDate;
    schedule.end_date = endDate;
    schedule.available_seats = Number(available_seats);

    const updated = await schedule.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/schedules/:id
export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await TrekSchedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    // Authorization
    if (schedule.guide_id.toString() !== req.user.id) {
       return res.status(403).json({ message: "Unauthorized to delete this schedule" });
    }

    await TrekSchedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/schedules/guide
export const getGuideSchedules = async (req, res) => {
  try {
    const schedules = await TrekSchedule.find({ guide_id: req.user.id })
       .populate("trek_id")
       .sort({ start_date: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

