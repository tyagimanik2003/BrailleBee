import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import multer from "multer";
import path, { dirname } from "path";
import Pdf from "../models/pdf.model.js";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import Output from "../models/output.model.js";
import BrfOutput from "../models/outputbrf.model.js";
import fs from "fs";
import { promisify } from "util";

export const test = (req, res) => {
  res.send({ message: "API is working!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          // profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const uploadFiles = async (req, res, next) => {
  try {
    const files = req.files.map((file) => file.filename);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { uploadedFiles: files } },
      { new: true }
    );

    res.json(user);
    // const files = req.files;
    // const data = req.body;
    // console.log({data, files});
    return res.status(200).send("File upload success");
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadPdfFiles = async (req, res, next) => {
  try {
    const files = req.files;
    const userId = req.params.id;
    const selectedLanguages = req.body.languages; 
    console.log(selectedLanguages);
    const pdfDocuments = files.map((file, index) => {
      const language = Array.isArray(selectedLanguages)
        ? selectedLanguages[index]
        : selectedLanguages;

      return {
        userId: userId,
        fileName: file.filename,
        filePath: file.path,
        size: Math.ceil(file.size / 1024),
        language: language, // Map each file to its corresponding language
      };
    });

    const createdPdfDocuments = await Pdf.insertMany(pdfDocuments);

    res
      .status(201)
      .json({ message: "PDFs uploaded successfully", createdPdfDocuments });
  } catch (err) {
    next(err);
  }
};

export const fetchFiles = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const pdfs = await Pdf.find({ userId: userId });
    return res.json(pdfs);
  } catch (err) {
    next(err);
  }
};

export const deletePdf = async (req, res, next) => {
  try {
    const pdfId = req.params.id;
    const pdf = await Pdf.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Delete the PDF
    await Pdf.findByIdAndDelete(pdfId);

    res.status(200).json({ message: "PDF deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const processPdf = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const pdfId = req.params.id;
    const existingOutput = await Output.findOne({ userId, pdfId });

   
    const pdf = await Pdf.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: "No PDF found for the given ID" });
    }
    const convScriptPath = path.join(__dirname, "conv.py");
    const projectRoot = path.resolve(__dirname, "../../");
    const pdfPath = path.join(projectRoot, pdf.filePath);
    const pdfFileNameWithoutExtension = path.parse(pdf.fileName).name;

    const outputFileName = `output_Editable(eng)_${pdfFileNameWithoutExtension}.docx`;
    const outputFilePath = path.join(projectRoot, "outputs", outputFileName);
    if (existingOutput && existingOutput.fileName === outputFileName) {
      console.log("Converted file already exists!");
      return res.status(400).json({ message: "File with the same name already exists" });
    }

    console.log(outputFilePath);
    const pythonProcess = spawn("python", [
      convScriptPath,
      pdfPath,
      outputFilePath,
    ]);

    pythonProcess.stdout.on("data", async (data) => {
      console.log(`Python script output: ${data}`);

      const output = new Output({
        userId: userId, // Assuming you have the user information in the request
        pdfId: pdfId,
        fileName: outputFileName,
        filePath: outputFilePath,
      });

      await output.save();
    });
    pythonProcess.stderr.on("data", (error) => {
      console.error(`Python script error: ${error}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
    });

    res
      .status(200)
      .json({ message: "Conversion process initiated for the PDF" });
    res.status(200).json({ message: "PDF processing initiated" });
  } catch (error) {
    next(error);
  }
};

export const processHindiPdf = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const pdfId = req.params.id;
    // const existingOutput = await Output.findOne({ userId, pdfId });

    // if (existingOutput) {
    //   console.log(`PDF with ID ${pdfId} already processed`);
    //   return res.status(200).json({ message: "PDF already processed" });
    // }
    const pdf = await Pdf.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: "No PDF found for the given ID" });
    }

    const convScriptPath = path.join(__dirname, "convhin.py");
    const projectRoot = path.resolve(__dirname, "../../");
    const pdfPath = path.join(projectRoot, pdf.filePath);
    const pdfFileNameWithoutExtension = path.parse(pdf.fileName).name;

    const outputFileName = `output_Editable(hin)_${pdfFileNameWithoutExtension}.docx`;
    const outputFilePath = path.join(projectRoot, "outputs", outputFileName);
    console.log(outputFilePath);
    const pythonProcess = spawn("python", [
      convScriptPath,
      pdfPath,
      outputFilePath,
    ]);

    pythonProcess.stdout.on("data", async (data) => {
      console.log(`Python script output: ${data}`);

      const output = new Output({
        userId: userId, // Assuming you have the user information in the request
        pdfId: pdfId,
        fileName: outputFileName,
        filePath: outputFilePath,
      });

      await output.save();
    });
    pythonProcess.stderr.on("data", (error) => {
      console.error(`Python script error: ${error}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
    });

    res
      .status(200)
      .json({ message: "Conversion process initiated for the PDF" });
    res.status(200).json({ message: "PDF processing initiated" });
  } catch (error) {
    next(error);
  }
};

export const processBrf = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const pdfId = req.params.id;
    // const existingOutput = await Output.findOne({ userId, pdfId });
    // if (existingOutput) {
    //   console.log(`PDF with ID ${pdfId} already processed`);
    //   return res.status(200).json({ message: "PDF already processed" });
    // }
    const pdf = await Pdf.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: "No PDF found for the given ID" });
    }
    const convScriptPath = path.join(__dirname, "convBRF.py");
    const projectRoot = path.resolve(__dirname, "../../");
    const pdfPath = path.join(projectRoot, pdf.filePath);
    const pdfFileNameWithoutExtension = path.parse(pdf.fileName).name;

    const outputFileName = `output_Brf(eng)_${pdfFileNameWithoutExtension}.docx`;
    const outputFilePath = path.join(projectRoot, "outputs", outputFileName);
    console.log(outputFilePath);
    const pythonProcess = spawn("python", [
      convScriptPath,
      pdfPath,
      outputFilePath,
    ]);

    pythonProcess.stdout.on("data", async (data) => {
      console.log(`Python script output: ${data}`);

      const output = new BrfOutput({
        userId: userId, // Assuming you have the user information in the request
        pdfId: pdfId,
        fileName: outputFileName,
        filePath: outputFilePath,
      });

      await output.save();
    });
    pythonProcess.stderr.on("data", (error) => {
      console.error(`Python script error: ${error}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
    });

    res
      .status(200)
      .json({ message: "Conversion process initiated for the PDF" });
    res.status(200).json({ message: "PDF processing initiated" });
  } catch (error) {
    next(error);
  }
};

export const processHindiBrf = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const pdfId = req.params.id;
    // const existingOutput = await Output.findOne({ userId, pdfId });
    // if (existingOutput) {
    //   console.log(`PDF with ID ${pdfId} already processed`);
    //   return res.status(200).json({ message: "PDF already processed" });
    // }
    const pdf = await Pdf.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ message: "No PDF found for the given ID" });
    }
    const convScriptPath = path.join(__dirname, "convhinBRF.py");
    const projectRoot = path.resolve(__dirname, "../../");
    const pdfPath = path.join(projectRoot, pdf.filePath);
    const pdfFileNameWithoutExtension = path.parse(pdf.fileName).name;
    const outputFileName = `output_Brf(hin)_${pdfFileNameWithoutExtension}.docx`;
    const outputFilePath = path.join(projectRoot, "outputs", outputFileName);
    console.log(outputFilePath);
    const pythonProcess = spawn("python", [
      convScriptPath,
      pdfPath,
      outputFilePath,
    ]);

    pythonProcess.stdout.on("data", async (data) => {
      console.log(`Python script output: ${data}`);

      const output = new BrfOutput({
        userId: userId, // Assuming you have the user information in the request
        pdfId: pdfId,
        fileName: outputFileName,
        filePath: outputFilePath,
      });

      await output.save();
    });
    pythonProcess.stderr.on("data", (error) => {
      console.error(`Python script error: ${error}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
    });

    res
      .status(200)
      .json({ message: "Conversion process initiated for the PDF" });
    res.status(200).json({ message: "PDF processing initiated" });
  } catch (error) {
    next(error);
  }
};

export const getOutputDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const output = await Output.find({ userId });
    console.log(output);

    if (output) {
      res.status(200).json(output);
    } else {
      res
        .status(404)
        .json({ message: "Output not found for the given user and PDF" });
    }
  } catch (error) {
    next(error);
  }
};

export const getBrfOutputDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const output = await BrfOutput.find({ userId });
    console.log(output);

    if (output) {
      res.status(200).json(output);
    } else {
      res
        .status(404)
        .json({ message: "Output not found for the given user and PDF" });
    }
  } catch (error) {
    next(error);
  }
}

export const getOutputForDownload = async (req, res, next) => {
  try {
    const outputId = req.params.outputId;
    const output = await Output.findById(outputId);

    if (!output) {
      return res.status(404).json({ message: "Output not found" });
    }

    res.download(output.filePath, output.fileName);
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBrfOutputForDownload = async (req, res, next) => {
  try {
    const outputId = req.params.outputId;
    const output = await BrfOutput.findById(outputId);

    if (!output) {
      return res.status(404).json({ message: "Output not found" });
    }

    res.download(output.filePath, output.fileName);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const viewPdf = async (req, res, next) => {
  const { userId, fileId } = req.params;
  const pdf = await Pdf.findOne({ userId, _id: fileId });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Retrieve the file name from the found PDF
    const fileName = pdf.fileName;
  const pdfPath = path.resolve(__dirname, "../../");
  const filePath = path.join(pdfPath, `uploads/${fileName}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
  console.log(filePath);
};

const readFileAsync = promisify(fs.readFile);

export const viewDocx = async (req, res, next) => {
  try {
    const { userId, wordName } = req.params;
    const wordPath = path.resolve(__dirname, "../../");
    const fileWordPath = path.join(wordPath, `outputs/${wordName}`);
    console.log(fileWordPath);

    const fileContent = await readFileAsync(fileWordPath, "utf-8");
    
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.sendFile(fileWordPath);
  } catch (error) {
    next(error);
  }
};