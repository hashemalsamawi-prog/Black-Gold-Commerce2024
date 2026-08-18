import { Router, type Request, type Response } from "express";
import { db, categoriesTable } from "@workspace/db";

const router = Router();

router.get(
  "/categories",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const rows = await db
        .select()
        .from(categoriesTable)
        .orderBy(categoriesTable.nameEn);

      res.json(rows);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      res.status(500).json({
        error: "Failed to fetch categories",
      });
    }
  },
);

export default router;
