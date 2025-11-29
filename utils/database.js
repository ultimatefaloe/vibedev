import mongoose from "mongoose";

let isConnected  = false;

export const connectionToDB = async()=>{
   
  if(isConnected){
    console.log('DB connected')
    return
  }

  try {
    await mongoose.connect( process.env.MONGODB_URI, {
      dbName: 'sharedPrompt',
    })

    isConnected = true;

    console.log('DB connected')
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to create prompt" }, { status: 500 });
  }
}