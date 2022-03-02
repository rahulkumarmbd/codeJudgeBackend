const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postId: { type: Number, required: false },
    imageUrl: { type: String, required: false },
    caption: { type: String, required: false },
    upvotes: { type: String, required: false, default: 0 },
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model("post", postSchema);