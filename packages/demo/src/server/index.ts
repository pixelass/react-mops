import {Server} from "@ngineer/server";
import {serverRenderer} from "./renderer";

const server = new Server({renderer: serverRenderer});

server.start();
