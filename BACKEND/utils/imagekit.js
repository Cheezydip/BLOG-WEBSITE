const ImageKit = require('imagekit');

let imagekit = null;

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (publicKey && privateKey && urlEndpoint) {
  imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint
  });
}

const uploadToImageKit = async (fileBuffer, fileName, folder = '/blog') => {
  if (!imagekit) {
    throw new Error('ImageKit is not configured. Please set IMAGEKIT credentials in .env');
  }
  return new Promise((resolve, reject) => {
    imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folder
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

module.exports = {
  imagekit,
  uploadToImageKit
};
