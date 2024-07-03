// import React, { useState } from 'react';
// import { assignRole } from '../functions/assignRoles'; // Ensure this imports your assignRole function

// const AssignRoleComponent = () => {
//   const [targetUid, setTargetUid] = useState('');
//   const [role, setRole] = useState('');

//   const handleAssignRole = async () => {
//     try {
//       await assignRole(targetUid, role);
//       alert('Role assigned successfully');
//     } catch (error) {
//       alert('Error assigning role: ' + error.message);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="User ID"
//         value={targetUid}
//         onChange={(e) => setTargetUid(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Role"
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//       />
//       <button onClick={handleAssignRole}>Assign Role</button>
//     </div>
//   );
// };

// export default AssignRoleComponent;
