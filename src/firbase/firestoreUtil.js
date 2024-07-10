import { db, storage } from './firebaseConfig';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload a file to a specific project
export const uploadFile = async (projectId, file) => {
  try {
    const storageRef = ref(storage, `projects/${projectId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const fileRef = await addDoc(collection(db, 'projects', projectId, 'files'), {
      name: file.name,
      url: downloadURL,
      uploadedAt: serverTimestamp(),
      status: 2, // Initial status set to 2
    });

    return { id: fileRef.id, name: file.name, url: downloadURL, uploadedAt: new Date(), status: 2 };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error uploading file');
  }
};

// Fetch files for a specific project
export const fetchProjectFiles = async (projectId) => {
  try {
    const filesSnapshot = await getDocs(collection(db, 'projects', projectId, 'files'));
    const files = filesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        url: data.url,
        uploadedAt: data.uploadedAt ? data.uploadedAt.toDate() : null,
        status: data.status,
        assignedTo: data.assignedTo || null // Ensure assignedTo field is included
      };
    });
    return files;
  } catch (error) {
    console.error('Error fetching project files:', error);
    throw new Error('Error fetching project files');
  }
};

// Fetch the name of a specific project
export const fetchProjectName = async (projectId) => {
  try {
    const projectDocRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectDocRef);
    if (projectDoc.exists()) {
      return projectDoc.data().name;
    } else {
      throw new Error('Project does not exist');
    }
  } catch (error) {
    console.error('Error fetching project name:', error);
    throw new Error('Error fetching project name');
  }
};

// Update the status of a specific file
export const updateFileStatus = async (projectId, fileId, status, userId) => {
  try {
    const fileRef = doc(db, 'projects', projectId, 'files', fileId);
    await updateDoc(fileRef, { status, assignedTo: userId });
  } catch (error) {
    console.error('Error updating file status:', error);
    throw new Error('Error updating file status:', error);
  }
};

// Fetch files by status for a specific project
export const fetchFilesByStatus = async (status, projectId) => {
  try {
    console.log(`Fetching files with status ${status} for project ${projectId}`); // Debugging log
    const q = query(collection(db, 'projects', projectId, 'files'), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    const files = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`Files fetched by status ${status} for project ${projectId}:`, files); // Debugging log
    return files;
  } catch (error) {
    console.error(`Error fetching files by status ${status} for project ${projectId}:`, error); // Detailed logging
    throw new Error(`Error fetching files by status ${status} for project ${projectId}`);
  }
};

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Projects fetched:', projects); // Debugging log
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error); // Detailed logging
    throw new Error('Error fetching projects');
  }
};
