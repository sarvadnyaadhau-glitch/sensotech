import { Router, type IRouter } from "express";
import healthRouter from "./health";
import farmAIRouter from "./farm-ai";
import cropPlanRouter from "./crop-plan";
import adminRouter from "./admin";
import { requireAdmin } from "../lib/admin";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/farm-ai", requireAuth, farmAIRouter);
router.use("/crop-plan", requireAuth, cropPlanRouter);
router.use("/admin", requireAdmin, adminRouter);

export default router;
