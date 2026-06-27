import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  const tabs = [
    { key: "chats", label: "Chats" },
    { key: "groups", label: "Groups" },
    { key: "contacts", label: "Contacts" },
  ];

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`tab ${
            activeTab === key ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
export default ActiveTabSwitch;
