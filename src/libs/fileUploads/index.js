const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage: storage});  

exports.uploadSingleFile = (fieldName = 'file') => {
  return upload.single(fieldName);
}