const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User,Course } = require("../db/index");
const jwt=require("jsonwebtoken");
const { JWT_SECRET }=require("../config");

// User Routes
router.post('/signup',async (req, res) => {
    // Implement user signup logic
    const username=req.body.username;
    const password=req.body.password;
    const response = await User.findOne({
        username,
        password
    })
    if(response){
        res.json({
            msg:"User already there"
        })
    }else{
        User.create({
            username,
            password
        })
        res.json({ message: 'User created successfully' })
    }
});

router.post('/signin',async (req, res) => {
    // Implement admin signup logic
    const username=req.headers.username;
    const password=req.headers.password;
    const search=await User.findOne({
        username,
        password
    })
    if(search){
        const token=jwt.sign({
            username
        },JWT_SECRET);
        res.json({token});
    }else{
        res.status(411).json({
            msg:"Invalid credentials"
        })
    }
});

router.get('/courses',async (req, res) => {
    // Implement listing all courses logic
    const ans=await Course.find({});
    res.json({ans})

});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    // Implement course purchase logic
    const id=req.params.courseId;
    const username=req.username;
    await User.updateOne({
        username
    },{
        "$push":{
            purchasedCourses:id
        }
    })
    res.json({msg:"Course added successfully"});
});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    // Implement fetching purchased courses logic
    const username=req.username;
    const curr_user=await User.findOne({
        username
    })
    if(curr_user){
        
        const val=await Course.findOne({
            _id:{
                "$in":curr_user.purchasedCourses
            }
        })
     res.json({val});
    }else{
        res.json({msg:"Invalid user"});
    }
});

module.exports = router