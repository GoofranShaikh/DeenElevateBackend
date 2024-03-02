
// const multer = require('multer');
// const fs = require('fs'); // For reading image files
// const Muter = require('muter'); // For interacting with Cloudflare Images API



// // Cloudflare credentials (replace with your actual values)
// const cloudflareAccountId = '799d37de063b37ceb15efe753d4fd4d6';
// const cloudflareEmail = 'goofranshaikh98@gmail.com';
// const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/images/v1`;

// // Multer configuration (you can adjust the destination path if needed)
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'images/'); // Destination folder for storing images // Temporary storage for files before Cloudflare upload
//     },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// const upload = multer({ storage }).single('image_url');

// // Function to upload image to Cloudflare Images
// const uploadToCloudflare= async(req,res)=> {
//     upload(req, res, async function (err) {
//         if (err instanceof multer.MulterError) {
//        // A Multer error occurred when uploading
//        return res.status(500).json({ error: err.message });
//      } else if (err) {
//        // An unknown error occurred when uploading
//        return res.status(500).json({ error: err.message });
//      }

//      const hasError=productValidator.schemaValidation(req,'TShirtValidation'); //validate user input
//      if(hasError){
//      return res.status(400).json({ error: hasError });
//      }
     

 
//     try {

 
//     const muter = new Muter({
//       email: cloudflareEmail,
//       zoneId: '', // Not required for Cloudflare Images API
//     });

//     const token = await muter.tokens.create({ type: 'upload' });
//     const headers = { Authorization: `Bearer ${token}` };

//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(file.path));

//     const response = await fetch(uploadUrl, {
//       method: 'POST',
//       headers,
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Error uploading image: ${await response.text()}`);
//     }

//     const data = await response.json();
//     console.log('Image uploaded successfully:', data.url);

//     // Delete the local file after successful Cloudflare upload
//     fs.unlinkSync(file.path);

//     return data.url;
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     throw error; // Rethrow to handle in the route handler
//   }
// })
// }

// // Route for handling image uploads
// // app.post('/upload', upload.single('image'), async (req, res) => {
// //   try {
// //     const uploadedImageUrl = await uploadToCloudflare(req.file);
// //     res.send(`File uploaded successfully: ${uploadedImageUrl}`);
// //   } catch (error) {
// //     console.error('Error in upload route:', error);
// //     res.status(500).send('Error uploading image');
// //   }
// // });

// module.exports={uploadToCloudflare}
