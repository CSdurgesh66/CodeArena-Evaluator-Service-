import express from "express";

import { ping } from "../../controllers/pingController";

const pingRouter = express.Router();

pingRouter.use("/",ping);

export default pingRouter;