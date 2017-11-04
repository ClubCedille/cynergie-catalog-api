import { Schema } from "mongoose";

export const metricSchema: Schema = new Schema({
    name: { type: String, required: [true, "A config item name is required"] },
    unit: { type: String, required: [true, "A config item unit is required"] },
    frequency: { type: Number, required: [true, "A config item frequency is required"] },
    configuration: { type: Schema.Types.Mixed, required: [true, "A config object is required"] },
    properties: { type: Schema.Types.Mixed, required: [true, "A property object is required"] },
    createdAt: { type: Date, default: Date.now }
});

metricSchema.pre("save", next => {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});
