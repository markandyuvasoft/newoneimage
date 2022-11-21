import express from "express";
import Auth from '../models/authM.js'
import multer from 'multer'
import path from "path";
import fileUpload from 'express-fileupload'


const authrouter = express.Router()

//FILE STORAGE QUERY START........................
const storage = multer.diskStorage({
  destination: './public/assets/images',
  
  filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
//FILE STORAGE QUERY END....................................................................................


//FILE FILTER QUERY START....................................................................................
const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
      || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf'){
          cb(null, true);
      }else {
          cb(null, false);
      }

}
const upload= multer({storage:storage, fileFilter:filefilter})
//post method..................

authrouter.use('/public/assets/images', express.static('public/assets/images'));
authrouter.post("/post",upload.single('Photo'), async (req, res) => {
  try{
    const file = new Auth({
        Photo: req.file.originalname,
        filePath: req.file.path,
        Name: req.body.Name,
        Post:req.body.Post,
        Description:req.body.Description,
        Active:req.body.Active
  
    });
    await file.save();
    res.status(201).send(file);
}catch(error) {
    res.status(400).send(error.message);
}
})

//get by id method..................................
authrouter.get("/get/:id",async(req,res)=>{

  try{
  const _id= req.params.id
  const details= await Auth.findById(_id)

  res.status(200).send(details)
}
  catch(err)
  {
    res.status(400).send(err)
  }
})

//get all.....................................
authrouter.get("/all",async(req,res)=>{

  try{
  const record= await Auth.find({})

  res.status(200).send(record)
}
  catch(err)
  {
    res.status(400).send(err)
  }
})

//update details..........................................
authrouter.put("/update/:id",upload.single('Photo'),async(req,res)=>{

  try{
  
    const _id= req.params.id;

    const update= await Auth.findByIdAndUpdate(_id,{

      Photo: req.file.originalname,
      filePath: req.file.path,
      Name: req.body.Name,
      Post:req.body.Post,
      Description:req.body.Description,
      Active:req.body.Active
    })


    res.send(update)

}catch(err){

res.status(400).send(err)
}

})

//delete method ......................................
authrouter.delete("/delete/:id",async(req,res)=>{

    try{
        const _id= req.params.id

        const del= await Auth.findByIdAndDelete(_id)

        res.status(200).send({success: "deleted user data"})
    }
    catch(err)
    {
        res.status(500).send(err)
    }
})
export default authrouter