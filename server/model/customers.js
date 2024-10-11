import mongoose from "mongoose";
import Transaction from "./transactions.js";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
    },
  },
  { timestamps: true }
);

CustomerSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Transaction.findByIdAndDelete({ _id: data.transaction });
  }
});

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
