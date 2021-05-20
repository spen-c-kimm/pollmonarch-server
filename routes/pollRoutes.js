const express = require("express");
const pollController = require("./../controllers/pollController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(pollController.getAllPolls)
  .post(pollController.createPoll);

router.route("/tag").post(pollController.queryAllPolls);

router
  .route("/:id")
  .get(pollController.getPoll)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    pollController.updatePoll
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    pollController.deletePoll
  );

module.exports = router;
