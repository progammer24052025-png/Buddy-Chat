import PushSubscription from "../models/PushSubscription.js";

/**
 * Save or update a push subscription for the authenticated user.
 * Uses upsert keyed on endpoint so re-subscribing doesn't create duplicates.
 */
export const saveSubscription = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "Invalid push subscription object." });
    }

    await PushSubscription.findOneAndUpdate(
      { userId: req.user._id, "subscription.endpoint": endpoint },
      { userId: req.user._id, subscription: { endpoint, keys } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Push subscription saved." });
  } catch (error) {
    console.error("Error saving push subscription:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Remove the push subscription for the authenticated user on logout.
 */
export const deleteSubscription = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (endpoint) {
      await PushSubscription.deleteOne({
        userId: req.user._id,
        "subscription.endpoint": endpoint,
      });
    } else {
      // If no endpoint specified, remove all subscriptions for this user
      await PushSubscription.deleteMany({ userId: req.user._id });
    }
    res.status(200).json({ message: "Push subscription removed." });
  } catch (error) {
    console.error("Error deleting push subscription:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
