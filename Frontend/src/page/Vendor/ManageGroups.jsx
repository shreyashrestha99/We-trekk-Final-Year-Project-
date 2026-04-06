import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/vendor/dashboard" },
  { label: "My Treks", icon: "🏔️", path: "/vendor/treks" },
  { label: "My Rides", icon: "🚙", path: "/vendor/rides" },
  { label: "My Schedules", icon: "📅", path: "/vendor/schedules" },
  { label: "My Groups", icon: "👥", path: "/vendor/groups" },
  { label: "Bookings", icon: "📋", path: "/vendor/bookings" },
  { label: "Earnings", icon: "💰", path: "/vendor/earnings" },
  { label: "My Profile", icon: "👤", path: "/vendor/profile" },
];

function ManageGroups() {
  const [groups, setGroups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({
    group_name: "",
    schedule_id: "",
    max_members: "",
    meeting_point: "",
    include_transport: false,
    include_guide: false,
    include_accommodation: false,
    notes: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [groupsRes, schedulesRes] = await Promise.all([
        API.get("/api/groups/vendor/my-groups"),
        API.get("/api/schedules/vendor/my-schedules")
      ]);
      setGroups(groupsRes.data);
      setSchedules(schedulesRes.data);
    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!form.group_name || !form.schedule_id || !form.max_members) {
      alert("Please fill in the required fields (Name, Schedule, Max Members).");
      return;
    }
    try {
      await API.post("/api/groups", form);
      alert("Group created successfully!");
      setShowForm(false);
      fetchData(); // refresh list
      setForm({
        group_name: "", schedule_id: "", max_members: "", meeting_point: "",
        include_transport: false, include_guide: false, include_accommodation: false, notes: ""
      });
    } catch (error) {
      alert("Failed to create group. Please try again.");
    }
  };

  const approveGroupMember = async (groupId, memberId) => {
    try {
      await API.put(`/api/groups/${groupId}/approve/${memberId}`);
      alert("Member Approved Successfully!");
      fetchData(); // refresh state
    } catch (error) {
      alert("Failed to approve member");
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Group Collaboration</p>
          <h1 className="text-3xl font-black text-white mt-1">Managed Groups</h1>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="px-4 py-2 rounded-md font-bold text-sm" 
          style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
        >
          {showForm ? "Close Form" : "+ Create Group"}
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-xl mb-6" style={{ backgroundColor: "#1A2235", border: "1px solid #AAFF00" }}>
          <h2 className="text-lg font-bold text-white mb-4">Create New Group</h2>
          <form onSubmit={handleCreateGroup} className="grid md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-white">Select Associated Schedule</label>
              <select 
                className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" 
                value={form.schedule_id} 
                onChange={e => setForm({ ...form, schedule_id: e.target.value })}
              >
                <option value="">-- Choose a Schedule --</option>
                {schedules.map(sch => (
                  <option key={sch._id} value={sch._id}>
                    {sch.trek_id?.trek_name || "Unknown Trek"} - {new Date(sch.start_date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Group Name</label>
              <input type="text" placeholder="e.g. Peak Baggers Beta" className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" value={form.group_name} onChange={e => setForm({ ...form, group_name: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Max Members</label>
              <input type="number" placeholder="10" className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" value={form.max_members} onChange={e => setForm({ ...form, max_members: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Meeting Point</label>
              <input type="text" placeholder="e.g. Kathmandu Airport" className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" value={form.meeting_point} onChange={e => setForm({ ...form, meeting_point: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Special Notes</label>
              <input type="text" placeholder="Optional notes..." className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            <div className="md:col-span-2 flex space-x-6">
              <label className="flex items-center text-sm font-medium text-white">
                <input type="checkbox" className="mr-2" checked={form.include_transport} onChange={e => setForm({ ...form, include_transport: e.target.checked })} /> Include Transport
              </label>
              <label className="flex items-center text-sm font-medium text-white">
                <input type="checkbox" className="mr-2" checked={form.include_guide} onChange={e => setForm({ ...form, include_guide: e.target.checked })} /> Include Guide
              </label>
              <label className="flex items-center text-sm font-medium text-white">
                <input type="checkbox" className="mr-2" checked={form.include_accommodation} onChange={e => setForm({ ...form, include_accommodation: e.target.checked })} /> Include Accommodation
              </label>
            </div>

            <div className="md:col-span-2 flex space-x-3 mt-4">
              <button type="submit" className="px-6 py-2 rounded-md font-bold text-sm" style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}>Save Group</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
         <p className="text-white">Loading groups...</p>
      ) : groups.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
          <p className="text-5xl mb-4">👥</p>
          <p className="text-white font-bold text-xl">No active groups.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map(group => (
            <div key={group._id} className="p-6 rounded-xl border border-gray-800" style={{ backgroundColor: "#111827" }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-white">{group.group_name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${group.status === "Open" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                  {group.status}
                </span>
              </div>
              
              <div className="space-y-1 mb-4 border-b border-gray-800 pb-4">
                <p className="text-sm text-gray-400">Meeting Point: <span className="text-white">{group.meeting_point || "Not Set"}</span></p>
                <p className="text-sm text-gray-400">Linked Schedule ID: <span className="text-white text-xs">{group.schedule_id?._id}</span></p>
                <p className="text-sm text-gray-400 mt-2">Members: <span className="text-[#AAFF00] font-bold">{group.current_members} / {group.max_members}</span></p>
              </div>

              <h4 className="font-bold text-sm text-[#AAFF00] mb-3">Roster Requests:</h4>
              {group.members && group.members.length > 0 ? (
                <div className="space-y-3">
                  {group.members.map(member => (
                    <div key={member._id} className="flex justify-between items-center p-3 rounded-lg bg-[#1A2235]">
                      <div>
                        <p className="text-sm font-bold text-white">{member.trekker_id?.trekker_name || 'Trekker'}</p>
                        <p className="text-xs text-gray-400">Status: {member.joined_status}</p>
                      </div>
                      
                      {member.joined_status === "Pending" && (
                        <button 
                          onClick={() => approveGroupMember(group._id, member._id)}
                          className="px-3 py-1 text-xs font-bold rounded bg-[#AAFF00] text-[#0A0F1C]"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No members have joined yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageGroups;
