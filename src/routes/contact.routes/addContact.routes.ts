import express from "express";
import addContact from "../../controllers/contacts/addContact.controller.js";

const addContactRouter = express.Router();

addContactRouter.route("/contact/add-contact").post(addContact)

export default addContactRouter