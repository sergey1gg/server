const Router = require("express")
const User = require("../models/User")
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = new Router()
const config = require("config")
const {check,validationResult} = require("express-validator")
const authMiddleware = require("../middlewares/auth.middleware")
router.post('/adduser',
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password','Uncorrect pass').isLength({min:3,max:12})
    ],
    async(req,res)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:"Error", errors}) 
        }
        const {username,phone,email,isAdmin,password} = req.body
        console.log(req.body)
        const candidate =await User.findOne({username,email})

        if (candidate){
            return res.status(400).json({message: 'User already exist'})
        }
        const hashPassowrd=await bcrypt.hash(password,8)
        const user=new User({username,phone,email,isAdmin,password: hashPassowrd})
        await user.save()
    } catch(e){
        console.log(e)
        res.send({message:'Server error'})
    }
})

router.post('/login',
    async(req,res)=>{
    try{
       const {email,password} = req.body
       const user = await User.findOne({email})
       if(!user){
        return res.status(404).json({message: "User not found"})
       }
       const isPassValid = bcrypt.compareSync(password, user.password)
       if(!isPassValid){
        return res.status(404).json({message: "Invalid password"})
       }
       const token =jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "3h"})
       const response = {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.isAdmin
        }
      };
      console.log(response); // выводим в консоль
      return res.json(response);
    } catch(e){
        console.log(e)
        res.send({message:'Server error'})
    }
})
router.get('/authentification', authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id })
      const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "24h" })
      const response = {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.isAdmin
        }
      };
      console.log(response); // выводим в консоль
      return res.json(response);
    } catch (e) {
      console.log(e)
      res.send({ message: 'Server error' })
    }
  })


module.exports=router