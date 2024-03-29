"use client";
import { useState } from "react";

const S3UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <>
      <h1>Upload File to S3 Bucket</h1>
      <form onSubmit={handleSubmit}>
        <input type='file' accept='image/*' onChange={handleFileChange} />
        <button type='submit' disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </>
  );
};

export default S3UploadForm;
