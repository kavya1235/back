const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/user')
const bcrypt=require('bcryptjs')
// const Recipe=require('./models/Recipe')

const app=express()
const PORT=3502
app.use(express.json());

//Home page api
app.get('/home',(req, res)=>{
    res.send("<h1 align=center>Welcome to the MERN stack week 2 session</h1>")
})

//Registration page api

app.post('/register',async(req, res)=>{
    const {username,email,password}=req.body
    try{
        const hashedPassword= await bcrypt.hash(password,10)
        const user=new User({username,email,password:hashedPassword})
        await user.save()
        res.json({message: "User Registred.."})
        console.log("User Registration completed...")
    }
    catch(err)
    {
        console.log(err)
    }
})

//Login page api

app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) 
            {
             return res.status(400).json({ message: "Invalid Credentials" });
            }
          res.json({ message: "Login Successful", username: user.username });
    }
    catch(err)
    {
        console.log(err)
    }
})

//Creare Recipe page api

app.post('/createrecipe',async(req,res)=>{
    const{Name,Description,Ingredients,Instruction,ImageURL,CookingTime}=req.body
    try{
        const CreateRecipe=new Recipe({Name,Description,Ingredients,Instruction,ImageURL,CookingTime})
        await CreateRecipe.save()
        res.json({message: "Recipe Created.."})
        console.log("Recipe Creation completed...")
    }
    catch(err){
        console.log(err)
    }
})
// console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("DB connected successfully..")
).catch(
    (err)=>console.log(err)
)

app.listen(PORT,(err)=>{
    if(err)
    {
        console.log(err)
    }
    console.log("Server is running on port :"+PORT)
})