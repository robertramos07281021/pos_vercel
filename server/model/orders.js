import mongoose from "mongoose";
import Transaction from "./transactions.js";
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  qty: {
    type: Number,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  old_price: {
    type: mongoose.Decimal128,
    get: (v) => new mongoose.Types.Decimal128((+v.toString()).toFixed(2)),
  },
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  total: {
    type: mongoose.Decimal128,
    get: (c) => new mongoose.Types.Decimal128((+c.toString()).toFixed(2)),
  },
});

OrderSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Transaction.findByIdAndUpdate(data.transaction_id, {
      $pull: { orders: data._id },
    });
  }
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
