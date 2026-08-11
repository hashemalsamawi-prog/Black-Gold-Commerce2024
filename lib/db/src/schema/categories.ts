import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router = Router();

router.get("/categories", async (_req: any, res: any): Promise<void> => {
  const rows = await db
    .select()
    .from(categoriesTable)
    .orderBy(categoriesTable.nameEn);

  res.json(ListCategoriesResponse.parse(rows));
});

export default router;
