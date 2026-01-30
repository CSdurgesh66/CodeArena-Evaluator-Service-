import express from "express";

import submissionRouter from "./submissionRoutes";
import pingRouter from "./pingRoute";

const v1Router = express.Router();

v1Router.use("/submissions",submissionRouter);
v1Router.use("/ping",pingRouter);


export default v1Router;