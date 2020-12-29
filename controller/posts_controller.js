const Post = require('../models/post');
const Comment = require('../models/comment');
const path = require('path');
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{     
       let post =  await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        if(req.xhr){
            console.log("i am here! ************************"); //not working for delete , its working for creating
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post Created!!"
            });
        }
            req.flash('success', "Post Published!!");
            return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}

// module.exports.destroy = async function(req, res){
//     try{
//         let post = await Post.findById(req.params.id);
//         if(post.user == req.user.id){

//             // delete the associated Likes for the post and all its comments likes too
//             await Like.deleteMany({likeable: post, onModel: 'Post'});
//             await Like.deleteMany({_id: {$in: post.comments}});

//             post.remove();

//             await Comment.deleteMany({post: req.params.id});

//             if(req.xhr){
//                 console.log("**************here in delete");
//                 return res.status(200).json({
//                     data:{
//                         post_id: req.params.id
//                     },
//                     message: "Post Deleted"
//                 });
//             }

//             req.flash('success', 'Post Deleted!');
//             return res.redirect('back');
//         }else{
//             req.flash('error', 'You can not delete this post');
//         return res.redirect('back');
//         }
//     }catch(err){
//         req.flash('error', err);
//         return res.redirect('back');
//     }
    
// }

module.exports.destroy=async function(req,res){
    //req.params.id contains id of post to be deleted
    try{
        let post=await Post.findById(req.params.id);
            //post.user contains id of the user who posted that post.
            //req.user contains info of current logged in user.
            // .id means converting the object id into string.
            if ( post.user==req.user.id ){
                //deleting likes of posts before deleting posts 
                await Like.deleteMany({likeable:post,onModel:'Post'});
                //deleting likes of comments before deleting comments of posts
                await Like.deleteMany({_id: {$in: post.comments}});
                post.remove();
           
                await Comment.deleteMany({post:req.params.id});

                if (req.xhr){

                    return res.status(200).json({
                        data: {
                            post_id: req.params.id
                        },
                        message: "Post deleted"
                    });
                }
    
                req.flash('success','Post and associated comments deleted!');
                return res.redirect('back');
            }
            else{
                req.flash('error', 'You cannot delete this post!');
                return res.redirect('back');
            }
        }
    catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}
