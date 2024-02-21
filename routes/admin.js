const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin,Course } = require("../db/index")
const jwt=require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
 
// Admin Routes
router.post('/signup',async (req, res) => {
    // Implement admin signup logic
    const username=req.headers.username;
    const password=req.headers.password;
    let find=await Admin.findOne({
        username,
        password
    })
    if(find){
        res.json({msg:"Admin already exist"})
    }else{
       find=await Admin.create({
        username,
        password
       })
       req.json({msg:"Admin created successfully"}); 
    }
});

router.post('/signin',async (req, res) => {
    // Implement admin signup logic
    const username=req.headers.username;
    const password=req.headers.password;
    let find=await Admin.findOne({
        username,
        password
    })
    if(find){
        const token=jwt.sign({
            username
        },JWT_SECRET);
        res.json({token});
    }else{
        res.status(403).json({msg:"Invalid credentials"})
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title=req.body.title;
    const description=req.body.description;
    const imageLink=req.body.imageLink;
    const price=req.body.price;
    //validation is not done here but it's imp to do that
    const entry = await Course.create({
        title,
        description,
        price,
        imageLink
    })
    res.json({
        message: 'Course created successfully', courseId: entry._id
    })
});

router.get('/courses', adminMiddleware,async (req, res) => {
    // Implement fetching all courses logic
    const response=await Course.find({});
    res.json({response});
});

module.exports = router;