import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import GroupsList from "../components/GroupsList";
import ChatContainer from "../components/ChatContainer";
import GroupContainer from "../components/GroupContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const { selectedGroup } = useGroupStore();

  // Either a 1:1 chat or a group is open (mutual exclusion handled in child components)
  const isRightPanelOpen = selectedUser || selectedGroup;

  return (
    <div className="relative w-full max-w-6xl h-[calc(100dvh-2rem)]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE — hidden on mobile when a chat or group is open */}
        <div className={`w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex-col min-h-0 overflow-hidden ${isRightPanelOpen ? "hidden md:flex" : "flex"}`}>
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain">
            {activeTab === "chats" && <ChatsList />}
            {activeTab === "groups" && <GroupsList />}
            {activeTab === "contacts" && <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE — hidden on mobile when nothing is selected */}
        <div className={`flex-1 flex-col bg-slate-900/50 backdrop-blur-sm min-h-0 overflow-hidden ${isRightPanelOpen ? "flex" : "hidden md:flex"}`}>
          {selectedUser && <ChatContainer />}
          {selectedGroup && !selectedUser && <GroupContainer />}
          {!selectedUser && !selectedGroup && <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
