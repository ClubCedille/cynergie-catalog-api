import { NextFunction, Request, Response, Router } from "express";
import { Model } from "mongoose";
import { IMetricModel } from "../models/metric";

export class MetricRoute {

    // TODO not static
    private static model: Model<IMetricModel>;

    static create(router: Router, model: Model<IMetricModel>) {
        MetricRoute.model = model;

        router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
            MetricRoute.getMetric(req, res, next);
        });

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            MetricRoute.addNewMetric(req, res, next);
        });
    }

    protected static getMetric(req: Request, res: Response, next: NextFunction) {
        MetricRoute.model.findById(req.params.id).then(c => res.send(c));

    }

    protected static addNewMetric(req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        MetricRoute.model.create({
            configuration: {},
            properties: {},
            ...req.body
        }).then(c => res.send(c));
    }
}
