import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../Components/Table';
import { uploadFile, fetchProjectFiles, fetchProjectName, updateFileStatus } from '../firbase/firestoreUtil';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../firbase/context/authContext';

const Docs = () => {
  const { projectId } = useParams();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [projectName, setProjectName] = useState('');
  const { currentUser } = useAuth();

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    try {
      setIsLoading(true);
      const uploadPromises = uploadedFiles.map(file => uploadFile(projectId, file));
      const uploadedFilesData = await Promise.all(uploadPromises);
      setFiles([...files, ...uploadedFilesData]);
      setIsLoading(false);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getProjectData = async () => {
      setIsLoading(true);
      try {
        const projectFiles = await fetchProjectFiles(projectId);
        const projectName = await fetchProjectName(projectId);
        // Filter files to only show those with status 2
        const filteredFiles = projectFiles.filter(file => file.status === 2);
        setFiles(filteredFiles);
        setProjectName(projectName);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    getProjectData();
  }, [projectId]);

  const columns = [
    { id: 'slNo', label: 'Sl. No', minWidth: 50 },
    { id: 'name', label: 'File Name', minWidth: 170 },
    { id: 'uploadedAt', label: 'Uploaded At', minWidth: 170 },
    { id: 'edit', label: 'Actions', minWidth: 100 },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditClick = async (id) => {
    console.log('Edit/Assign file with ID:', id);
    try {
      await updateFileStatus(projectId, id, 3, currentUser.uid); // Update status to 3 and assign to current user
      setFiles(files.filter(file => file.id !== id)); // Remove the file from the current display
    } catch (err) {
      console.error('Error updating file status:', err);
      setError(err);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      {isLoading && <CircularProgress />}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && files.length === 0 && <p>No files found.</p>}
      {!isLoading && !error && files.length > 0 && (
        <Table
          columns={columns}
          rows={files.map((file, index) => ({ ...file, slNo: index + 1 }))}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleEditClick={handleEditClick}
          projectName={projectName}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => document.getElementById('file-upload').click()}
        style={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        Upload Files
      </Button>
    </div>
  );
};

export default Docs;
