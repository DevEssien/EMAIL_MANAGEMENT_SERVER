const { Schema, model} = require('mongoose');

const SubscriberSchema = new Schema({
  first_name: String, 
  email: { type: String, trim: true, unique: true },
  is_confirmed: { type: Boolean, default: false },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'List'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

exports.SubsciberModel = model('Subscriber', SubscriberSchema);