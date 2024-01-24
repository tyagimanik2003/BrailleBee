import React, { useRef, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { FaRegFilePdf } from "react-icons/fa";
import { Audio } from "react-loader-spinner";
import { GoDownload } from "react-icons/go";

const ConvertToBrf = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [pdfs, setPdfs] = useState([]);
  const [loadingOutputs, setLoadingOutputs] = useState(false);
  const [outputDetails, setOutputDetails] = useState({});
  const [loadingOutputsPdfIds, setLoadingOutputsPdfIds] = useState({});
  const intervalRef = useRef(null);

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

  // useEffect(() => {
  //   const fetchOutputDetails = async () => {
  //     const response = await fetch(`/api/user/output/${currentUser._id}/${pdfId}`)
  //     const data = response.json();
  //   }
  // }, [])

  const fetchOutputDetails = async (pdfId) => {
    try {
      const response = await fetch(`api/user/outputbrf/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      // console.log("Response Data:", responseData);

      const outputDetailsMap = {};

      if (Array.isArray(responseData)) {
        // If it's an array, iterate through and store output details
        responseData.forEach((output) => {
          outputDetailsMap[output.pdfId] = output;
        });
      } else if (typeof responseData === "object" && responseData.pdfId) {
        // If it's a single object, directly store the output details
        outputDetailsMap[responseData.pdfId] = responseData;
        setLoadingOutputsPdfIds((prevLoadingIds) => ({
          ...prevLoadingIds,
          [pdfId]: false,
        }));
      } else {
        console.error(
          "Invalid response format. Expected an array or a single object."
        );
      }

      // Filter output details based on fileName
      const filteredOutputDetails = Object.values(outputDetailsMap).filter(
        (output) => {
          return (
            output.fileName.includes("Brf(eng)") ||
            output.fileName.includes("Brf(hin)")
          );
        }
      );
      console.log(filteredOutputDetails);
      // Clear loading state for the specific pdfId
      const newOutputDetailsMap = {};

      // Clear loading state for the specific pdfId
      setLoadingOutputsPdfIds((prevLoadingIds) => ({
        ...prevLoadingIds,
        [pdfId]: false,
      }));

      // Store filtered output details in a dictionary with pdfId as the key
      filteredOutputDetails.forEach((output) => {
        newOutputDetailsMap[output.pdfId] = output;
      });

      console.log(newOutputDetailsMap);
      setOutputDetails(newOutputDetailsMap);
      setLoadingOutputs(false);
      setLoadingOutputsPdfIds(null);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   // Fetch output details for each PDF when the component mounts
  //     console.log(outputDetails);
  // }, []);

  const handleProcess = async (pdfId, language) => {
    try {
      setLoadingOutputs(true);
      setLoadingOutputsPdfIds((prevLoadingIds) => ({
        ...prevLoadingIds,
        [pdfId]: true,
      }));
      let endpoint;
      if (language === 'English') {
        endpoint = `/api/user/processtobrf/${pdfId}/${currentUser._id}`;
      } else if (language === 'Hindi') {
        endpoint = `/api/user/processtohindibrf/${pdfId}/${currentUser._id}`;
      } else {
        console.error('Unsupported language:', language);
        return;
      }
      
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async (outputId) => {
    try {
      // Fetch output details including file path
      const response = await fetch(`api/user/brfoutputdetail/${outputId}`);
      const blob = await response.blob();

      // Create a temporary link element
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = "output.docx";
      downloadLink.click();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getPdfs();
    fetchOutputDetails();
    callme();
  }, []);
  function callme() {
    var timeOutPromise = new Promise(function (resolve, reject) {
      // 5 Second delay
      setTimeout(resolve, 70000, "Timeout Done");
    });

    Promise.all([fetchOutputDetails(), timeOutPromise])
      .then(([responseData, timeoutResult]) => {
        console.log("At least 5 secs + TTL (Network/server)");
        console.log(responseData);
        // Repeat
        callme();
      })
      .catch((error) => {
        console.error(error);
        // Handle errors appropriately, e.g., set an error state or log
        // Repeat
        callme();
      });
  }
  return (
    <>
      <div className="ml-[16%] h-[100vh] overflow-hidden">
        <div className="flex justify-between p-8 items-center w-[100%]">
          <h1 className="text-2xl flex items-center">
            DASHBOARD <FaArrowRight className="mx-3" /> CONVERT TO BRF COPY
          </h1>
        </div>
        <div className="h-[82%] w-[83%] border-2 bg-transparent rounded-2xl mt-2 absolute overflow-y-scroll">
          <table className="w-[100%] overflow-y-scroll">
            <thead className="p-4">
              <tr className="text-lg text-gray-600 p-5 border-b-4 border-dotted">
                <th className="py-3 w-[10rem]">File Name</th>
                <th className="w-[10rem]">Language</th>
                <th className="w-[10rem]">Convert</th>
                <th className="w-[10rem]">Progress</th>
                <th className="w-[10rem]">Output (docx)</th>
                <th className="w-[10rem]">Download</th>
              </tr>
            </thead>
            <tbody>
              {pdfs.map((pdf) => (
                <tr key={pdf._id}>
                  <td>
                    <h1 className="p-3 flex items-center text-lg">
                      <FaRegFilePdf className="mx-2" />
                      {pdf.fileName}
                    </h1>
                  </td>
                  {/* <td className="p-2">
                    <select
                      value={pdf.selectedLanguage}
                      onChange={(event) => handleLanguageChange(event, pdf._id)}
                      className="p-2 flex items-center mx-auto text-lg rounded-lg"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </td> */}
                  <td className="p-2 text-center">
                      {pdf.language}
                  </td>
                  <td>
                    <div className="flex justify-center">
                      <button
                        className="bg-[#763FC6] text-white text-md mx-auto py-2 rounded-lg px-5"
                        onClick={() => {
                          handleProcess(pdf._id, pdf.language);
                        }}
                      >
                        Convert
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center">
                      {loadingOutputs && loadingOutputsPdfIds[pdf._id] ? (
                        <p className="flex items-end">
                          <Audio
                            height="35"
                            width="35"
                            radius="9"
                            color="blue"
                            ariaLabel="loading"
                            wrapperStyle
                            wrapperClass
                          />{" "}
                          Processing...
                        </p>
                      ) : outputDetails[pdf._id] ? (
                        "Completed"
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>

                  <td className="mx-auto text-center w-[5%]">
                    {outputDetails[pdf._id]
                      ? outputDetails[pdf._id].fileName
                      : "-"}
                  </td>
                  <td className="mx-auto flex justify-center items-center mt-3">
                    <div
                      className={`font-bold flex ml-2 ${
                        outputDetails[pdf._id]
                          ? "text-blue-600 cursor-pointer"
                          : "text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (outputDetails[pdf._id]) {
                          handleDownload(outputDetails[pdf._id]._id);
                        }
                      }}
                    >
                      Download <GoDownload className="w-5 h-5 mx-1" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ConvertToBrf;