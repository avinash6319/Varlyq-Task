const postModel = require("../models/postModel")
const {isValid,isValidBody,isValidId} = require("../validation/validation")
// const { isValidObjectId } = require("mongoose")
const userModel = require("../models/userModel")

//====================================post Api================================================================//

exports.createpost = async function (req, res) {
    try {
        const requestBody = req.body
        const Id = req.body.createdBy
        const { createdBy ,message , comments,liked } = requestBody
        if (!isValidBody(requestBody)) {return res.status(400).send({ status: false, msg: " Pls Provide requestBody" })}
        if (!isValid(createdBy)) {return res.status(400).send({ status: false, msg: " Pls Provide createdBy for posts" })}
        if (!isValidId(Id)) {return res.status(400).send({ status: false, msg: " Pls provide Valid user Id" })}
        if (!isValid(message)) { return res.status(400).send({ status: false, msg: "pls provide message of posts" })}
        if (!isValid(comments)) {return res.status(400).send({ status: false, msg: "pls provide comments of posts" })}
        if (!isValid(liked)) {return res.status(400).send({ status: false, msg: " Pls provide liked for posts" })}

     const validId = await userModel.findById(Id)
     if (validId) {const postCreated = await postModel.create(requestBody)
     res.status(201).send({ status: true, msg: 'post created succesfully ', data: postCreated })
     } else { res.status(400).send({ statusbar: false, msg: 'invalid userid' }) }
    }catch (err) {return res.status(500).send({ status: false, msg: error.message })}}

// -------------------------------------GET Api for posts ----------------------------------------------------//

exports.getpostData = async function(req,res){
    try{
        let postId = req.params.postId
    
        if (!isValidId(postId)) {return res.status(400).send({ status: false, message: "Invalid postId" });}
        
        const findId=await postModel.find({_id:postId})
         if(!findId) return res.status(404).send({status:false,message:"No post exist with this Id"})
         if(findId.isDeleted) return res.status(404).send({status:false,message:"The post you are trying to find is deleted"})
        const user= await userModel.find({_id:postId, isDeleted:false})
        const details={
            _id:findId._id,
             userId:findId.userId,
            message:findId.message,
           liked:findId.liked,
            reviews:findId.reviews,
            isDeleted:findId.isDeleted,
            createdAt:findId.createdAt,
            updatedAt:findId.updatedAt,
            sendAt:findId.sendAt,
           userData:user,
        }
        
        
         return res.status(200).send({status:true,message:"post profile details",data:user})
        } catch(err){return res.status(500).send({status:false,message:err.message})}
    }




    //----------------------------------Update posts Api------------------------------------------------------//
    exports.updatePosts = async function (req, res) {
        try {
            const data = req.body
            const postId = req.params.postId
            
            const update = {}
        
            const { createdBy,message,comments,liked } = data
        
            if (!isValidBody(data)){return res.status(400).send({status: false,message: "Please provide data in body"})}
            
        
            if (createdBy || createdBy == '') {
              if (!isValidId(createdBy)) { return res.status(400).send({ status: false, message: " createdBy is invalid" })}
             update["createdBy"] = createdBy;
            }

            if (message || message == ''){
              if (!isValid(message) ) {return res.status(400).send({ status: false, message: "please provide some message" })}
              update["message"] = message 
            }

            if (comments || comments == '') {
                if (!isValidId(comments)) { return res.status(400).send({ status: false, message: " comments is invalid" })}
               update["comments"] = comments;
              }


              if (liked || liked == '') {
                if (!isValidId(liked)) { return res.status(400).send({ status: false, message: " liked is invalid" })}
               update["liked"] = liked;
              }
    
            const findId=await postModel.find({_id:postId,isDeleted:false})
            if(findId.length==0) return res.status(404).send({status:false,message:"No post exist with this Id"})
            if(findId.isDeleted) return res.status(404).send({status:false,message:"The post you are trying to find is deleted"})
          
             await postModel.findOneAndUpdate(
                { _id: postId },
                {$set:update},
                { new: true }
              )
            res.status(200).send({ status: true, message: 'Success', data: findId
         })
        
        }
        catch (error) {res.status(500).send({status:false, message: error.message })}}
        

        //----------------------Delete Post Api --------------------------------------------------------------//
        
exports.deletepost = async function (req, res) {
    try {
     let postId = req.params.postId
          if (!isValidId(postId)) {
            return res.status(400).send({ status: false, message: "postId not valid" }) }
          let postData = await postModel.findOne({ _id: postId,isDeleted: false})
          if (!postData) {
            return res.status(404).send({ status: false, message: "post not exist" })
          }
      
          await postModel.updateOne(
            { _id: postId },
            { isDeleted: true  }
          );
      
          return res.status(200).send({ status: true, message: "post Successfully Deleted" })
        } 
        catch (err) {
          return res.status(500).send({ satus: false, err: err.message })
        }
      }
    