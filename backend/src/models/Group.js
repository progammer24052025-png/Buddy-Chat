// ========================================
// GROUP MODEL — Group.js
// ========================================
// This file defines what a "Group" looks like in our MongoDB database.
// A Group can be of two types:
//   1. "group" — All members can send messages (like WhatsApp groups)
//   2. "broadcast" — Only the admin can send messages (like Telegram channels).
//      Members can only read and reply privately to the admin.
//
// Groups have an admin (creator) who controls membership, and a list of members.
// Group messages are stored in a SEPARATE model (GroupMessage), not in the Message model.
// ========================================

// mongoose: Imported for Schema definition and ObjectId type (for referencing Users).
import mongoose from "mongoose";

// groupSchema: The blueprint for a Group document.
const groupSchema = new mongoose.Schema(
  {
    // name: The display name of the group (e.g., "Family Group", "Project Updates").
    // - type: String — stores the group name
    // - required: true — every group must have a name
    // - trim: true — removes leading/trailing whitespace
    // - maxlength: 60 — limits name to 60 characters to prevent abuse
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    // avatar: URL to the group's profile picture (stored on Cloudinary).
    // - type: String — stores the image URL
    // - default: "" — if no avatar is uploaded, defaults to empty string.
    //   The frontend shows the first letter of the group name as a fallback.
    avatar: {
      type: String,
      default: "",
    },

    // admin: The user who CREATED this group (or the broadcaster).
    // The admin has special privileges:
    //   - Add/remove members
    //   - Delete the group
    //   - In broadcasts: ONLY the admin can send messages
    // - type: ObjectId — references a User document
    // - ref: "User" — enables .populate("admin") to get full admin details
    // - required: true — every group must have an admin
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // members: An array of User ObjectIds who are part of this group.
    // - type: Array of ObjectId — each element references a User
    // - ref: "User" — enables .populate("members") to get full member details
    //
    // IMPORTANT: The admin is ALSO included in this array (they're a member too).
    // When checking if someone can access a group, we check if their ID is in this array.
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // type: Defines the group's behavior — either "group" or "broadcast".
    // - type: String — stores the type as text
    // - enum: ["group", "broadcast"] — ONLY these two values are allowed.
    //   Mongoose will reject any other value.
    //
    // Difference between the two:
    //   "group"     → All members can send messages (like WhatsApp)
    //   "broadcast" → Only admin can send; members can only read and reply privately (like Telegram channel)
    //
    // - default: "group" — if type is not specified during creation, it defaults to a regular group
    type: {
      type: String,
      enum: ["group", "broadcast"],
      default: "group",
    },
  },
  {
    // timestamps: true — Mongoose auto-adds createdAt and updatedAt.
    // createdAt shows when the group was created.
    timestamps: true,
  }
);

// mongoose.model("Group", groupSchema): Creates the Group model.
// This model is used to:
//   - Group.create({ name, admin, members, type }) — create a new group/broadcast
//   - Group.find({ members: userId }) — find all groups a user belongs to
//   - Group.findByIdAndUpdate(groupId, { $addToSet: { members: newUserId } })
//     — add a member to a group
//   - Group.findByIdAndDelete(groupId) — delete a group (admin only)
const Group = mongoose.model("Group", groupSchema);

// Export the model so other files can use it:
//   - group.controller.js uses it for creating/managing groups
//   - group.message.controller.js (or similar) uses it to verify group membership before sending messages
export default Group;
