import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");
import { Database } from "./helpers/Database";

import { IndexRoute } from "./routes/index";
import { IMetric } from "./interfaces/metric";
import { IModel } from "./models/model";
import { IMetricModel } from "./models/metric";

import { adapterSchema } from "./schemas/adapter";
import { metricSchema } from "./schemas/metric";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  private model: IModel; //an instance of IModel

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.model = Object();
    this.app = express();
    this.config(); // await
    this.routes();
    this.api();
  }

  /** Create REST API routes */
  public api() {
    //empty for now
  }

  /** Configure application */
  public async config() {
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //configure pug
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");

    //mount logger
    this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //mount override
    this.app.use(methodOverride());

    //connect to mongoose
    let connection: mongoose.Connection = await Database.start();

    //create models
    this.model.metric = connection.model<IMetricModel>("Metric", metricSchema);

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }

  /** Create and return Router */
  private routes() {
    let router: express.Router;
    router = express.Router();

    IndexRoute.create(router);
    this.app.use(router);
  }

}

Server.bootstrap();