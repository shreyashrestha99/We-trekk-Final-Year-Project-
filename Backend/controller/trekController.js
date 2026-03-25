import Trek from "../models/Trek.js";

// GET /api/treks
export const getTreks = async (req, res) => {
  try {
    const treks = await Trek.find({});
    res.json(treks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/treks/:id
export const getTrekById = async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: "Trek not found" });
    res.json(trek);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/treks
export const createTrek = async (req, res) => {
  try {
    const trek = new Trek(req.body);
    const createdTrek = await trek.save();
    res.status(201).json(createdTrek);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/treks/:id
export const updateTrek = async (req, res) => {
  try {
    const updatedTrek = await Trek.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrek) return res.status(404).json({ message: "Trek not found" });
    res.json(updatedTrek);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/treks/:id
export const deleteTrek = async (req, res) => {
  try {
    const deletedTrek = await Trek.findByIdAndDelete(req.params.id);
    if (!deletedTrek) return res.status(404).json({ message: "Trek not found" });
    res.json({ message: "Trek removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
