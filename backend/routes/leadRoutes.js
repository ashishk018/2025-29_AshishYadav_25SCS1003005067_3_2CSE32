const express = require("express");
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getLeads).post(createLead);
router
  .route("/:id")
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize("admin"), deleteLead);

module.exports = router;
