import { Router, type IRouter } from "express";
import healthRouter from "./health";
import farmAIRouter from "./farm-ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/farm-ai", farmAIRouter);

export default router;
