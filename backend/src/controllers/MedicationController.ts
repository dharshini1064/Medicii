import { Request, Response } from "express";
import { MedicationService } from "../services/MedicationService";

const medicationService = new MedicationService();

export class MedicationController {
  async listForUser(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ message: "userId is required" });
      
      const medications = await medicationService.getAllByUserId(userId as string);
      res.json(medications);
    } catch (error) {
      res.status(500).json({ message: "Error listing medications", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const medication = await medicationService.create(req.body);
      res.status(201).json(medication);
    } catch (error) {
      res.status(500).json({ message: "Error creating medication", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const medication = await medicationService.update(id, req.body);
      if (!medication) return res.status(404).json({ message: "Medication not found" });
      res.json(medication);
    } catch (error) {
      res.status(500).json({ message: "Error updating medication", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await medicationService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting medication", error });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const medication = await medicationService.getById(id);
      if (!medication) return res.status(404).json({ message: "Medication not found" });
      res.json(medication);
    } catch (error) {
      res.status(500).json({ message: "Error getting medication", error });
    }
  }
}
