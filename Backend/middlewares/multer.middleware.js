import path from "path";
import multer from "multer";

const Upload = multer({
    dest:'uploads/', // path of destination
    limits:{fileSize:50*1024*1024}, //Max size of file will be 50 MB
    storage:multer.diskStorage({
        // where to store
        destination:'uploads/',
        filename:(_req,file,cb)=>{
            cb(null,file.originalname);
        }
    }),
    fileFilter:(_req,file,cb)=>{
        let ext = path.extname(file.originalname);

        // which type of files to store
        if(
            ext!==".jpg"&&
            ext!==".jpeg"&&
            ext!==".webp"&&
            ext!==".png"&&
            ext!==".mp4"
        ){
            cb(new Error(`unsupported file type ! ${ext}`),false);
            return;
        }

        cb(null,true);
    }
});

export default Upload;