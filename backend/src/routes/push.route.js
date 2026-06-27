import express from "express";
import { saveSubscription, deleteSubscription } from "../controllers/push.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/subscribe", protectRoute, saveSubscription);
router.delete("/unsubscribe", protectRoute, deleteSubscription);

export default router;
