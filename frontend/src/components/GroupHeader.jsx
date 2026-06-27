import { ArrowLeftIcon, RadioIcon, UsersIcon } from "lucide-react";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";

function GroupHeader() {
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const { authUser } = useAuthStore();
  const isAdmin = selectedGroup?.admin?._id === authUser._id || selectedGroup?.admin === authUser._id;

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 px-6 py-3 flex-shrink-0">
      <div className="flex items-center space-x-3">
        {/* Back button — mobile only */}
        <button
          onClick={() => setSelectedGroup(null)}
          className="md:hidden text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        {/* Group avatar */}
        <div className="size-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
          {selectedGroup.avatar ? (
            <img src={selectedGroup.avatar} alt={selectedGroup.name} className="size-full object-cover" />
          ) : (
            <span className="text-slate-300 font-bold text-lg">
              {selectedGroup.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-slate-200 font-medium">{selectedGroup.name}</h3>
            {selectedGroup.type === "broadcast" && (
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <RadioIcon className="w-3 h-3" />
                Broadcast
              </span>
            )}
            {isAdmin && (
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            <UsersIcon className="w-3.5 h-3.5" />
            {selectedGroup.members?.length || 0} member{(selectedGroup.members?.length || 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Close button — desktop only */}
      <button
        onClick={() => setSelectedGroup(null)}
        className="hidden md:block text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default GroupHeader;
