import express from 'express';
import { test, updateUser, uploadFiles, uploadPdfFiles, fetchFiles, deletePdf, processPdf,getOutputDetails,getOutputForDownload, viewPdf, viewDocx, processHindiPdf, processBrf, processHindiBrf, getBrfOutputDetails, getBrfOutputForDownload } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Set the filename to be unique
    }
  });
  
  const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
// router.post('/upload/:id', upload.array('files', 500), uploadFiles);
router.post('/uploadpdfs/:id', upload.array('files', 500), uploadPdfFiles);
router.get('/pdf/:id', fetchFiles);
router.delete('/deletepdf/:id', deletePdf);
router.post('/processpdf/:id/:userid', processPdf);
router.post('/processpdfhindi/:id/:userid', processHindiPdf);
router.post('/processtobrf/:id/:userid', processBrf);
router.post('/processtohindibrf/:id/:userid', processHindiBrf);
router.get('/output/:userId', getOutputDetails);
router.get('/outputbrf/:userId', getBrfOutputDetails);
router.get('/outputdetail/:outputId', getOutputForDownload);
router.get('/brfoutputdetail/:outputId', getBrfOutputForDownload)
router.get('/viewpdf/:userId/:fileId', viewPdf)
router.get('/viewdocx/:userId/:wordName', viewDocx);

export default router;