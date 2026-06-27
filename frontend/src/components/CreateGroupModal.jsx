import { useState, useEffect } from "react";
import { XIcon, UsersIcon, RadioIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { useGroupStore } from "../store/useGroupStore";
import toast from "react-hot-toast";

function CreateGroupModal({ onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("group"); // "group" or "broadcast"
  const [contacts, setContacts] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  const { createGroup } = useGroupStore();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axiosInstance.get("/messages/contacts");
        setContacts(res.data);
      } catch (error) {
        toast.error("Failed to load contacts.");
      } finally {
        setIsLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Group name is required.");
    if (selectedMembers.length === 0) return toast.error("Select at least one member.");

    setIsSubmitting(true);
    const result = await createGroup({ name: name.trim(), type, memberIds: selectedMembers });
    setIsSubmitting(false);

    if (result) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col border border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-slate-200">Create New</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Name input */}
            <div>
              <label className="auth-input-label">
                {type === "broadcast" ? "Broadcast Name" : "Group Name"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder={type === "broadcast" ? "e.g., Announcements" : "e.g., Friends"}
                maxLength={60}
              />
            </div>

            {/* Type toggle */}
            <div>
              <label className="auth-input-label">Type</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setType("group")}
                  className={`flex-1 py-3 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    type === "group"
                      ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                      : "border-slate-600 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <UsersIcon className="w-4 h-4" />
                  Group Chat
                </button>
                <button
                  type="button"
                  onClick={() => setType("broadcast")}
                  className={`flex-1 py-3 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    type === "broadcast"
                      ? "border-amber-500 bg-amber-500/20 text-amber-300"
                      : "border-slate-600 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <RadioIcon className="w-4 h-4" />
                  Broadcast
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {type === "broadcast"
                  ? "Only you can send messages. Members reply privately to you."
                  : "All members can send messages to the group."}
              </p>
            </div>

            {/* Member selection */}
            <div>
              <label className="auth-input-label">
                Add Members{" "}
                <span className="text-slate-400 font-normal">
                  ({selectedMembers.length} selected)
                </span>
              </label>
              {isLoadingContacts ? (
                <p className="text-slate-400 text-sm py-4 text-center">Loading contacts...</p>
              ) : contacts.length === 0 ? (
                <p className="text-slate-400 text-sm py-4 text-center">No contacts available.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {contacts.map((contact) => {
                    const isSelected = selectedMembers.includes(contact._id);
                    return (
                      <button
                        key={contact._id}
                        type="button"
                        onClick={() => toggleMember(contact._id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                          isSelected
                            ? "bg-cyan-500/20 border border-cyan-500/50"
                            : "bg-slate-700/50 border border-transparent hover:bg-slate-700"
                        }`}
                      >
                        <div className="size-9 rounded-full overflow-hidden flex-shrink-0 bg-slate-600">
                          <img
                            src={contact.profilePic || "/avatar.png"}
                            alt={contact.fullName}
                            className="size-full object-cover"
                          />
                        </div>
                        <span className="text-slate-200 text-sm font-medium truncate">
                          {contact.fullName}
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-cyan-400 text-xs font-bold">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || selectedMembers.length === 0}
              className="auth-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : `Create ${type === "broadcast" ? "Broadcast" : "Group"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;
