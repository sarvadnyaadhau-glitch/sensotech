import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/me", (req, res) => {
  res.json({ isAdmin: true });
});

export default router;