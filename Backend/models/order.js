const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      itemType: { type: String, enum: ['Bundle', 'StudyMaterial'], required: true },
      item: { type: Schema.Types.ObjectId, required: true, refPath: 'items.itemType' },
      price: { type: Number, required: false }
    }
  ],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;