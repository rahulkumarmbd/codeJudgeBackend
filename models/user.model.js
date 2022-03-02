const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    followers: [{ type: String, required: false, default: "" }],
    following: [{ type: String, required: false, default: "" }],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
}, {
    versionKey: false,
    timestamps: true,
})

module.exports = mongoose.model("user", userSchema);

// {
//     "username": "",                 ?------------ string
//     "followers": ["A", "B, "C],     ?------------ string array of usernames that follow the user (empty by default)
//     "following": ["B", "A"],        ?------------ string array of usernames that user follows (empty by default)
//     "posts": [
//         {
//             "postId": ,             ?--------- Integer
//             "imageUrl": "",         ?--------- String
//             "caption": "",          ?--------- String
//             "upvotes": 0            ?--------- Integer (must be zero by default)
//         }
//     ]                               ?------------ array of objects that contains details regarding a post (empty list by default)
// }