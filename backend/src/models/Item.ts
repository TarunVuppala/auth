import { Schema, model, type Document, type Types } from "mongoose";

export interface ItemDocument extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<ItemDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

itemSchema.index({ title: "text", description: "text" });

export const Item = model<ItemDocument>("Item", itemSchema);
