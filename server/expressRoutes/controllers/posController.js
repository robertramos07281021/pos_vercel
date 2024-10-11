import Product from "../../model/products.js";
import Customer from "../../model/customers.js";
import Transaction from "../../model/transactions.js";
import Order from "../../model/orders.js";
import Stock from "../../model/stocks.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import mongoose from "mongoose";
import "dotenv/config.js";

// export default class POS_API {
//product ===================================================================================================
// ---- add product ----
export const createProduct = asyncHandler(async (req, res) => {
  const { product_name, barcode, description, price } = req.body;

  if (!product_name || !barcode || !price) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const existsProduct = await Product.findOne({ barcode });
  if (existsProduct)
    return res.status(400).json({ message: "Product is already exists" });

  try {
    const product = await Product.create({
      product_name,
      barcode,
      description,
      price: parseFloat(price).toFixed(2),
    });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- update product ----
export const updateProduct = asyncHandler(async (req, res) => {
  const { product_name, barcode, description, price } = req.body;

  if (!product_name || !barcode || !price)
    return res.status(400).json({ error: "All fields are required." });
  const findProductByBarcode = await Product.findOne({
    $and: [{ barcode: { $eq: barcode } }, { _id: { $ne: req.params.id } }],
  });
  if (findProductByBarcode)
    return res
      .status(400)
      .json({ message: "This barcode is already in used." });

  const findProduct = await Product.findById(req.params.id);
  if (!findProduct)
    return res.status(400).json({ error: "Product not exists." });
  try {
    await findProduct.updateOne({
      product_name,
      barcode,
      description,
      price,
    });
    return res.status(200).json({ message: "Product has been updated." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- getAllProduct ----
export const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const allProduct = await Product.find();
    return res.status(200).json(allProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//customer ==================================================================================================
// ---- new customer ----
export const createCustomer = asyncHandler(async (req, res) => {
  const { firstname, lastname } = req.body;
  if (!firstname || !lastname) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newCustomer = await Customer.create({
      firstname,
      lastname,
    });
    return res.status(200).json(newCustomer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- cancel customer ----
export const cancelCustomer = asyncHandler(async (req, res) => {
  const findCustomer = await Customer.findById(req.params.id);
  if (!findCustomer)
    return res.status(400).json({ error: "Customer not exists." });
  try {
    await Customer.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Cancel customers" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//transactions ===============================================================================================
// ---- new transaction ----
export const createTransaction = asyncHandler(async (req, res) => {
  const { customer_id } = req.body;

  if (!customer_id) {
    return res.status(400).json({ error: "Please add customer." });
  }
  const customer = await Customer.findById(customer_id);
  if (!customer)
    return res.status(404).json({ message: "Customer not exists" });

  function receiptNoGenerator() {
    let result = "";
    const number = "0123456789";
    for (let x = 0; x < 10; x++) {
      result += number.charAt(Math.floor(Math.random() * number.length));
    }
    return result.toString();
  }

  try {
    const newTransaction = await Transaction.create({
      customer_id: customer._id,
      receipt_no: receiptNoGenerator(),
    });
    await customer.updateOne({ transaction: newTransaction });
    return res.status(200).json(newTransaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- cancel transaction ----
export const cancelTransaction = asyncHandler(async (req, res) => {
  const findTransaction = await Transaction.findById(req.params.id);
  if (!findTransaction)
    return res.status(400).json({ error: "Transaction not exists." });
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Cancel transaction." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- getTransaction ----
export const getTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate({
      path: "orders",
      populate: {
        path: "product_id",
      },
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found." });

    return res.status(200).json(transaction);
  } catch (error) {}
});

// ---- transaction grand total compute ----
export const sumTransaction = asyncHandler(async (req, res) => {
  try {
    const totalPriceTransaction = await Order.aggregate([
      {
        $match: {
          transaction_id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $group: { _id: null, sum_val: { $sum: "$total" } },
      },
    ]);
    return res.status(200).json(totalPriceTransaction[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- get all transaction ----
export const getAllTransaction = asyncHandler(async (req, res) => {
  try {
    const transactions = await Transaction.find({
      amount: { $ne: null },
    })
      .populate("customer_id")
      .populate({ path: "orders", populate: { path: "product_id" } });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//order ======================================================================================================
// ----  create order  ----
export const createOrder = asyncHandler(async (req, res) => {
  const { transaction_id, barcode, qty } = req.body;

  if (!transaction_id || !barcode || !qty)
    return res.status(400).json({ message: "All fields are required." });

  const transaction = await Transaction.findById(transaction_id);
  if (!transaction)
    return res.status(400).json({ message: "Transaction not exists." });

  const product = await Product.findOne({ barcode });
  if (!product) return res.status(400).json({ message: "Product not exsits." });

  const orderExists = await Order.findOne({
    $and: [
      { transaction_id: { $eq: transaction_id } },
      { product_id: { $eq: product._id } },
    ],
  });

  if (orderExists) {
    try {
      await orderExists.updateOne({
        qty: parseInt(orderExists.qty) + parseInt(qty),
        total: (
          (parseInt(orderExists.qty) + parseInt(qty)) *
          parseFloat(product.price)
        ).toFixed(2),
      });
      return res.status(200).json(orderExists);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const newOrder = await Order.create({
        qty,
        product_id: product._id,
        transaction_id: transaction._id,
        total: (qty * product.price).toFixed(2),
        old_price: product.price,
      });

      transaction.orders.push(newOrder);
      await transaction.save();
      return res.status(200).json(newOrder);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
});

// ---- update order ----
export const updateOrderQty = asyncHandler(async (req, res) => {
  const findOrder = await Order.findById(req.params.id).populate("product_id");
  if (!findOrder) return res.status(400).json({ error: "Order not exists." });
  if (!req.body.qty)
    return res.status(400).json({ error: "Please entry quantity." });

  try {
    await findOrder.updateOne({
      qty: req.body.qty,
      total: req.body.qty * parseFloat(findOrder.product_id.price, 2),
    });
    return res.status(200).json({ message: "Successfully update order." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- delete order ----
export const deleteTransactionOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const findOrder = await Order.findById(id);
  if (!findOrder) return res.status(400).json({ error: "Order not exists." });

  await Order.findByIdAndDelete(id);
  return res.status(200).json({ message: "Successfully deleted order." });
});

// ---- find transaction orders ----
export const findTransactionOrders = asyncHandler(async (req, res) => {
  if (req.params.id !== "undefined") {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction)
        return res.status(404).json({ message: "Transaction not found" });
      const transactionOrders = await Order.find(
        {
          transaction_id: { $eq: req.params.id },
        },
        { product_id: true, qty: true, total: true }
      ).populate("product_id");

      return res.status(200).json(transactionOrders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
});

//payment =====================================================================================================

export const payment = asyncHandler(async (req, res) => {
  const { cash } = req.body;
  const { id } = req.params;

  if (!cash) return res.status(400).json({ error: "Please enter cash." });
  const transaction = await Transaction.findById(id).populate("orders");
  if (!transaction)
    return res.status(400).json({ error: "Transaction not exists" });
  const totalPriceTransaction = await Order.aggregate([
    {
      $match: {
        transaction_id: new mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $group: { _id: null, sum_val: { $sum: "$total" } },
    },
  ]);

  try {
    Array.from(transaction?.orders).forEach(async (element) => {
      await Stock.findOneAndUpdate(
        { product_id: { $eq: element.product_id } },
        {
          $inc: { qty: -element.qty, sales: element.qty },
        }
      );
    });
    await transaction.updateOne({
      cash: parseFloat(cash, 2).toFixed(2),
      change: (cash - totalPriceTransaction[0]?.sum_val).toFixed(2),
      amount: totalPriceTransaction[0].sum_val,
      vat_amount: ((totalPriceTransaction[0].sum_val / 1.12) * 0.12).toFixed(2),
      vat_sales: (totalPriceTransaction[0].sum_val / 1.12).toFixed(2),
    });
    return res.status(200).json({ message: "Thank you!" });
  } catch (error) {
    console.log(error);
  }
});

//stock =======================================================================================================
// ---- add stock ----
export const addStock = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const { productId } = req.params;
  if (!qty || !productId)
    return res.status(400).json({ error: "All fields are required." });

  const product = await Product.findById(productId);
  if (!product) return res.status(400).json({ error: "Product not exists." });

  try {
    const newStock = await Stock.create({
      qty: qty,
      product_id: productId,
    });
    return res.status(200).json(newStock);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- get all stock ----
export const getStocks = asyncHandler(async (req, res) => {
  try {
    const stocks = await Stock.find().populate("product_id");
    return res.status(200).json(stocks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- update stock ----
export const updateStock = asyncHandler(async (req, res) => {
  const findStock = await Stock.findById(req.params.id);
  if (!findStock) return res.status(500).json({ error: "Stock not exists" });

  try {
    await Stock.findByIdAndUpdate(req.params.id, { qty: req.body.qty });
    return res.status(200).json({ message: "successfully update" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- delete stock ----
export const deleteStocks = asyncHandler(async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock is not exists" });
    return res.status(200).json({ message: "Stock successfully deleted." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- stock locked ----
export const stockLocked = asyncHandler(async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, {
      isLocked: true,
    });
    return res.status(200).json({ message: "Stocked locked" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- stock unlocked ----
export const stockUnlocked = asyncHandler(async (req, res) => {
  const { firstCode, secondCode, thirdCode, fourthCode, fifthCode, sixthCode } =
    req.body;
  if (
    firstCode === process.env.EDIT_PASSWORD[0] &&
    secondCode === process.env.EDIT_PASSWORD[1] &&
    thirdCode === process.env.EDIT_PASSWORD[2] &&
    fourthCode === process.env.EDIT_PASSWORD[3] &&
    fifthCode === process.env.EDIT_PASSWORD[4] &&
    sixthCode === process.env.EDIT_PASSWORD[5]
  ) {
    try {
      const stock = await Stock.findByIdAndUpdate(req.params.id, {
        isLocked: false,
      });
      return res.status(200).json({ message: "Stocked unlocked" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ message: "Wrong passcode." });
  }
});

// ---- stock sort ascending ----
export const ascendingStocks = asyncHandler(async (req, res) => {
  try {
    const ascending = await Stock.find()
      .sort({ qty: 1 })
      .populate("product_id");
    return res.status(200).json(ascending);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export const sortSalesQty = asyncHandler(async (req, res) => {
  const { sort } = req.body;
  try {
    if (sort === true) {
      const ascending = await Stock.find()
        .sort({ sales: 1 })
        .populate("product_id");
      return res.status(200).json(ascending);
    } else if (sort === false) {
      const descending = await Stock.find()
        .sort({ sales: -1 })
        .populate("product_id");
      return res.status(200).json(descending);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ---- stock sort descending ----
export const descendingStocks = asyncHandler(async (req, res) => {
  try {
    const descending = await Stock.find()
      .sort({ qty: -1 })
      .populate("product_id");
    return res.status(200).json(descending);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//sales query =======================================================================================================

//---- sales today ----
export const getSalesToday = asyncHandler(async (req, res) => {
  const todaySales = await Transaction.aggregate([
    {
      $project: {
        _id: 1,
        receipt_no: 1,
        amount: 1,
        vat_amount: 1,
        vat_sales: 1,
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        date: { $dayOfMonth: "$createdAt" },
      },
    },
    {
      $match: {
        $and: [
          {
            year: {
              $eq: new Date().getFullYear(),
            },
          },
          {
            month: {
              $eq: new Date().getMonth() + 1,
            },
          },
          {
            date: {
              $eq: new Date().getDate(),
            },
          },
          {
            amount: {
              $ne: null,
            },
          },
        ],
      },
    },
  ]);

  const todaySalesTotal = await Transaction.aggregate([
    {
      $project: {
        _id: 1,
        receipt_no: 1,
        amount: 1,
        vat_amount: 1,
        vat_sales: 1,
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        date: { $dayOfMonth: "$createdAt" },
      },
    },
    {
      $match: {
        $and: [
          {
            year: {
              $eq: new Date().getFullYear(),
            },
          },
          {
            month: {
              $eq: new Date().getMonth() + 1,
            },
          },
          {
            date: {
              $eq: new Date().getDate(),
            },
          },
          {
            amount: {
              $ne: null,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        totalSum: { $sum: "$amount" },
        totalVatAmount: { $sum: "$vat_amount" },
        totalVatSales: { $sum: "$vat_sales" },
      },
    },
  ]);

  return res.status(200).json({ todaySales, todaySalesTotal });
});

// ---- sales with dates ----
export const getSalesQuery = asyncHandler(async (req, res) => {
  const { dateTo, dateFrom } = req.body;

  const dateToFormat = `${new Date(dateTo).getMonth() + 1}/${
    new Date(dateTo).getDate() + 1
  }/${new Date(dateTo).getFullYear()} `;

  const dateFromFormat = `${new Date(dateFrom).getMonth() + 1}/${
    new Date(dateFrom).getDate() + 1
  }/${new Date(dateFrom).getFullYear()} `;

  if (dateTo && !dateFrom) {
    const dateToSalesQuery = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(dateTo), $lte: new Date(dateToFormat) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%m-%d-%Y", date: "$createdAt" } },
          transactions: { $push: "$$ROOT" },
          totalSalesThisDay: { $sum: "$amount" },
          totalVatSalesThisDay: { $sum: "$vat_sales" },
          totalVatAmountThisDay: { $sum: "$vat_amount" },
        },
      },
    ]);

    return res.status(200).json(dateToSalesQuery);
  } else if (!dateTo && dateFrom) {
    const dateFromSalesQuery = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(dateFrom),
            $lte: new Date(dateFromFormat),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%m-%d-%Y", date: "$createdAt" } },
          transactions: { $push: "$$ROOT" },
          totalSalesThisDay: { $sum: "$amount" },
          totalVatSalesThisDay: { $sum: "$vat_sales" },
          totalVatAmountThisDay: { $sum: "$vat_amount" },
        },
      },
    ]);

    return res.status(200).json(dateFromSalesQuery);
  } else if (dateTo && dateFrom) {
    const salesQuery = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(dateFrom), $lte: new Date(dateToFormat) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%m-%d-%Y", date: "$createdAt" } },
          transactions: { $push: "$$ROOT" },
          totalSalesThisDay: { $sum: "$amount" },
          totalVatSalesThisDay: { $sum: "$vat_sales" },
          totalVatAmountThisDay: { $sum: "$vat_amount" },
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json(salesQuery);
  } else {
    return res.status(500).json({ message: "Please add to dates." });
  }
});

// ---- sales per year ----
export const salesPerYearQuery = asyncHandler(async (req, res) => {
  const { year } = req.body;
  const yearTransaction = await Transaction.aggregate([
    {
      $project: {
        _id: 1,
        amount: 1,
        vat_amount: 1,
        vat_sales: 1,
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        date: { $dayOfMonth: "$createdAt" },
      },
    },
    {
      $match: {
        year: {
          $eq: parseInt(year),
        },
      },
    },
    {
      $group: {
        _id: "$year",
        totalSalesThisYear: { $sum: "$amount" },
        totalVatSalesThisYear: { $sum: "$vat_sales" },
        totalVatAmountThisYear: { $sum: "$vat_amount" },
      },
    },
  ]);

  const monthTransaction = await Transaction.aggregate([
    {
      $project: {
        _id: 1,
        amount: 1,
        vat_amount: 1,
        vat_sales: 1,
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        date: { $dayOfMonth: "$createdAt" },
      },
    },
    {
      $match: {
        year: {
          $eq: parseInt(year),
        },
      },
    },
    {
      $group: {
        _id: "$month",
        totalSalesMonthly: { $sum: "$amount" },
        totalVatSalesMonthly: { $sum: "$vat_sales" },
        totalVatAmountMontly: { $sum: "$vat_amount" },
      },
    },
  ]);

  return res.status(200).json({ yearTransaction, monthTransaction });
});

//pagination ========================================================================================================

export const paggination = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const limit = 10;
  try {
    const transaction = await Transaction.find()
      .populate("customer_id")
      .skip((id - 1) * limit)
      .limit(limit);
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
