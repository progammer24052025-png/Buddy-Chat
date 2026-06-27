// ========================================
// PUSH SUBSCRIPTION MODEL — PushSubscription.js
// ========================================
// This file defines what a "Push Subscription" looks like in our MongoDB database.
//
// What is a Push Subscription?
// When a user grants notification permission in their browser, the browser generates
// a "subscription object" containing:
//   - endpoint: A unique URL provided by the push service (Google/Mozilla/Apple)
//   - keys.p256dh: A public key used to encrypt push messages
//   - keys.auth: An authentication secret for push message encryption
//
// We store this subscription in the database so the backend can send push notifications
// to the user even when they've closed the app (no active WebSocket connection).
//
// A user can have multiple subscriptions (one per device/browser).
// Example: Same user logged in on Chrome desktop + Chrome mobile = 2 subscriptions.
// ========================================

// mongoose: Imported for Schema definition and ObjectId type (for referencing Users).
import mongoose from "mongoose";

// pushSubscriptionSchema: The blueprint for a PushSubscription document.
const pushSubscriptionSchema = new mongoose.Schema(
  {
    // userId: The user this subscription belongs to.
    // - type: ObjectId — references a User document
    // - ref: "User" — enables .populate("userId") to get user details
    // - required: true — every subscription must belong to a user
    // - index: true — Creates a database index on this field for fast lookups.
    //   Without an index, finding all subscriptions for a user would require
    //   scanning every document in the collection (slow for large datasets).
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // subscription: The browser-generated push subscription object.
    // This is NOT something we create — it's provided by the browser's Push API.
    //
    // It has two parts:
    subscription: {
      // endpoint: The URL where the push service accepts notifications for this user.
      // - type: String — looks like "https://fcm.googleapis.com/fcm/send/..."
      // - required: true — this is the ONLY way to reach the user's device
      //
      // When we send a push notification, we POST to this URL with the encrypted payload.
      endpoint: { type: String, required: true },

      // keys: Encryption keys used to secure push messages.
      // Without these, anyone could intercept and read the notifications.
      keys: {
        // p256dh: The user's public key (Elliptic Curve P-256).
        // Used by the backend to encrypt the push message so ONLY this device can decrypt it.
        // - type: String — a long base64-encoded string
        // - required: true
        p256dh: { type: String, required: true },

        // auth: A shared authentication secret.
        // Additional layer of security for push message encryption.
        // - type: String — a shorter base64-encoded string
        // - required: true
        auth: { type: String, required: true },
      },
    },
  },
  {
    // timestamps: true — Mongoose auto-adds createdAt and updatedAt.
    // Useful for debugging: when was this subscription created/last updated?
    timestamps: true,
  }
);

// Composite unique index: One subscription per (userId + endpoint) combination.
// This prevents duplicate subscriptions if the user re-subscribes from the same browser.
//
// How it works:
//   - { userId: 1, "subscription.endpoint": 1 } — Index on both fields together
//   - { unique: true } — MongoDB rejects inserts if this combination already exists
//
// Why not just unique on endpoint? Because different users could theoretically
// share an endpoint (rare but possible). The combo ensures complete uniqueness.
pushSubscriptionSchema.index({ userId: 1, "subscription.endpoint": 1 }, { unique: true });

// mongoose.model("PushSubscription", pushSubscriptionSchema): Creates the PushSubscription model.
// This model is used to:
//   - PushSubscription.findOneAndUpdate({ userId, endpoint }, { ... }, { upsert: true })
//     — Save or update a subscription (avoids duplicates)
//   - PushSubscription.find({ userId }) — Get all subscriptions for a user (multi-device)
//   - PushSubscription.deleteOne({ userId, endpoint }) — Remove a subscription on logout
//   - PushSubscription.deleteMany({ userId }) — Remove all subscriptions on logout
const PushSubscription = mongoose.model("PushSubscription", pushSubscriptionSchema);

// Export the model so other files can use it:
//   - push.controller.js uses it to save/delete subscriptions
//   - pushService.js uses it to find subscriptions when sending push notifications
export default PushSubscription;
