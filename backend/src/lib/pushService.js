import webpush from "web-push";
import { ENV } from "./env.js";
import PushSubscription from "../models/PushSubscription.js";

// Configure VAPID credentials once at startup
webpush.setVapidDetails(
  ENV.VAPID_SUBJECT,
  ENV.VAPID_PUBLIC_KEY,
  ENV.VAPID_PRIVATE_KEY
);

/**
 * Send a push notification to a single subscription.
 * Returns true on success, false on failure.
 * Automatically removes expired/invalid subscriptions (HTTP 410 Gone).
 */
export async function sendPushNotification(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (error) {
    // 410 Gone = subscription expired or user unsubscribed at browser level
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log("Removing expired push subscription:", subscription.endpoint);
      await PushSubscription.deleteOne({ "subscription.endpoint": subscription.endpoint });
    } else {
      console.error("Push notification error:", error.message);
    }
    return false;
  }
}

/**
 * Send push to all subscriptions for a given user.
 */
export async function sendPushToUser(userId, payload) {
  const subs = await PushSubscription.find({ userId });
  if (subs.length === 0) return;

  await Promise.all(
    subs.map((doc) => sendPushNotification(doc.subscription, payload))
  );
}
