import { Model } from "mongoose";
import { IAdapterModel } from "./adapter";
import { IMetricModel } from "./metric";

export interface IModel {
    adpater: Model<IAdapterModel>;
    metric: Model<IMetricModel>;
}
