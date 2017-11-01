import { Document } from "mongoose";
import { IMetric } from "../interfaces/metric";

export interface IMetricModel extends IMetric, Document {
  //custom methods for your model would be defined here
}
