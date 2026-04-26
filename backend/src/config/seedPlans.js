const Plan=require('../models/Plan');
const seedPlan=async()=>{
    try{
        const count=await Plan.countDocuments();
        if(count>0)
            return;

        await Plan.insertMany([
            {
                name:'free',
                displayName:'Free Plan',
                price:0,
                duration:30,
               features:[
                 'Up to 3 projects',
                 '1 user only',
                 'Basic support'
               ]
            },
            {
                name:'basic',
                displayName:'Basic Plan',
                price:299,
                duration:30,
                features:[
                    'Up to 10 projects',
                    'Up to 5 users',
                    'Email support',
                    'Analytics'
                ]
            },
            {
                name:"pro",
                displayName:'Pro Plan',
                price:999,
                duration:30,
                features:[
                    'Unlimited projects',
                   'Unlimited users',
                   'Priority support',
                   'Advanced analytics',
                   'Custom integrations'
                ]
            }
        ]);
     console.log('plan seeded successfully');

    }
    catch(err){
        console.log('seeding error: ',err);
    }
};
module.exports=seedPlan;