import multer from 'multer';
import { storage } from './cloudinary';
// import { fileTypeFromFile } from 'file-type';

// for testing diskstorage / storage on local comp
const storageLocal = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
});

// const uploadImage = multer({
//   // storage: storage,
//   limits: { fileSize: 3 * 1024 * 1024 }, // file 1mb in size
//   fileFilter: fileFilter
// })
// const uploadPDF = multer({
//   // storage: storage,
//   limits: { fileSize: 3 * 1024 * 1024 }, // file 1mb in size
//   fileFilter: fileFilter
// })

// ! strictly upload to local storage folder
const uploadLocal = multer({
  storageLocal,
  limits: { fileSize: 3 * 1024 * 1024 },
  async fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(gif|jpe?g|png|pdf)$/i)) {
      return cb(new Error("Only .gif, .jpg, .jpeg, .png, or .pdf files can be uploaded."));
    }
  }
}); //3MB

// const isValidPdf = async (fileToUpload) => {
//   let fileType = await fileTypeFromFile(fileToUpload);

//   if (fileType.ext === 'pdf' && fileType.mime === 'application/pdf') {
//     return true;
//   };
//   return false;
//   // returns: {ext: 'png', mime: 'image/'png'}
// };

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/gif' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    //reject file
    cb({message: 'Unsupported file format'}, false)
  }
}

// ! upload to cloudinary
export const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  async fileFilter(req,file, cb) {
    // check to see if pdf is a valid file
    if (file.mimetype === 'application/pdf') {
      return cb(null, true);
      /*
      error - unhandledRejection: {
        message: 'Image file format pdf not allowed',
        name: 'Error',
        http_code: 400
      }
      undefined
      */
    }
    if (file.mimetype === 'image/gif' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      return cb(null, true);
    }
    return cb("Only .gif, .jpg, .jpeg, or .png image files can be uploaded or .pdf files.")
  }
}); //3MB
