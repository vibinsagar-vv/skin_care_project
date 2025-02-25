const { EncryptData } = require("../../common/bcrypt");
const { CreateToken } = require("../../common/jwt");
const SentMail = require('../../common/nodemail')
async function resendOtpCntrl(req,res){
    try{  
        const {email,name} = req.body
        const otp = `${Math.floor(1000+Math.random()*9000)}`
        const now = new Date();
        const target = new Date(now.getTime()+2*60*1000)   
        const encryptOtp =await EncryptData(otp)        
        SentMail({
            to:email,
            subject:"OTP Verification",
            html: `<div>
                <h1 style={{display:'flex',justifyContent:'center',padding:'10px',fontWeight:'bolder',fontSize:'30px',margin:'20px',color:'red'}}>Verification Code</h1>
                <p>
                    Hi ${name},
                </p>
                <p>
                    This is your temporary verification code.This is valid for 2 minutes.
                </p>
                <div style={{display:'flex',justifyContent:'center',margin:'10px 0px'}}>
                <p style={{fontSize:'30px',color:'#36022d'}}>${otp}</p>
                </div>
                <p>Thank you!</p>
                <p>
                    ZenGlow.
                </p>
            </div>`,
    
        })

        res.json({
            time:target,
            Otp:encryptOtp,
            success:true,
            error:false,
            message:"otp sent to your mail id"
        })
        
}catch(error){
    res.json({
        success:false,
        error:true,
        message:error.message ||error
    })
}
}


module.exports=resendOtpCntrl