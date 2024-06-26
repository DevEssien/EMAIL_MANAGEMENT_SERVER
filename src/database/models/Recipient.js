const { Schema, model } = require('mongoose');
const { SubscripitonRequestEnum } = require('../enums/index');
const ReciepientSchema = new Schema({
  first_name: String,
  email: { type: 'string', trim: true },
  is_confirmed: { type: Boolean, default: false },
  subscription_request: { 
    type: String, 
    enum: Object.values(SubscripitonRequestEnum)
  },
  tag: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  is_deleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { timestamps: true });

exports.recipientModel = model('Recipient', ReciepientSchema); 