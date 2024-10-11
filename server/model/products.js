import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: mongoose.Decimal128,
    get: (p) => new mongoose.Types.Decimal128((+p.toString()).toFixed(2)),
  },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
