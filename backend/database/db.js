import mongoose from "mongoose";

const ConnectDB = async()=>{
     try{
        await mongoose.connect(process.env.MONGO_URI);
        // await mongoose.connect("mongodb+srv://sumukhsandarikari:0wTHuQsOfouIJpH6@cluster0.hsveapr.mongodb.net/?retryWrites=true&w=majority");
        console.log('MONGODB connected Succesfully');
     }
     catch(error){
        console.log(error);
     } 
}
export default ConnectDB;