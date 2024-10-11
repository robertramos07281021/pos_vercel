import { Router } from "express";
import {
  addStock,
  cancelCustomer,
  cancelTransaction,
  createCustomer,
  createOrder,
  createProduct,
  createTransaction,
  deleteTransactionOrder,
  findTransactionOrders,
  getAllProduct,
  getStocks,
  getTransaction,
  payment,
  sumTransaction,
  updateOrderQty,
  updateProduct,
  updateStock,
  stockLocked,
  stockUnlocked,
  ascendingStocks,
  descendingStocks,
  getAllTransaction,
  getSalesToday,
  getSalesQuery,
  salesPerYearQuery,
  sortSalesQty,
  paggination,
} from "../controllers/posController.js";
import authenticate from "../../middleware/autheMiddleware.js";

const router = Router();

// product routers
router.post("/product", authenticate, createProduct);
router.patch("/product/:id", authenticate, updateProduct);
router.get("/product", authenticate, getAllProduct);

// customer router
router.post("/customer", authenticate, createCustomer);
router.delete("/customer/:id", cancelCustomer);

//transaction router
router.post("/transaction", authenticate, createTransaction);
router.delete("/transaction/:id", authenticate, cancelTransaction);
router.get("/transaction/:id", authenticate, getTransaction);
router.get("/transaction/sum/:id", authenticate, sumTransaction);
router.get("/transactions", authenticate, getAllTransaction);

//order router
router.post("/order", authenticate, createOrder);
router.patch("/order/:id", authenticate, updateOrderQty);
router.get("/order/:id", authenticate, findTransactionOrders);
router.delete("/order/:id", authenticate, deleteTransactionOrder);

//stock router
router.post("/stock/:productId", authenticate, addStock);
router.patch("/stock/:id", authenticate, updateStock);
router.get("/stocks", authenticate, getStocks);
router.put("/stock/:id/locked", authenticate, stockLocked);
router.put("/stock/:id/unlocked", authenticate, stockUnlocked);
router.get("/stocks/ascending", authenticate, ascendingStocks);
router.get("/stocks/descending", authenticate, descendingStocks);
router.post("/stocks/stock-sort", authenticate, sortSalesQty);

//payment router
router.put("/payment/:id", authenticate, payment);

//sales
router.get("/sales/today", authenticate, getSalesToday);
router.post("/sales", authenticate, getSalesQuery);
router.post("/sales/year", authenticate, salesPerYearQuery);

//pagination
router.get("/transactions/page/:id", paggination);

export { router as posRouter };
