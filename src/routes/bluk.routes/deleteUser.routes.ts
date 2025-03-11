import express from "express";
import deleteUser from "../../controllers/blukmail/deleteUser.controller.js";

const deleteUserRouter = express.Router();

// Route to delete a user by email (from params or query)
deleteUserRouter.delete("/delete-user/:agentId?", deleteUser);

export default deleteUserRouter;
