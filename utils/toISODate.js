export const singleISODate = (date) => {
  console.log("*****converting date*****")
  let createdAt = date;
  let newISODate = createdAt.toISOString().slice(0,10);
  return newISODate;
};

// useEffect(() => {
//   if (!token) {
//     dispatch({type: "LOGOUT"});
//     logoutUser();
//     return router.push("/");
//   }
//   setIsLoading(false);
// }, []);

// useEffect(() => {
//   if (!token || !Cookies.get("blog__isLoggedIn")) {
//     dispatch({type: "LOGOUT"});
//     logoutUser();
//     return router.push("/");
//   }
//   setIsLoading(false);
// }, []);

// useEffect(() => {
//     if (token && auth.isAuthenticated) {
//       dispatch({type: "GET_ALL_POSTS", payload: {posts: initGeneral.posts, trends: initTrend}});
//       dispatch({type: "GET_FOLLOW_STATUS", payload: initFollow});
//       localStorage.setItem("blog__trends", JSON.stringify(initTrend));
//       localStorage.setItem("blog__follows", JSON.stringify(initFollow));
//     }
//   }, [initGeneral]);

// *** Cloudinary DOCX PDF IMAGE UPLOAD MULTER ***
/*
Create a cloudinary account and in the Dashboard section remember the cloud name,api key and api secret.

2. Store the cloud name, api key and api secret in dev environment.

3. Now, Install the multer package. After installing the multer package, write the following code in your ide:

const multer = require(‘multer’)

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, ‘uploads/’)
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})

4. Now you can use routing method such as “post” to receive document as filetype and upload the document to cloudinary and in response, you will get the id and url and you can save the id and url in your database, this id and url will help you to display or retrieve your document. I have saved my id and url in mongoose collection- Document.

router.post(‘/upload’, async(req, res, next) => {
  const upload = multer({ storage }).single(‘image’)
  const id=undefined
  const url=undefined
  upload(req, res, function(err) {
    if (err) {
      return res.send(err)
    }
    console.log(‘file uploaded to server’)
    console.log(req.file)
    // SEND FILE TO CLOUDINARY
    const cloudinary = require(‘cloudinary’).v2
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    })
    const path = req.file.path
    const uniqueFilename = new Date().toISOString()
    cloudinary.uploader.upload(
      path,
      {
        public_id: `blog/${uniqueFilename}`,
        tags: `blog`
      }, // directory and tags are optional
      async function(err, image) {
        if (err) return res.send(‘file format is wrong! Only image file supported’)
      console.log(‘file uploaded to Cloudinary’)
      // remove file from server
      const fs = require(‘fs’)
      fs.unlinkSync(path)
      // return image details
      // res.json(‘Uploaded Successfully’)
      const document=new Document({
        doc_main_id:image.asset_id,
        doc_main_url:image.secure_url,
        owner:req.user._id
      })
      await document.save()
      res.status(201).json(document)
      console.log(image)
    })
  })
})

5. Now, you can check by uploading document through postman.
*/


/*
router.post("/uploadFileMessage", upload.single('file'), async (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path ,{use_filename :true, resource_type:'raw'},async function(error, result) { 
    if(error) return res.status(400).send(error)
     return res.status(200).send(result)
    })
})

{asset_id: '32aa9529bb237b80737e872d8313221f', public_id: 'f989a1c665b42821324562654bd11daf_qxqhhj', version: 1634986874, version_id: '7a0fd2acf8d2b81aca2bfb7bace9266f', signature: '7cd17b6085fe9651fc8aaf7b43a4964d79626b5a', …}
access_mode: "public"
api_key: "993546999818549"
asset_id: "32aa9529bb237b80737e872d8313221f"
bytes: 1438293
created_at: "2021-10-23T11:01:14Z"
etag: "c736d1539c693c54f4085a44ae6e353a"
original_filename: "f989a1c665b42821324562654bd11daf"
placeholder: false
public_id: "f989a1c665b42821324562654bd11daf_qxqhhj"
resource_type: "raw"
secure_url: "https://res.cloudinary.com/duldhdjsj/raw/upload/v1634986874/f989a1c665b42821324562654bd11daf_qxqhhj"
signature: "7cd17b6085fe9651fc8aaf7b43a4964d79626b5a"
tags: []
type: "upload"
url: "http://res.cloudinary.com/duldhdjsj/raw/upload/v1634986874/f989a1c665b42821324562654bd11daf_qxqhhj"
version: 1634986874
version_id: "7a0fd2acf8d2b81aca2bfb7bace9266f"
[[Prototype]]: Object
*/