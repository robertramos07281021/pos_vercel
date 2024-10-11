import mongoose from "mongoose";
import Order from "./orders.js";
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    receipt_no: {
      type: String,
      required: true,
      max: 10,
      min: 10,
    },
    amount: {
      type: mongoose.Decimal128,
      get: (v) => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
    },
    cash: {
      type: mongoose.Decimal128,
      get: (v) => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
    },
    change: {
      type: mongoose.Decimal128,
      get: (v) => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
    },
    vat_sales: {
      type: mongoose.Decimal128,
      get: (v) => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
    },
    vat_amount: {
      type: mongoose.Decimal128,
      get: (v) => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

TransactionSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Order.deleteMany({ _id: { $in: data.orders } });
  }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
