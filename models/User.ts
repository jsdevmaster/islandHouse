import mongoose, { Schema, Document } from 'mongoose';

const registerSchema: Schema = new Schema(
  {
    id: { type: String, default: 'none' },
    category: { type: String, default: 'none' },
    phonenumber: { type: String, default: 'none' },
    status: { type: String, default: 'none' },
    codenumber: { type: String, default: 'none' },
    loginid: { type: String, default: 'none' },
    passwordcode: { type: String, default: 'none' },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const redeemSchema: Schema = new Schema(
  {
    id: { type: String, default: 'none' },
    amount: { type: Number, default: 0 },
    btc: { type: String, default: '0' },
    paymentoption: { type: String, default: 'none' },
    paymenttype: { type: String, default: 'none' },
    paymentstatus: { type: String, default: 'Processing' },
    dailyChecked: { type: Boolean, default: false },
    bonusChecked: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    comdate: { type: Date }
  },
  { _id: false }
);

const withdrawalSchema: Schema = new Schema(
  {
    id: { type: String, default: 'none' },
    amount: { type: Number, default: 0 },
    paymentoption: { type: String, default: 'none' },
    paymenttype: { type: String, default: 'none' },
    paymentstatus: { type: String, default: 'Processing' },
    paymentgateway: { type: String, default: 'none' },
    date: { type: Date, default: Date.now },
    comdate: { type: Date }
  },
  { _id: false }
);

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  tag: number;
  email: string;
  emailcode: string;
  password: string;
  role: string;
  action: string;
  ip: string;
  token: string;
  createdAt: Date;
  cashtag: string;
  venmo: string;
  paypal: string;
  zelle: string;
  bitcoin: string;
  verifystatus: string;
  register: Array<typeof registerSchema>;
  redeem: Array<typeof redeemSchema>;
  withdrawal: Array<typeof withdrawalSchema>;
}

const userSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: false },
  tag: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  emailcode: { type: String, default: 'none' },
  password: { type: String, required: false },
  role: { type: String, default: 'user' },
  action: { type: String, default: 'yes' },
  ip: { type: String },
  token: { type: String },
  cashtag: { type: String, default: 'none' },
  venmo: { type: String, default: 'none' },
  paypal: { type: String, default: 'none' },
  zelle: { type: String, default: 'none' },
  bitcoin: { type: String, default: 'none' },
  createdAt: { type: Date, default: Date.now },
  verifystatus: { type: String, default: 'no' },
  register: [registerSchema],
  redeem: [redeemSchema],
  withdrawal: [withdrawalSchema]
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
