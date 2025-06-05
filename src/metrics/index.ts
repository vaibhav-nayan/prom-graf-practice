import { activeRequestsGauge, requestCounter } from "./requestCount";
import {Request, Response, NextFunction} from "express";
import { httpRequestDurationMicroseconds } from "./requestTime";

export const metricsMiddleware = (req : Request, res: Response, next: NextFunction) =>{
    const startTime = Date.now();
    activeRequestsGauge.inc();

    res.on('finish', () =>{
        const endTime = Date.now();
        const duration = endTime - startTime;

        // increment request counter
        requestCounter.inc({
            method : req.method,
            route: req.route? req.route.path : req.path,
            status_code: res.statusCode
        })

        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);


        activeRequestsGauge.dec();
    })
    next();
}