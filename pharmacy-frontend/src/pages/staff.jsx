// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";
// import axios from "axios";
// import StaffTable from "../components/staff/StaffTable";
// import StaffViewModal from "../components/staff/StaffViewModal";
// import StaffAddEditModal from "../components/staff/StaffAddEditModal";

// const Staff = () => {
//   const [staffMembers, setStaffMembers] = useState([]);
//   const [filteredStaff, setFilteredStaff] = useState([]);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchStaffMembers();
//   }, []);

//   useEffect(() => {
//     setFilteredStaff(staffMembers);
//   }, [staffMembers]);

//   const fetchStaffMembers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/api/staff", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStaffMembers(response.data.staff || []);
//     } catch (err) {
//       console.error("Error fetching staff members:", err);
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//       setError("Failed to load staff members. Please try again later.");
//       // Fallback mock data
//       setStaffMembers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteMember = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`/api/staff/${selectedMember.pharmacy_staff_id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStaffMembers(
//         staffMembers.filter(
//           (m) => m.pharmacy_staff_id !== selectedMember.pharmacy_staff_id
//         )
//       );
//       message.success("Staff member deleted successfully");
//       setIsDetailModalVisible(false);
//     } catch (err) {
//       console.error("Error deleting staff member:", err);
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//       message.error("Failed to delete staff member");
//     }
//   };

//   if (loading && staffMembers.length === 0) {
//     return <div>Loading...</div>;
//   }

//   if (error && staffMembers.length === 0) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="p-6 bg-white shadow rounded-lg">
//       <StaffTable
//         staffMembers={filteredStaff}
//         loading={loading}
//         onRowClick={(record) => {
//           setSelectedMember(record);
//           setIsDetailModalVisible(true);
//         }}
//         onAddMember={() => setIsAddModalVisible(true)}
//       />

//       <StaffViewModal
//         visible={isDetailModalVisible}
//         staffMember={selectedMember}
//         onClose={() => setIsDetailModalVisible(false)}
//         onEdit={() => {
//           setIsEditMode(true);
//           setIsDetailModalVisible(false);
//           setIsAddModalVisible(true);
//         }}
//         onDelete={handleDeleteMember}
//       />

//       <StaffAddEditModal
//         visible={isAddModalVisible}
//         isEditMode={isEditMode}
//         staffMember={selectedMember}
//         onCancel={() => {
//           setIsAddModalVisible(false);
//           setSelectedMember(null);
//         }}
//         onSubmitSuccess={() => {
//           setIsAddModalVisible(false);
//           fetchStaffMembers();
//         }}
//         setImageFile={setImageFile}
//         setImageUrl={setImageUrl}
//         imageUrl={imageUrl}
//       />
//     </div>
//   );
// };

// export default Staff;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import StaffTable from "../components/staff/StaffTable";
import StaffViewModal from "../components/staff/StaffViewModal";
import StaffAddEditModal from "../components/staff/StaffAddEditModal";

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  useEffect(() => {
    setFilteredStaff(staffMembers);
  }, [staffMembers]);

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffMembers(response.data.staff || []);
    } catch (err) {
      console.error("Error fetching staff members:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
      setError("Failed to load staff members. Please try again later.");
      // Fallback mock data
      setStaffMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/staff/${selectedMember.pharmacy_staff_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffMembers(
        staffMembers.filter(
          (m) => m.pharmacy_staff_id !== selectedMember.pharmacy_staff_id
        )
      );
      message.success("Staff member deleted successfully");
      setIsDetailModalVisible(false);
    } catch (err) {
      console.error("Error deleting staff member:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
      message.error("Failed to delete staff member");
    }
  };

  // Reset image state when opening add/edit modal
  const handleOpenAddModal = () => {
    setImageFile(null);
    setImageUrl(null);
    setIsEditMode(false);
    setIsAddModalVisible(true);
  };

  // Set image url when opening edit modal
  const handleOpenEditModal = () => {
    setImageFile(null);
    setImageUrl(selectedMember.image || null);
    setIsEditMode(true);
    setIsDetailModalVisible(false);
    setIsAddModalVisible(true);
  };

  if (loading && staffMembers.length === 0) {
    return <div>Loading...</div>;
  }

  if (error && staffMembers.length === 0) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <StaffTable
        staffMembers={filteredStaff}
        loading={loading}
        onRowClick={(record) => {
          setSelectedMember(record);
          setIsDetailModalVisible(true);
        }}
        onAddMember={handleOpenAddModal}
      />

      <StaffViewModal
        visible={isDetailModalVisible}
        staffMember={selectedMember}
        onClose={() => setIsDetailModalVisible(false)}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteMember}
      />

      <StaffAddEditModal
        visible={isAddModalVisible}
        isEditMode={isEditMode}
        staffMember={selectedMember}
        onCancel={() => {
          setIsAddModalVisible(false);
          setSelectedMember(null);
          setImageFile(null);
          setImageUrl(null);
        }}
        onSubmitSuccess={() => {
          setIsAddModalVisible(false);
          fetchStaffMembers();
          setImageFile(null);
          setImageUrl(null);
        }}
        setImageFile={setImageFile}
        setImageUrl={setImageUrl}
        imageUrl={imageUrl}
        imageFile={imageFile} // Pass the imageFile state to the modal
      />
    </div>
  );
};

export default Staff;
