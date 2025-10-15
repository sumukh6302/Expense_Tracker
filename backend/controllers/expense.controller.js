import { Expense } from "../models/expense.model.js";

export const addExpense = async(req,res)=>{
    try{
        const { description,amount,category}= req.body;
        const userId = req.id; //current loggedin user id
        if(!description || !amount || !category){
            return res.status(400).json({message:"All fields are required",
                success:"false"
            });
        };

        const expense = await Expense.create({
            description,
            amount,
            category,
            userId
        });
        return res.status(201).json({
            message:"New Expense added.",
            expense,
            success:true
        });
    }
    catch(error){
        console.log(error);
    }
}

// import axios from "axios";

// export const addExpense = async (req, res) => {
//   try {
//     const { description, amount } = req.body;
//     const userId = req.id;

//     // Ask AI to suggest a category
//     const aiResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are an assistant that classifies expenses." },
//         { role: "user", content: `Classify this expense: "${description}" into Food, Transport, Shopping, Bills, or Others.` }
//       ],
//       temperature: 0
//     }, {
//       headers: {
//         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//         "Content-Type": "application/json"
//       }
//     });

//     const aiCategory = aiResponse.data.choices[0].message.content.trim();

//     const expense = await Expense.create({
//       description,
//       amount,
//       category: aiCategory,
//       userId
//     });

//     res.status(201).json({ success: true, expense });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

export const getAllExpense = async(req,res)=>{
    try {
        const userId = req.id; //loggedin user id
        let category = req.query.category || "";
        const done = req.query.done || "";

        const query= {
            userId // filter by userId
        }
        if(category.toLowerCase()==="all"){
            //no need to filter by category
        }
        else{
            query.category = {$regex:category,$options:'i'};
        }
         if(done.toLowerCase()==="done"){
            query.done = true; // filter for expense marked as ptrue
        }
         else if(done.toLowerCase()==="undone"){
            query.done = false; // filter for expense marked as pending or false
        };

        const expense  = await Expense.find(query);
        if(!expense || expense.length=== 0){
            return res.status(404).json({
                message:"NO expense found",
                success:false
            });
        }
        return res.status(200).json({
            expense,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const markAsDoneUndone = async(req,res)=>{
   try {
    const expenseId = req.params.id;
    const done = req.body; 
    const expense= await Expense.findByIdAndUpdate(expenseId,done,{new :true});

    if(!expense){
        return res.status(404).json({
            message:"Expense not found",
            success:false
        })
    };
    return res.status(200).json({
        message:`Expense mark as ${ expense.done ? 'done' :'undone'}`,
        success:true
    })
   } catch (error) {
    console.log(error);
   }
}
export const removeExpense = async(req,res)=>{
    try {
        const expenseId = req.params.id;
        const expense = await Expense.findByIdAndDelete(expenseId);

          if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
        success: false
      });
    }
        return  res.status(200).json({
        message: "Expense removed",
        success:true
    });
    } catch (error) {
        console.log(error);
    }
}
export const updateExpense = async(req,res)=>{
    try{
        const {description,amount,category} = req.body;

        const expenseId = req.params.id;
        const updateData = {description,amount,category};

        const expense  = await Expense.findByIdAndUpdate(expenseId,updateData,{new:true});
        return res.status(200).json({
            message:"Expense Updated",
            expense,
            success:true
        })
    }
    catch(error){
        console.log(error);
    }
}