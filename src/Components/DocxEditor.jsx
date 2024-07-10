import React, { useState, useEffect } from 'react';

const DOCXEditor = ({ fileId }) => {
  const [docxUrl, setDocxUrl] = useState('');

  useEffect(() => {
    // Fetch the signed URL for the DOCX file
    const fetchSignedUrl = async () => {
      const response = await fetch(`/generateDownloadSignedUrl?fileId=${fileId}`);
      const data = await response.json();
      setDocxUrl(data.url);
    };

    fetchSignedUrl();
  }, [fileId]);

  return (
    <div>
      <iframe src={docxUrl} width="100%" height="600px" />
    </div>
  );
};

export default DOCXEditor;
