import { Document } from "mongoose";
import { IAdapter } from "../interfaces/adapter";

export interface IAdapterModel extends IAdapter, Document {
  //custom methods for your model would be defined here
}
