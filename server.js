const express=require('express');
const multer=require('multer');

const cors=require('cors');

const app=express();
app.use(cors());

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null,__dirname+"/uploads");
    },
    filename:function(req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`);
    }
});

const fileFilter=(req,files,cb)=>{
  if (files.mimetype === 'image/jpeg' || 
    files.mimetype === 'image/png' || 
    files.mimetype === 'application/pdf' || 
    files.mimetype === 'image/gif' || 
    files.mimetype === 'image/bmp' || 
    files.mimetype === 'image/tiff' || 
    files.mimetype === 'text/plain' || 
    files.mimetype === 'text/csv' || 
    files.mimetype === 'application/msword' || 
    files.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    files.mimetype === 'application/vnd.ms-excel' || 
    files.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
    files.mimetype === 'application/zip' || 
    files.mimetype === 'application/x-rar-compressed' || 
    files.mimetype === 'audio/mpeg' || 
    files.mimetype === 'audio/wav' || 
    files.mimetype === 'video/mp4' || 
    files.mimetype === 'video/x-msvideo') {
    cb(null, true);
} else {
    cb(null, false);
}

}

const limits = {
    fileSize: 200 * 1024 * 1024, // 200 MB in bytes
  };

const upload=multer({ storage:storage , fileFilter:fileFilter , limits:limits});

app.post("/upload",upload.array("files"),(req,res)=>{
    if (req.files && req.files.length > 0) {
        // Check if any of the uploaded files exceeded the size limit
        const fileExceedsLimit = req.files.some((file) => file.size > limits.fileSize);
        
        if (fileExceedsLimit) {
          res.status(400).json({ error: 'Uploaded file size exceeds the 200 MB limit.' });
        } else {
          console.log(req.files);
          res.json({ status: "Files received" });
        }
      } else {
        res.status(400).json({ error: 'No files were uploaded.' });
      }
})

app.listen(5001,function(){
    console.log("Server running on port 5001");
})