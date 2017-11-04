import * as bodyParser from "body-parser";
import errorHandler = require("errorhandler");
import * as express from "express";
import methodOverride = require("method-override");
import mongoose = require("mongoose");
import * as logger from "morgan";
import * as path from "path";
import { Database } from "./helpers/Database";

import { IMetric } from "./interfaces/metric";
import { IMetricModel } from "./models/metric";
import { IModel } from "./models/model";

import { adapterSchema } from "./schemas/adapter";
import { metricSchema } from "./schemas/metric";

import { IndexRoute } from "./routes/index";
import { MetricRoute } from "./routes/metric";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;

    private model: IModel; // an instance of IModel

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(connection: mongoose.Connection): Server {
        return new Server(connection);
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(connection: mongoose.Connection) {
        this.model = Object();
        this.app = express();
        this.config(connection); // await
        this.routes();

        this.app.listen(3000, () => console.log("Opened at http://localhost:3000"));
    }

    /** Configure application */
    public async config(connection: mongoose.Connection) {
        // mount logger
        this.app.use(logger("dev"));

        // mount json form parser
        this.app.use(bodyParser.json());

        // mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        // mount override
        this.app.use(methodOverride());

        // create models
        this.model.metric = connection.model<IMetricModel>("Metric", metricSchema);

        // catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        // error handling
        this.app.use(errorHandler());
    }

    /** Create and return Router */
    private routes() {
        const indexRouter = express.Router();
        IndexRoute.create(indexRouter);
        this.app.use("/", indexRouter);

        const metricRouter = express.Router();
        MetricRoute.create(metricRouter, this.model.metric);
        this.app.use("/metrics", metricRouter);
    }
}

// connect to mongoose
Database.start()
    .then(c => Server.bootstrap(c))
    .catch(err => console.warn("Serveur error:", err))
