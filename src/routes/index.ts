import { NextFunction, Request, Response, Router } from "express";

export class IndexRoute {

    static create(router: Router) {
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            IndexRoute.index(req, res, next);
        });
    }

    protected static index(req: Request, res: Response, next: NextFunction) {
        // response
    }
}
