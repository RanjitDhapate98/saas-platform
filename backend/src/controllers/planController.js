const Plan=require('../models/Plan');
const asyncHandler=require('../utils/asyncHandler');
exports.getAllPlans=asyncHandler(async(req,resizeBy,next)=>{
    const plans=await Plan.find({
        isActive:true
    });
    res.status(200).json({
        status:'success',
        data:plans
    });
});