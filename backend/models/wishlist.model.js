import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    auth0Id: {
        type: String,
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;
