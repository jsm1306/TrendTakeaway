import express from "express";
import {getDiscussions,createDiscussion,replyToDiscussion,likeDiscussion} from "../controllers/discussion.controller.js";

const router = express.Router();

router.get("/", getDiscussions);
router.post("/", createDiscussion);
router.post("/:id/reply", replyToDiscussion);
router.post("/:id/like", likeDiscussion);

export default router;
