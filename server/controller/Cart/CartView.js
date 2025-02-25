const AddToCartModel = require("../../models/cartProduct")
const userModel = require("../../models/userModel")

const CartViewCntrl = async(req,res) =>{
    try{
        const curentUser =req.userid
        const cart = await AddToCartModel.findOne({
            UserId:curentUser
        }).populate("products.ProductId")
        
        

        const cartproduct=cart.products
        
        res.json({
            data:cartproduct,
            success:true,
            error:false,
            message:"cart product data"
        })

    }catch(error){
        res.status(500).json({
            success:false,
            error:true,
            message:error.message ||error
        })
    }
}

module.exports = CartViewCntrl