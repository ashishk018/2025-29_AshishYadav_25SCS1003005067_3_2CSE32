const express = require("express");
const router = express.Router();
const {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
} = require("../controllers/dealController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getDeals).post(createDeal);
router
  .route("/:id")
  .get(getDealById)
  .put(updateDeal)
  .delete(authorize("admin"), deleteDeal);

module.exports = router;
