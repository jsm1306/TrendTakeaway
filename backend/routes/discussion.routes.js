import express from "express";
import {getDiscussions,createDiscussion,replyToDiscussion,likeDiscussion, deleteDiscussion, updateDiscussion} from "../controllers/discussion.controller.js";

const router = express.Router();

router.get("/", getDiscussions);
router.post("/", createDiscussion);
router.post("/:id/reply", replyToDiscussion);
router.post("/:id/like", likeDiscussion);
router.delete("/:id", deleteDiscussion);
router.put("/:id", updateDiscussion);

export default router;
