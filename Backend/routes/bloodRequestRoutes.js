import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  createBloodRequest,
  deleteBloodRequest,
  listBloodRequests,
  updateBloodRequestStatus,
} from "../controllers/bloodRequestController.js";

const router = express.Router();

// user submits
router.post("/", protect, createBloodRequest);

// admin views/manages
router.get("/", protect, adminOnly, listBloodRequests);
router.put("/:id/status", protect, adminOnly, updateBloodRequestStatus);
router.delete("/:id", protect, adminOnly, deleteBloodRequest);

export default router;

