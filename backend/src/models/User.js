// ========================================
// USER MODEL — User.js
// ========================================
// This file defines what a "User" looks like in our MongoDB database.
// Think of a schema as a blueprint — it specifies:
//   - What fields a user has (email, fullName, password, profilePic)
//   - What type each field is (String, Number, etc.)
//   - Validation rules (required, unique, minlength, default values)
//
// When a user signs up, we create a new "document" (row) in the "users" collection
// that follows this blueprint. Mongoose enforces these rules automatically.
//
// MongoDB collections are pluralized — mongoose.model("User") creates a "users" collection.
// ========================================

// mongoose: Imported to use .Schema() (define structure) and .model() (create model).
import mongoose from "mongoose";

// userSchema: The blueprint for a User document.
// mongoose.Schema() takes an object where each key is a field name
// and the value is its configuration (type, validation, defaults).
const userSchema = new mongoose.Schema(
  {
    // email: The user's email address. Used for login (unique identifier).
    // - type: String — stores text
    // - required: true — signup will fail if email is missing
    // - unique: true — MongoDB creates an index to prevent duplicate emails
    //   If someone tries to sign up with an existing email, MongoDB throws an error.
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // fullName: The user's display name (e.g., "Rudraksh Patel").
    // Shown in chat headers, contact lists, etc.
    // - required: true — every user must have a name
    fullName: {
      type: String,
      required: true,
    },

    // password: The user's hashed password (NEVER stored in plain text).
    // - required: true — signup requires a password
    // - minlength: 6 — passwords shorter than 6 characters are rejected
    //   This is enforced at the database level by Mongoose.
    // IMPORTANT: The password stored in the database is hashed using bcrypt
    // (done in auth.controller.js before saving). The raw password is NEVER saved.
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // profilePic: URL to the user's profile picture (stored on Cloudinary).
    // - type: String — stores the image URL (e.g., "https://res.cloudinary.com/...")
    // - default: "" — if no picture is uploaded, it defaults to an empty string.
    //   The frontend falls back to "/avatar.png" when this is empty.
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    // timestamps: true — Mongoose automatically adds two fields:
    //   - createdAt: The date/time when the user was created (signup time)
    //   - updatedAt: The date/time when the user was last modified (e.g., profile update)
    // These are managed automatically — you don't need to set them manually.
    timestamps: true,
  }
);

// mongoose.model("User", userSchema): Creates the User model from the schema.
// This model is what you use in your code to interact with the "users" collection:
//   - User.create({ email, fullName, password }) — creates a new user
//   - User.findOne({ email }) — finds a user by email
//   - User.findById(id) — finds a user by their MongoDB _id
//   - User.updateOne({ _id }, { profilePic: url }) — updates a user
//
// The first argument "User" is the model name (Mongoose pluralizes it to "users" for the collection).
// The second argument is the schema that defines the document structure.
const User = mongoose.model("User", userSchema);

// Export the model so other files can use it:
//   - auth.controller.js uses it for signup/login
//   - message.controller.js uses it to find chat partners
export default User;
