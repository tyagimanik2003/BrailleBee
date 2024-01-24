import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegFilePdf } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { RiFileWord2Line } from "react-icons/ri";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import backgroundImage from "../assets/opaqueBG.svg";
import { FaArrowRight } from "react-icons/fa";

const ManageFiles = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [pdfs, setPdfs] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [updated, setUpdated] = useState(null);

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
  }, []);

  const handleUpload = async (e) => {
    // e.preventDefault();
    try {
      setIsLoading(true);
      const selectedLanguage = document.getElementById("selectLanguage").value;
      console.log(selectedLanguage);
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
        formData.append("languages", selectedLanguage);
      }
      console.log(formData);

      const response = await fetch(`/api/user/uploadpdfs/${currentUser._id}`, {
        method: "POST",
        body: formData,
      });

      const updatedUser = await response.json();
      setUpdated(updatedUser);
      console.log("User with updated files:", updatedUser);
      setShowPopup(false);
      // Add logic to update the state or inform the user about the successful upload
    } catch (error) {
      console.error("Error uploading files:", error);
      // Add logic to handle errors, e.g., show an error message
    } finally {
      setIsLoading(false);
    }
  };
  const handlePopup = () => {
    setShowPopup(true);
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };
  const handleDeletePdf = async (pdfId, pdfFileName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the file "${pdfFileName}"?`
    );

    if (!confirmDelete) {
      return;
    }
    try {
      await fetch(`/api/user/deletepdf/${pdfId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setPdfs((prevPdfs) => prevPdfs.filter((pdf) => pdf._id !== pdfId));
    } catch (error) {
      console.error("Error deleting PDF:", error);
    }
  };
  return (
    <>
      <div className="ml-[16%] h-[100vh] overflow-hidden">
        <div className="flex justify-between p-8 items-center w-[100%]">
          <h1 className="text-2xl flex items-center">
            DASHBOARD <FaArrowRight className="mx-3" /> MANAGE FILES
          </h1>
          <button
            onClick={handlePopup}
            className="bg-[#2C2C2C] flex items-center text-white text-md py-2 rounded-lg px-5"
          >
            <FaPlus className="mr-3" />
            ADD FILES
          </button>
        </div>
        <div className="h-[82%] w-[83%] border-2 bg-transparent rounded-2xl mt-2 absolute overflow-y-scroll">
          <table className="w-[100%] overflow-y-scroll">
            <thead className="p-4">
              <tr className="text-lg text-gray-600 p-5 border-b-4 border-dotted">
                <th className="py-3 w-[25rem]">File Name</th>
                <th className="w-[10rem]">Size</th>
                <th className="w-[10rem]">Date</th>
                <th className="w-[10rem]">Language</th>
                <th className="w-[10rem]">Tools</th>
              </tr>
            </thead>

            <tbody>
              {pdfs.map((pdf) => (
                <tr>
                  <td>
                    <h1 key={pdf._id} className="p-3 flex items-center text-lg">
                      <FaRegFilePdf className="mx-2" />
                      {pdf.fileName}
                    </h1>
                  </td>
                  <td>
                    <div key={pdf._id} className="flex justify-center">
                      <h1>{pdf.size} KB</h1>
                    </div>
                  </td>
                  <td>
                    <h1
                      key={pdf._id}
                      className="p-3 flex justify-center mx-auto items-center text-lg"
                    >
                      {formatDate(pdf.createdAt)}
                    </h1>
                  </td>
                  <td>
                    <div className="flex justify-center">
                      <h1 key={pdf._id}>
                      {pdf.language}
                      </h1>
                    </div>
                  </td>
                  <td>
                    <div
                      className="flex justify-center items-center"
                      key={pdf._id}
                    >
                      <button
                        onClick={() => {
                          handleDeletePdf(pdf._id, pdf.fileName);
                        }}
                        className="flex items-center"
                      >
                        Delete <FaTrash className="text-red-500 mx-3 my-1" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showPopup && (
        <div className="h-[100vh] w-[100%] absolute top-0 z-50">
          <div
            className="bg-cover bg-center h-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              opacity: 0.5,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          ></div>
          <div className="flex justify-center items-center h-full">
            <div className="bg-white text-black w-[50%] h-[45vh] rounded-xl relative">
              <div className="flex justify-between items-center border-b-4 border-dotted">
                <h1 className="text-2xl font-medium p-4">Upload your Files</h1>
                <IoMdClose
                  className="text-2xl mx-4 text-gray-600"
                  onClick={() => {
                    setShowPopup(false);
                  }}
                />
              </div>
              <div className="border-b-4 border-dotted">
                <div className="flex justify-center">
                  <input
                    type="file"
                    name="files"
                    accept="application/pdf"
                    required
                    multiple
                    onChange={(e) => {
                      setFiles(e.target.files);
                    }}
                    className="w-3/4 text-xl p-2 border-2 border-red-400 m-5 rounded-lg"
                  />
                </div>
                <div className="flex text-lg justify-center items-center">
                  <div className="w-3/4 border-2 border-red-400 p-2 rounded-lg">
                    <label>Select Language:</label>
                    <select id="selectLanguage" className="p-2 rounded-lg w-[73%] ml-2 border-2 border-black" required>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                </div>
                <button
                  className="border-2 flex p-2 rounded-lg mx-auto text-xl mb-5 mt-3"
                  disabled={isLoading}
                  onClick={handleUpload}
                >
                  {isLoading ? "Uploading..." : "Submit Files"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageFiles;