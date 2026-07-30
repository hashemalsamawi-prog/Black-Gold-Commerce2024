import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import categoriesRouter from "./categories.js";
import productsRouter from "./products.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import customersRouter from "./customers.js";
import wholesaleRouter from "./wholesale.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(customersRouter);
router.use(wholesaleRouter);

export default router;
