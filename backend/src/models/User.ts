import mongoose, {Schema} from "mongoose"
export interface schemaBody {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
}
const userSchema= new Schema<schemaBody>({
    name:{
        type:String,
        required:true,
        trim:true,
    },

    password:{
        type:String,
        required:true,
        minlength:8,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    role:{
      type:String,
      enum:["admin", "sales"],
      default:"sales"
    }

}, {timestamps: true});

const User = mongoose.model<schemaBody>("User", userSchema);
export default User;

