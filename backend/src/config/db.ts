import mongoose from "mongoose";
const dbConnection= async():Promise<void>=> {
  try{
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("DATABASE CONNECTED SUCCESSFULLY");
  } 
  catch(err){
    console.log("DATABASE CONNECTION ERROR:", err);
    process.exit(1);
  }
}

export default dbConnection;