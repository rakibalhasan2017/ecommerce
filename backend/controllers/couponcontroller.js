import Coupon from '../models/coupon.js';

export const getcoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find({ userid: req.user._id, isactive: true });
        if(coupons.length === 0) {
            console.log("No coupons found");
            return res.status(404).json(null);
        }
        res.json(coupons);
    } catch (error) {
        console.error('Error getting coupons:', error.message);
        res.status(500).json({ message: "Server Error in the getcoupon controller" });
    }
}

export const validatecoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code, isactive: true, userid: req.user._id });    
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found to validate in the coupon validation controller" });
        }
        if (coupon.expirationdate < new Date()) {
            coupon.isactive = false;
            await coupon.save();
            return res.status(400).json({ message: "Coupon has expired" });
        }
        res.json({
            discountpercentage: coupon.discountpercentage,
            message: "Coupon is valid",
            code: coupon.code,  
        });
    } catch (error) {   
        console.error('Error validating coupon:', error.message);
        res.status(500).json({ message: "Server Error in the validatecoupon controller" });
    }
}