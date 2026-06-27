import { useEffect, useState } from "react";
import { useGroupStore } from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { UsersIcon, RadioIcon, PlusIcon } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

function GroupsList() {
  const { getMyGroups, groups, isGroupsLoading, setSelectedGroup, groupUnreadCounts } = useGroupStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    getMyGroups();
  }, [getMyGroups]);

  if (isGroupsLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {/* Create group button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full bg-cyan-500/20 p-3 rounded-lg cursor-pointer hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 text-cyan-400 font-medium text-sm mb-2"
      >
        <PlusIcon className="w-4 h-4" />
        New Group / Broadcast
      </button>

      {groups.length === 0 ? (
        <div className="text-center text-slate-400 text-sm py-8">
          <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No groups yet.</p>
          <p className="text-xs mt-1">Create one to get started.</p>
        </div>
      ) : (
        groups.map((group) => {
          const unreadCount = groupUnreadCounts[group._id] || 0;
          return (
            <div
              key={group._id}
              className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
              onClick={() => {
                setSelectedGroup(group);
                useChatStore.getState().setSelectedUser(null);  // clear 1:1 selection
              }}
            >
              <div className="flex items-center gap-3">
                {/* Group avatar */}
                <div className="size-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {group.avatar ? (
                    <img src={group.avatar} alt={group.name} className="size-full object-cover" />
                  ) : (
                    <span className="text-slate-300 font-bold text-lg">
                      {group.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-slate-200 font-medium truncate">{group.name}</h4>
                    {group.type === "broadcast" && (
                      <RadioIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-400 text-xs truncate">
                    {group.members?.length || 0} member{(group.members?.length || 0) !== 1 ? "s" : ""}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <span className="bg-cyan-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}

      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} />}
    </>
  );
}

export default GroupsList;
