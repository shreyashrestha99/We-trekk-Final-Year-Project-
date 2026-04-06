import Notification from "../models/Notification.js";

// GET /api/notifications
// Get all notifications for the logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id })
                                            .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error.message);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({ message: "Marked as read", notification });
  } catch (error) {
    console.error("Failed to mark notification as read:", error.message);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};
