import { suite, test } from "mocha-typescript";
import mongoose = require("mongoose");
import { IMetric } from "../interfaces/metric";
import { IMetricModel } from "../models/metric";
import { metricSchema } from "../schemas/metric";

@suite
class MetricTest {

    //store test data
    private data: IMetric;

    //the Metric model
    public static Metric: mongoose.Model<IMetricModel>;

    public static before() {
        //connect to mongoose and create model
        const MONGODB_CONNECTION: string = "mongodb://localhost:27017/heros";
        const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
        MetricTest.Metric = connection.model<IMetricModel>("User", metricSchema);

        //require chai and use should() assertions
        require("chai").should();
    }

    constructor() {
        this.data = {
            configuration: {},
            frequency: "00:05:00.000",
            name: "Test Metric",
            properties: { complex: "object" },
            unit: "A"
        };
    }

    @test("should create a new Metric")
    public create() {
        //create metric and return promise
        return new MetricTest.Metric(this.data).save().then(result => {
            //verify _id property exists
            result._id.should.exist;

            result.configuration.should.equal(this.data.configuration);
            result.frequency.should.equal(this.data.frequency);
            result.name.should.equal(this.data.name);
            result.properties.should.equal(this.data.properties);
            result.unit.should.equal(this.data.unit);
        });
    }
}
