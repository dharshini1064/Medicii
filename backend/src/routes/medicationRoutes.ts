import express from "express";
import { MedicationController } from "../controllers/MedicationController";

const router = express.Router();
const medicationController = new MedicationController();

router.get("/", (req, res) => medicationController.listForUser(req, res));
router.post("/", (req, res) => medicationController.create(req, res));
router.get("/:id", (req, res) => medicationController.getOne(req, res));
router.put("/:id", (req, res) => medicationController.update(req, res));
router.delete("/:id", (req, res) => medicationController.delete(req, res));

export default router;
