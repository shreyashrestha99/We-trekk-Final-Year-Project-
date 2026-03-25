import Review from "../models/Review.js";

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      trekker_id: req.user.id
    });
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/reviews/trek/:trekId
export const getTrekReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ trek_id: req.params.trekId }).populate("trekker_id", "trekker_name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
