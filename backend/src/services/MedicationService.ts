import Medication, { IMedication } from "../models/Medication";
import mongoose from "mongoose";

export class MedicationService {
  async getAllByUserId(userId: string) {
    return await Medication.find({ userId: new mongoose.Types.ObjectId(userId) });
  }

  async create(data: Partial<IMedication>) {
    const medication = new Medication(data);
    return await medication.save();
  }

  async update(id: string, data: Partial<IMedication>) {
    return await Medication.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await Medication.findByIdAndDelete(id);
  }

  async getById(id: string) {
    return await Medication.findById(id);
  }
}
