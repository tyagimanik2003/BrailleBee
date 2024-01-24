import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import JSZip from "jszip";
import * as DocxPreview from "docx-preview";
// import mammoth from "mammoth";

// import { DocViewer, DocViewerRenderers } from "react-doc-viewer";

const CompareFiles = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [pdfs, setPdfs] = useState([]);
  const [outputDetails, setOutputDetails] = useState({ outputDetails: [] });
  const [selectedInputPdf, setSelectedInputPdf] = useState(null);
  const [selectedOutputPdf, setSelectedOutputPdf] = useState(null);
  const [selectedDocxContent, setSelectedDocxContent] = useState(null);
  const [filteredOutputDetails, setFilteredOutputDetails] = useState([]);

  const getPdfs = async (req, res, next) => {
    try {
      const data = await fetch(`api/user/pdf/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await data.json();
      setPdfs(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPdfs();
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const [outputDetailsResponse, brfOutputDetailsResponse] =
        await Promise.all([
          fetch(`api/user/output/${currentUser._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(`api/user/outputbrf/${currentUser._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

      const outputDetailsData = await outputDetailsResponse.json();
      const brfOutputDetailsData = await brfOutputDetailsResponse.json();

      // Assuming outputDetailsData and brfOutputDetailsData are arrays
      const combinedData = {
        outputDetails: outputDetailsData.concat(brfOutputDetailsData),
      };

      setOutputDetails(combinedData);
      console.log("Combined Data:", combinedData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSelectInputPdf = (pdf) => {
    console.log(pdf);
    setSelectedInputPdf(pdf);

    const filteredOutputs = outputDetails.outputDetails.filter(
      (output) => output.pdfId === pdf
    );
  
    setFilteredOutputDetails(filteredOutputs);
  };

  const handleSelectOutputPdf = (selectedValue) => {
    setSelectedOutputPdf(selectedValue);
    previewDocx(selectedValue);
  };

  useEffect(() => {
    console.log(selectedDocxContent);
  }, [selectedDocxContent]);

  const previewDocx = async (docFileName) => {
    if (!docFileName) {
      return;
    }

    try {
      const response = await fetch(
        `api/user/viewdocx/${currentUser._id}/${docFileName}`
      );
      const docBlob = await response.blob();
      console.log(docBlob);
      // Reference the Container DIV.

      // Set the Document options.
      var docxOptions = Object.assign(DocxPreview.defaultOptions, {
        useMathMLPolyfill: true,
      });
      const container = document.querySelector("#word-container");

      // Render the Word Document.
      await DocxPreview.renderAsync(docBlob, container, null, docxOptions);
    } catch (error) {
      console.error("Error previewing DOCX:", error);
    }
  };

  return (
    <>
      <div className="ml-[16%] h-[100vh] overflow-y-scroll">
        <div className="flex justify-between p-8 items-center w-[100%]">
          <h1 className="text-2xl flex items-center">
            DASHBOARD <FaArrowRight className="mx-3" /> COMPARE FILES
          </h1>
        </div>
        <div className="flex px-8 w-[100%] text-lg">
          <div className="w-[50%] ">
            <label className="block">CHOOSE INPUT FILE TO VIEW</label>
            <select
              className="w-[90%] py-2 my-2 rounded-lg"
              onChange={(e) => handleSelectInputPdf(e.target.value)}
            >
              <option>
                Choose File
              </option>
              {pdfs.map((pdf) => (
                <option key={pdf._id} value={pdf._id}>
                  {pdf.fileName}
                </option>
              ))}
            </select>
            {selectedInputPdf && (
              <object
                data={`api/user/viewpdf/${currentUser._id}/${selectedInputPdf}`}
                type="application/pdf"
                width="90%"
                height="650px"
                className="overflow-y-scroll my-[2rem] border-2 border-black rounded-lg p-2"
              >
                <p>PDF not available</p>
              </object>
            )}
          </div>
          <div className="w-[80%]">
            <label>CHOOSE WORD FILE TO VIEW </label>
            <select
              className="w-[100%] py-2 my-2 rounded-lg"
              onChange={(e) => handleSelectOutputPdf(e.target.value)}
              
            >                <option>Choose File</option>

              {filteredOutputDetails.map((doc) => (
                  <option key={doc._id} value={doc.fileName}>
                    {doc.fileName}
                  </option>
                ))}
            </select>
            <div className="w-[100%]">
              {/* <input id="files" type="file" accept=".docx"/>
            <input type="button" id="btnPreview" value="Preview Word Document" onClick={PreviewWordDoc}/> */}
              <div
                id="word-container"
                className="h-[650px] overflow-x-scroll overflow-y-scroll my-[2rem] border-2 border-black rounded-lg p-2"
              ></div>{" "}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareFiles;