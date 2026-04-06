import Trek from "../models/Trek.js";
import TrekSchedule from "../models/TrekSchedule.js";
import Notification from "../models/Notification.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// GET /api/treks
export const getTreks = async (req, res) => {
  try {
    const { difficulty, maxBudget } = req.query;
    let filter = {};

    if (difficulty) {
      filter.difficulty_level = difficulty;
    }
    if (maxBudget) {
      filter.cost = { $lte: Number(maxBudget) };
    }

    const treks = await Trek.find(filter);
    res.json(treks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/treks/guide
export const getGuideTreks = async (req, res) => {
  try {
    const treks = await Trek.find({ guide_id: req.user.id }).sort({ createdAt: -1 });
    res.json(treks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/treks/:id
export const getTrekById = async (req, res) => {
  try {
    const { id } = req.params;
    let trek;

    // Phase 1: Try MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      trek = await Trek.findById(id);
    } 
    
    // Phase 2: Try Exact Name Search
    if (!trek) {
      trek = await Trek.findOne({ 
        trek_name: { $regex: new RegExp(`^${id}$`, "i") } 
      });
    }

    // Phase 3: Try Partial Name Search
    if (!trek) {
      trek = await Trek.findOne({ 
        trek_name: { $regex: new RegExp(id, "i") } 
      });
    }

    // Phase 4: Magic Mock Fallback (Ensures Demo links always work)
    if (!trek) {
      const fallbacks = {
        gosaikunda: {
          _id: "gosaikunda",
          trek_name: "Gosaikunda Holy Lake Trek",
          difficulty_level: "Moderate",
          duration_days: 7,
          cost: 8000,
          description: "Follow the sacred trails to the frozen lakes of Gosaikunda. A journey through Langtang National Park featuring breathtaking alpine scenery and high-altitude pilgrimage sites.",
          image_url: "" // Uses frontend default if empty
        },
        mardi: {
          _id: "mardi",
          trek_name: "Mardi Himal Base Camp",
          difficulty_level: "Moderate",
          duration_days: 5,
          cost: 6500,
          description: "A hidden gem in the Annapurna region. Experience the closest possible view of Mt. Machhapuchhre (Fishtail) while trekking through lush rhododendron forests and high ridges.",
          image_url: ""
        },
        manaslu: {
          _id: "manaslu",
          trek_name: "Manaslu Circuit Expedition",
          difficulty_level: "Hard",
          duration_days: 14,
          cost: 12000,
          description: "The 'unbeaten path' of Nepal. Surround yourself with 8,000m peaks and cross the challenging Larkya La pass in this remote spiritual journey near the Tibetan border.",
          image_url: ""
        }
      };

      const slug = id.toLowerCase();
      if (fallbacks[slug]) trek = fallbacks[slug];
      else if (id.includes("mardi")) trek = fallbacks.mardi;
      else if (id.includes("manaslu")) trek = fallbacks.manaslu;
      else if (id.includes("gosai")) trek = fallbacks.gosaikunda;
    }

    if (!trek) return res.status(404).json({ message: "Trek not discovered in our database. Consider creating it in your Guide Dashboard!" });
    res.json(trek);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/treks
export const createTrek = async (req, res) => {
  try {
    const trekData = { ...req.body };
    if (req.file) {
      trekData.image_url = `/uploads/${req.file.filename}`;
    }

    const trek = new Trek({
      ...trekData,
      guide_id: req.user.id
    });
    const createdTrek = await trek.save();

    await Notification.create({
      user_id: req.user.id,
      type: "trek_created",
      message: `Trek "${createdTrek.trek_name}" blueprint created successfully.`
    });

    res.status(201).json(createdTrek);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/treks/:id
export const updateTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: "Trek not found" });
    if (trek.guide_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this trek" });
    }

    const updatedTrek = await Trek.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTrek);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/treks/:id
export const deleteTrek = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: "Trek not found" });
    if (trek.guide_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this trek" });
    }

    // Protection rule implementation
    const activeSchedules = await TrekSchedule.find({ trek_id: req.params.id });
    if (activeSchedules.length > 0) {
      return res.status(400).json({ message: "Cannot delete Trek blueprint while associated Schedules exist." });
    }

    await Trek.findByIdAndDelete(req.params.id);
    res.json({ message: "Trek removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/treks/earnings (Dynamic Guide-only Financial Aggregation)
export const getGuideEarnings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Guide") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const guideId = new mongoose.Types.ObjectId(req.user.id);

    const earningsPerTrek = await Booking.aggregate([
      {
        $match: {
          booking_status: { $in: ["Confirmed", "Pending"] },
          trek_schedule_id: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: "trekschedules",
          localField: "trek_schedule_id",
          foreignField: "_id",
          as: "schedule"
        }
      },
      { $unwind: "$schedule" },
      {
        $match: {
           "schedule.guide_id": guideId
        }
      },
      {
        $lookup: {
          from: "treks",
          localField: "schedule.trek_id",
          foreignField: "_id",
          as: "trek"
        }
      },
      { $unwind: "$trek" },
      {
        $group: {
          _id: "$trek._id",
          trek_name: { $first: "$trek.trek_name" },
          trek_cost: { $first: "$trek.cost" },
          total_seats_booked: { $sum: "$seats" },
          trek_earnings: { $sum: { $multiply: ["$seats", "$trek.cost"] } }
        }
      }
    ]);

    const totalEarnings = earningsPerTrek.reduce((sum, trekInfo) => sum + trekInfo.trek_earnings, 0);

    res.json({
      totalEarnings,
      earningsPerTrek
    });

  } catch (error) {
    console.error("Earnings Error:", error);
    res.status(500).json({ message: "Server error calculating earnings" });
  }
};
