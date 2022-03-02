const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Post = require("../models/post.model");

router.get("/get-user/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).populate("posts").lean().exec();
        if (!user) {
            return res.status(404).send({});
        }
        return res.status(200).send(user);
    } catch (err) {
        return res.status(404).send({})
    }
})

router.post("/create-user", async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username }).lean().exec();
        if (user) {
            return res.status(400).send({
                "status": "failure",
                "reason": "User already Exists"
            });
        }
        user = await User.create(req.body);
        return res.status(201).send({ username: user.username });
    } catch (err) {
        return res.status(400).send({
            "status": "failure",
            "reason": "Something went wrong"
        })
    }
})

router.post("/follow/:usernameA/:usernameB", async (req, res) => {
    try {
        const user1 = await User.findOne({ username: req.params.usernameA }).lean().exec();
        if (!user1) {
            return res.status(400).send({
                "status": "failure",
                "reason": `${req.params.usernameA} not found`
            });
        }
        const user2 = await User.findOne({ username: req.params.usernameB }).lean().exec();
        if (!user2) {
            return res.status(400).send({
                "status": "failure",
                "reason": `${req.params.usernameB} not found`
            });
        }

        const updatedUser1 = await User.findByIdAndUpdate(user1._id, { "following": [...user1.following, `${req.params.usernameB}`] }, { new: true }).lean().exec();
        const updatedUser2 = await User.findByIdAndUpdate(user2._id, { "followers": [...user2.followers, `${req.params.usernameA}`] }, { new: true }).lean().exec();
        return res.status(202).send({ "status": "success" })
    } catch (err) {
        return res.status(400).send({
            "status": "failure",
            "reason": "Something went wrong"
        })
    }
})

router.post("/create-post/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).lean().exec();
        if (!user) {
            return res.status(400).send({
                "status": "failure",
                "reason": "User does not exists"
            })
        }
        let postId = user.posts.length + 1;
        const post = await Post.create({ ...req.body, postId: postId });
        const updatedUser = await User.findByIdAndUpdate(user._id, { posts: [...user.posts, post._id] }, { new: true }).lean().exec();
        return res.status(201).send(post);
    } catch (err) {
        return res.status(400).send({
            "status": "failure",
            "reason": "Something went wrong"
        })
    }
})

router.get("/all-posts/:usernameA",async (req,res) => {
    try{
        const user = await User.findOne({ username: req.params.usernameA }).populate("posts").lean().exec();
        if (!user) {
            return res.status(400).send({
                "status": "failure",
                "reason": "User does not exists"
            })
        }
        const following = user.following;
        const followings = await User.find({username: {$in: following}}).populate("posts").lean().exec();
        let posts = [];
        for(let i=0; i<followings.length; i++){
            posts.push(...followings[i].posts)
        }
        return res.status(200).send(posts);
    } catch(err){
        return res.status(400).send({
            "status": "failure",
            "reason": "Something went wrong"
        })
    }
})

module.exports = router;

