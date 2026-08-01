import { clerkClient, getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

export const ADMIN_EMAIL = "vanshalmadhau@gmail.com";

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const primaryEmail = user.primaryEmailAddress?.emailAddress.toLowerCase();

    if (primaryEmail !== ADMIN_EMAIL) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    next();
  } catch {
    res.status(403).json({ error: "Unable to verify admin access" });
  }
};