import path from "path";
import { createRequire } from "module";
import cors, { CorsOptions } from "cors";
import express, { Application, RequestHandler } from "express";
import helmet from "helmet";
import { Server } from "socket.io";
// @ts-ignore
import msgParser from "socket.io-msgpack-parser";
import AppServer from "./entities/AppServer";
import Controller from "./controllers/Controller";
import GameServer from "./entities/GameServer";
import Global from "./entities/Global";
import HealthcheckController from "./controllers/HealthcheckController";
import IceServer from "./entities/IceServer";
import IceServerController from "./controllers/IceServerController";

const app: Application = express();
const port: string | number = Global.CONNECTION_PORT;
const server = new AppServer(app, port);

const whitelist = new RegExp(Global.ORIGIN_WHITELIST);

const io = new Server(server, {
  cookie: false,
  cors: {
    origin: whitelist,
    methods: ["GET", "POST"],
    credentials: true,
  },
  serveClient: false,
  maxHttpBufferSize: 1e7,
  parser: msgParser,
});

const corsConfig: CorsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || whitelist.test(origin)) {
      return callback(null, true);
    }
    const msg =
      "The CORS policy for this site does not allow access from the specified Origin.";
    return callback(new Error(msg), false);
  },
};

const iceServer = new IceServer();

const globalMiddleware: Array<RequestHandler> = [helmet({contentSecurityPolicy:false,crossOriginEmbedderPolicy:false}), cors(corsConfig)];

const controllers: Array<Controller> = [
  new HealthcheckController(),
  new IceServerController(iceServer),
];

server.loadMiddleware(globalMiddleware);
server.loadControllers(controllers);
const gameRoot = process.env.ANV_ROOT || path.resolve(process.cwd(), "../../..");
const requireModule = createRequire(import.meta.url);
requireModule(path.join(gameRoot,"server/campaign.cjs"))(app,express);
app.use("/tabuleiro",express.static(path.join(gameRoot,"tabuleiro")));
app.get("/tabuleiro/*", (_req,res)=>res.sendFile(path.join(gameRoot,"tabuleiro/index.html")));
app.use((req,res,next)=>{if(/^\/(ferramentas|server|data|tests)(\/|$)/.test(req.path))res.sendStatus(404);else next();});
app.use(express.static(gameRoot));
app.get("/play",(_req,res)=>res.sendFile(path.join(gameRoot,"game.html")));
app.get("/gm",(_req,res)=>res.sendFile(path.join(gameRoot,"gm.html")));

const httpServer = server.run();
const game = new GameServer(io);
game.initaliseSocketServer(httpServer);
game.run();

process.once("SIGTERM", () => {
  console.log("sigterm event");
  server.close(() => {
    console.log("http server closed");
  });

  io.close(() => {
    console.log("socket server closed");
    io.sockets.emit("server shutdown");
  });

  setTimeout(() => {
    process.exit(0);
  }, 3000).unref();
});

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});
