import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Table2 from '../Components/Table2';
import TabPanel from '../Components/TabPanel';
import { fetchProjectFiles, fetchProjects } from '../firbase/firestoreUtil';
import { useAuth } from '../firbase/context/authContext';


const columnsInProgress = [
  { id: 'slNo', label: 'Sl. No.', minWidth: 50 },
  { id: 'name', label: 'File Name', minWidth: 100 },
  { id: 'projectName', label: 'Project Name', minWidth: 150 },
  { id: 'uploadedAt', label: 'Date Created', minWidth: 100 },
  { id: 'edit', label: '', minWidth: 100, align: 'right' },
];

const columnsCompleted = [
  { id: 'slNo', label: 'Sl. No.', minWidth: 50 },
  { id: 'name', label: 'File Name', minWidth: 100 },
  { id: 'projectName', label: 'Project Name', minWidth: 150 },
  { id: 'uploadedAt', label: 'Date Created', minWidth: 100 },
];

const Workspace = () => {
  const [tabValue, setTabValue] = useState(0);
  const [inProgressFiles, setInProgressFiles] = useState([]);
  const [completedFiles, setCompletedFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { currentUser } = useAuth();

  useEffect(() => {
    const getFiles = async () => {
      setIsLoading(true);
      try {
        const projectsData = await fetchProjects();
        const projectsWithFiles = await Promise.all(
          projectsData.map(async (project) => {
            const projectFiles = await fetchProjectFiles(project.id);
            return { ...project, files: projectFiles };
          })
        );

        setProjects(projectsWithFiles);

        const allInProgressFiles = [];
        const allCompletedFiles = [];

        projectsWithFiles.forEach((project) => {
          const projectInProgressFiles = project.files.filter(
            (file) => file.status === 3 && file.assignedTo === currentUser.uid
          );
          const projectCompletedFiles = project.files.filter(
            (file) => file.status === 4 && file.assignedTo === currentUser.uid
          );

          projectInProgressFiles.forEach((file) =>
            allInProgressFiles.push({
              ...file,
              projectId: project.id,
              projectName: project.name,
            })
          );
          projectCompletedFiles.forEach((file) =>
            allCompletedFiles.push({
              ...file,
              projectId: project.id,
              projectName: project.name,
            })
          );
        });

        setInProgressFiles(allInProgressFiles);
        setCompletedFiles(allCompletedFiles);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getFiles();
  }, [currentUser.uid]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example" centered>
          <Tab label="In progress" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Table2
          columns={columnsInProgress}
          rows={inProgressFiles.map((file, index) => ({ ...file, slNo: index + 1 }))}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Table2
          columns={columnsCompleted}
          rows={completedFiles.map((file, index) => ({ ...file, slNo: index + 1 }))}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TabPanel>
    </Box>
  );
};

export default Workspace;