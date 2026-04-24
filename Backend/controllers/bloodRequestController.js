import BloodRequest from "../models/BloodRequest.js";

export const createBloodRequest = async (req, res) => {
  try {
    const {
      verifiedPersonName,
      phone,
      email,
      patientName,
      bloodGroup,
      bloodRequestType,
      hospitalAddressWithPincode,
      locationAddress,
      requestImageUrl,
    } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const doc = await BloodRequest.create({
      user: req.user.id,
      verifiedPersonName,
      phone,
      email,
      patientName,
      bloodGroup,
      bloodRequestType,
      hospitalAddressWithPincode,
      locationAddress,
      requestImageUrl: requestImageUrl || "",
    });

    res.status(201).json({ message: "Blood request submitted", request: doc });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit blood request", error: error.message });
  }
};

export const listBloodRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await BloodRequest.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blood requests", error: error.message });
  }
};

export const updateBloodRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await BloodRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Blood request not found" });

    res.status(200).json({ message: "Status updated", request: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

export const deleteBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BloodRequest.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Blood request not found" });
    res.status(200).json({ message: "Blood request deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blood request", error: error.message });
  }
};

