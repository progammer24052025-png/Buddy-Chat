// ========================================
// AUTHENTICATION ROUTES — auth.route.js
// ========================================
// This file defines the URL endpoints for authentication-related operations.
// These endpoints are mounted at `/api/auth` in server.js, so the full URLs are:
//   POST /api/auth/signup      — Create a new user account
//   POST /api/auth/login       — Log in with email + password
//   POST /api/auth/logout      — Log out (clear JWT cookie)
//   PUT  /api/auth/update-profile — Update profile picture (requires login)
//   GET  /api/auth/check       — Check if user is logged in (requires login)
//
// Each endpoint is connected to a "controller" function that contains the actual logic.
// Routes just define the URL + HTTP method + which controller handles it.
// ========================================

// express: Imported to use express.Router() — creates a modular route handler.
// Instead of defining all routes on the main `app` (in server.js), we group
// related routes into separate routers (auth, messages, groups, push) for organization.
import express from "express";

// Import controller functions — these contain the actual business logic.
// signup, login, logout, updateProfile are defined in auth.controller.js.
// Each function receives (req, res) and handles the request.
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";

// protectRoute: Middleware that verifies the user is logged in (valid JWT cookie).
// If the user is not authenticated, it returns 401 Unauthorized.
// Used on routes that require login (update-profile, check).
import { protectRoute } from "../middleware/auth.middleware.js";

// arcjetProtection: Middleware that rate-limits requests to prevent abuse.
// Applied globally to all auth routes (signup, login, etc.) to stop brute-force attacks
// and spam account creation.
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

// router: Creates a new Express Router instance.
// This is like a mini-Express app. We define routes on it, then mount it
// in server.js with `app.use("/api/auth", router)`.
const router = express.Router();

// Apply Arcjet rate-limiting to ALL routes in this router.
// Every request to /api/auth/* will first pass through arcjetProtection.
// If the request exceeds the rate limit, Arcjet blocks it before it reaches the controller.
router.use(arcjetProtection);

// POST /api/auth/signup
// Creates a new user account. No authentication required (you're not logged in yet).
// Request body: { email, fullName, password }
// Response: { _id, email, fullName, profilePic } (user object) + sets JWT cookie
router.post("/signup", signup);

// POST /api/auth/login
// Authenticates a user with email + password.
// Request body: { email, password }
// Response: { _id, email, fullName, profilePic } (user object) + sets JWT cookie
router.post("/login", login);

// POST /api/auth/logout
// Logs out the user by clearing the JWT cookie.
// No request body needed — the cookie is sent automatically by the browser.
// Response: { message: "Logged out successfully" }
router.post("/logout", logout);

// PUT /api/auth/update-profile
// Updates the user's profile picture.
// IMPORTANT: protectRoute is placed BEFORE updateProfile in the argument list.
// Express runs middleware in order: protectRoute → updateProfile.
// If protectRoute fails (no valid JWT), updateProfile never runs.
// Request body: { profilePic: "base64-encoded-image" }
// Response: Updated user object
router.put("/update-profile", protectRoute, updateProfile);

// GET /api/auth/check
// Checks if the user is currently authenticated (valid JWT cookie exists).
// Used by the frontend on page load to determine: "Should I show login or chat page?"
// protectRoute ensures only logged-in users can access this.
// Response: The authenticated user object (req.user, set by protectRoute middleware)
//
// The inline arrow function `(req, res) => res.status(200).json(req.user)` is the controller.
// For simple endpoints, we don't need a separate function in the controller file.
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

// Export the router so server.js can mount it at /api/auth.
export default router;
