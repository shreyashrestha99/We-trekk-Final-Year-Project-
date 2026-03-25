import Group from "../models/Group.js";
import GroupMember from "../models/GroupMember.js";

// GET /api/groups
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ status: "Open" }).populate("schedule_id").populate("created_by");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/groups
export const createGroup = async (req, res) => {
  try {
    const group = new Group({
      ...req.body,
      created_by: req.user.id // assuming token id matches Vendor user_id
    });
    const createdGroup = await group.save();
    res.status(201).json(createdGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/groups/:id/join
export const joinGroup = async (req, res) => {
  try {
    const { trekker_id, needs_transport, needs_accommodation, needs_guide } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group || group.status !== "Open") return res.status(400).json({ message: "Group not available" });

    const member = new GroupMember({
      group_id: group._id,
      trekker_id,
      needs_transport,
      needs_accommodation,
      needs_guide
    });
    const joined = await member.save();
    
    // Increment member count based on backend rule
    group.current_members += 1;
    if (group.current_members >= group.max_members) group.status = "Full";
    await group.save();

    res.status(201).json(joined);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/groups/:id/approve/:memberId
export const approveMember = async (req, res) => {
  try {
    const member = await GroupMember.findByIdAndUpdate(
      req.params.memberId,
      { joined_status: "Confirmed" },
      { new: true }
    );
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
