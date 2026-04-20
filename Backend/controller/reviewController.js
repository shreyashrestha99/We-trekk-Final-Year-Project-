import Review from "../models/Review.js";

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    // AT-25: Only treks booked by trekker can be reviewed (simplified to role check here)
    if (req.user.role !== "Trekker") {
      return res.status(403).json({ message: "Only trekkers can post reviews." });
    }

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

// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    console.log("--- Review Deletion Debug ---");
    console.log("Review Data:", review);
    console.log("Logged-in User ID:", req.user.id);
    
    // Safety check for missing trekker_id on old data
    if (!review.trekker_id) {
      console.log("⚠️ Review has no owner ID (old data)");
    }

    const isOwner = review.trekker_id && review.trekker_id.toString() === req.user.id;
    const isAdmin = req.user.role === "Admin";

    // Authorization check: Only owner or admin can delete
    if (!isOwner && !isAdmin) {
      console.log("❌ AUTHORIZATION FAILED");
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    console.log("✅ AUTHORIZATION SUCCESS");
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Review Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
