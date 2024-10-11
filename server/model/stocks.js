import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  qty: {
    type: Number,
    required: true,
    default: 0,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  isLocked: {
    type: Boolean,
    required: true,
    default: true,
  },
  sales: {
    type: Number,
    default: 0,
  },
});

const Stock = mongoose.model("Stock", StockSchema);

export default Stock;
