import { Router, type IRouter } from "express";
import healthRouter from "./health";
import farmAIRouter from "./farm-ai";
import cropPlanRouter from "./crop-plan";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/farm-ai", farmAIRouter);
router.use("/crop-plan", cropPlanRouter);

export default router;
