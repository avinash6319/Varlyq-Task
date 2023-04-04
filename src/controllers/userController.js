const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { isValidBody, isValid, isValidUserName,isValidId, isValidMobileNumber, isValidEmail,isValidPassword } = require("../validation/validation")


/* ------------------------------------------- Post Api User -------------------------------------------- */
exports.creatUserData = async function (req, res) {
try {let data = req.body
  const { name, email, mobile, password } = data

 if (!isValidBody(data)){return res.status(400).send({status: false,message: "Please provide data in body"})}

 if (!name) {return res.status(400).send({ status: false, message: "Name is required" })}
 if (!isValid(name) || !isValidUserName(name)) {return res.status(400).send({ status: false, message: " name is invalid" })}

 if (!email) {return res.status(400).send({ status: false, message: "Email is required" })}
 if (!isValidEmail(email)) {return res.status(400).send({ status: false, message: "Email is invalid" })}
let userEmail = await userModel.findOne({ email: email })
if (userEmail){return res.status(400).send({status: false,message:"Email Id already registered, Please provide another email"})}
  
if (!mobile){return res.status(400).send({ status: false, message: "mobile number is required!" })}
if (!isValidMobileNumber(mobile)) {return res.status(400).send({ status: false, message: "mobile number is invalid"})}
let userNumber = await userModel.findOne({ mobile:mobile })
      if (userNumber) {
        return res.status(400).send({status: false,message:"mobile number is already registered, please provide another mobile number"})
       }

if (!password){return res.status(400).send({ status: false, message: "Password is required!" })}
if (!isValidPassword(password)) {return res.status(400).send({status: false,message:"Password should be of 8 to 15 characters and it should contain one Uppercase, one lower case and Number Ex - AbhisheK12345,Qwe#121"})}

const salt = await bcrypt.genSalt(10);// console.log(salt)
data.password = await bcrypt.hash(data.password, salt);// console.log(data.password)

const userDataCreate = await userModel.create(data)
return res.status(201).send({status: true, message: "User created successfully",data: userDataCreate})
} 
catch (error) {res.status(500).send({ message: error.message });
    }}





// ----------------------------------------- Get User Api --------------------------------------------------- //
exports.getUserData = async function(req,res){
try{
    let userId = req.params.userId

    if (!isValidId(userId)) {return res.status(400).send({ status: false, message: "Invalid userId" });}
    
    const findId=await userModel.find({_id:userId,isDeleted:false})
    if(findId.length==0) return res.status(404).send({status:false,message:"No user exist with this Id"})
    if(findId.isDeleted) return res.status(404).send({status:false,message:"The user you are trying to find is deleted"})
  
    return res.status(200).send({status:true,message:"User profile details",data:findId})
    } catch(err){return res.status(500).send({status:false,message:err.message})}
}









// /* ----------------------------------------- Put User Api --------------------------------------------------- */
exports.updateProfile = async function (req, res) {
try {
    const data = req.body
    const userId = req.params.userId
    const update = {}

    const { name,  email, mobile, password } = data

    if (!isValidBody(data)){return res.status(400).send({status: false,message: "Please provide data in body"})}
    if (name || name == ''){
      if (!isValid(name) || !isValidUserName(name)) {return res.status(400).send({ status: false, message: "name is invalid" })}
      update["name"] = name 
    }

    if (email || email == '') {
      if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: "Email is invalid" })}
      let userEmail = await userModel.findOne({ email: email })
      if (userEmail) { return res.status(409).send({status: false,message:"This email is already registered"}) }
      update["email"] = email;
    }

    if (mobile || mobile == '') {
      if (!isValidMobileNumber(mobile)) {return res.status(400).send({ status: false, message: "mobile number is invalid" })
      }
    let userNumber = await userModel.findOne({ mobile: mobile })
      if (userNumber){return res.status(409).send({status: false,message:"This mobile number already registered"})}
      update["mobile"] = mobile
    }

    if (password || password == '') {
      if (!isValidPassword(password)) {
        return res.status(400).send({status: false,message:"Password should be of 8 to 15 characters and it should contain one Uppercase, one lower case, and Number, Ex - Abhishek@12345,Qwe#121"})
      }
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password, salt)
      let encryptPassword = data.password
      update["password"] = encryptPassword
    }

    
    const findId=await userModel.find({_id:userId,isDeleted:false})
    if(findId.length==0) return res.status(404).send({status:false,message:"No user exist with this Id"})
    if(findId.isDeleted) return res.status(404).send({status:false,message:"The user you are trying to find is deleted"})
  
     await userModel.findOneAndUpdate(
        { _id: userId },
        {$set:update},
        { new: true }
      )
    res.status(200).send({ status: true, message: 'Success', data: findId
 })

}
catch (error) {res.status(500).send({status:false, message: error.message })}}






// .......................................Delete User Api ....................................................//

exports.deleteuser = async function (req, res) {
try {
 let userId = req.params.userId
      if (!isValidId(userId)) {
        return res.status(400).send({ status: false, message: "userId not valid" }) }
      let userData = await userModel.findOne({ _id: userId,isDeleted: false})
      if (!userData) {
        return res.status(404).send({ status: false, message: "user not exist" })
      }
  
      await userModel.updateOne(
        { _id: userId },
        { isDeleted: true  }
      );
  
      return res.status(200).send({ status: true, message: "user Successfully Deleted" })
    } 
    catch (err) {
      return res.status(500).send({ satus: false, err: err.message })
    }
  }

/* ------------------------------------------- Login User --------------------------------------------------- */

exports.loginUser = async function (req, res) {

  try {

    let data = req.body
    let { email, password, ...rest } = data
    
    
 if (!isValidBody(data)){return res.status(400).send({status: false,message: "Please provide data in body"})}
if (isValidBody(rest)) { return res.status(400).send({ status: false, message: "You can enter only email and password." }) }


    if (!email || !password) {
      return res.status(400).send({ status: false, message: "Please provide email and password" })
      }

    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "Email is invalid!" })
    }

    if (!isValidPassword(password)) {
      return res.status(400).send({status: false,message:"Password should be of 8 to 15 characters and it should contain one Uppercase, one lower case and Number Ex - AbhisheK12345,Qwe#121"})
    }

    let checkEmail = await userModel.findOne({ email: email })

    if (!checkEmail) {
      return res.status(401).send({ status: false, message: "User is not registered"})
    }

    let encryptPwd = checkEmail.password

    await bcrypt.compare(password, encryptPwd, function (err, result) {

      if (result) {

        let token = jwt.sign(
          { _id: checkEmail._id.toString() },
          "Avinash",
          { expiresIn: "1d"}
        )
         console.log(token)
        return res.status(201).send({status: true,message: "User login successfull",data: { userId: checkEmail._id, token: token }})
      } 
      else {
        return res.status(401).send({ status: false, message: "Please Provide correct password" })
      }
    })

  } catch (err) {
    res.status(500).send({ staus: false, message: err.message });
  }
}