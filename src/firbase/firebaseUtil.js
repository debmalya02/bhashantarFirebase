// firestoreUtils.js
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

export const addProject = async (project) => {
  try {
    const projectRef = await addDoc(collection(db, 'projects'), {
      name: project.name,
      createdAt: project.createdAt || serverTimestamp(),
      companyId: project.companyId
    });
    console.log('Project added with ID:', projectRef.id); // Debugging log
    return { id: projectRef.id, ...project };
  } catch (error) {
    console.error('Error adding project:', error); // Detailed logging
    throw new Error('Error adding project:', error);
  }
};

export const fetchProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Projects fetched:', projects); // Debugging log
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error); // Detailed logging
    throw new Error('Error fetching projects:', error);
  }
};
