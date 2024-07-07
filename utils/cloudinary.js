import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

 cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// const uploadImageToCloudinary = async (file) => (
//   await cloudinary.uploader.upload(file,
//     {
//       // acceptedfiletypes
//       dropZone: "nameof foldrto upload to",
//       allowed_formats
//     }
//   )
// );

// const uploadPDFToCloudinary = cloudinary.uploader.upload("name_of_file.pdf",
//   // options go here 
//   {
//     // resource_type: "raw", // enable upload of docx and pdf and other non image files
//     resource_type: "raw",
//   },
//   function (error, result) {
//     console.log(result, error);
//   }
// );

// this "ACTS" as multer setup via multer-storage-cloudinary
export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'qualit-bug-tracker', // cloud folder
    allowed_formats: 'jpeg, jpg, gif, png, pdf'
  }
});

export const removeOnErr = async (filename) => {
  await cloudinary.uploader.destroy(filename);
};

export { cloudinary };
//  -----------------------------
//  -----------------------------
// // Function to upload a PDF to Cloudinary
// export const uploadPDFToCloudinary = (file) => {
//   return cloudinary.uploader.upload(file, {
//     resource_type: "raw",
//   }, function (error, result) {
//     console.log(result, error);
//   });
// };

// // This "acts" as multer setup via multer-storage-cloudinary
// export const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'qualit-bug-tracker', // cloud folder
//     allowed_formats: ['jpeg', 'jpg', 'gif', 'png', 'pdf']
//   }
// });
//  -----------------------------
//  -----------------------------
// cloudinary.v2.uploader
// .upload("sample_spreadsheet.xls", 
//   { resource_type: "raw" })
// .then(result=>console.log(result));

// module.exports = {
//   cloudinary,
//   storage,
//   removeOnErr
// }
// module.exports = { cloudinary, uploadImageToCloudinary, uploadPDFToCloudinary, storage, removeOnErr };

// ##############################
// ############################## ORIGINAL
// ##############################
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // this "ACTS" as multer setup via multer-storage-cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'qualit-bug-tracker', // cloud folder
//     allowed_formats: 'jpeg, jpg, gif, png, pdf',
//     // public_id: function (req, file, cb) {
//       // `${file.fieldname}-${Date.now()}-${file.originalname}`
//     // }
//   }
// });

// const removeOnErr = async (filename) => {
//   await cloudinary.uploader.destroy(filename);
// };
// module.exports = { cloudinary, storage, removeOnErr };