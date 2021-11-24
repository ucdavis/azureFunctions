import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { performance } from "perf_hooks";
import * as OSRM from "osrm";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const t0 = performance.now();
  context.log("HTTP trigger function processed a request.");

  console.log("connected to db. connected to osrm...");

  const osrm = new OSRM("/data/california-latest.osrm");

  console.log("connected to osrm");

  const routeOptions: OSRM.RouteOptions = {
    coordinates: [
      [-120.26927957404408, 37.51724027533974],
      [-121.275182, 39.491964],
    ],
    annotations: ["duration", "distance"],
  };

  const osrmRouteQuery = new Promise((resolve, reject) => {
    osrm.route(routeOptions, async (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });

  const osrmResult = await osrmRouteQuery;

  const t1 = performance.now();

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      osrm: osrmResult,
      time: t1 - t0,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default httpTrigger;
