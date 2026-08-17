import { Router } from "express";
import {
  db,
  categoriesTable,
} from "@workspace/db";

import { z } from "zod";

const router = Router();

const CategoryResponse = z.object({
  id: z.number(),
  nameAr: z.string(),
  nameEn: z.string(),
  slug: z.string(),
  imageUrl: z.string().nullable(),
  productCount: z.number(),
  createdAt: z.coerce.date(),
});

const ListCategoriesResponse = z.array(CategoryResponse);

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(categoriesTable)
    .orderBy(categoriesTable.nameEn);

  res.json(ListCategoriesResponse.parse(rows));
});

export default router;
