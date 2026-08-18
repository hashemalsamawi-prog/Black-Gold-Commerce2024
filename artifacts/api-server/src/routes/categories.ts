import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db/schema";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(categoriesTable)
    .orderBy(categoriesTable.nameEn);

  res.json(ListCategoriesResponse.parse(rows));
});

export default router;
