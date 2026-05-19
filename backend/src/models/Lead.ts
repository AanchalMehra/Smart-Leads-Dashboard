import mongoose, { Schema } from "mongoose";

export interface leadBody {
  name: string;
  email: string;
  status: "New"|"Contacted"|"Qualified"|"Lost";
  source: "Website"|"Instagram"|"Referral";
  createdBy: mongoose.Types.ObjectId;
  phone: string;
  notes: string;
}

const leadSchema = new Schema<leadBody>(
  {
    name:{
      type:String,
      required:true,
      trim:true,
    },

    phone: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },

    email:{
      type:String,
      required:true,
      lowercase:true,
    },

    status: {
      type:String,
      enum:["New","Contacted","Qualified","Lost"],
      default:"New",
    },

    source: {
      type:String,
      enum:["Website", "Instagram", "Referral"],
      required:true,
    },

    createdBy: {
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true,
    }

  },{timestamps:true})

const Lead=mongoose.model<leadBody>("Lead", leadSchema);

export default Lead;