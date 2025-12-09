"use client";

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "react-bootstrap";
import * as client from "@/app/(Kambaz)/Account/client";

interface PeopleDetailsProps {
  uid?: string;
  onClose: () => void;
  onUserDeleted?: () => void;
}

export default function PeopleDetails({ uid, onClose, onUserDeleted }: PeopleDetailsProps) {
  const [user, setUser] = useState<any>({});

  const fetchUser = async () => {
    if (!uid) return;
    try {
      const userData = await client.findUserById(uid);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [uid]);

  if (!uid) {
    return null;
  }

  const deleteUser = async () => {
    if (!uid) return;
    if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }
    try {
      await client.deleteUserById(uid);
      if (onUserDeleted) {
        onUserDeleted();
      }
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const loginId = user.loginId || `00${user._id}`;
  const section = user.section || "-";
  const role = user.role || "-";
  const totalActivity = user.totalActivity || "-";

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow-lg" style={{ width: "25%", zIndex: 1050, overflowY: "auto" }}>
      <button
        onClick={onClose}
        className="btn position-absolute end-0 top-0 wd-close-details border-0 bg-transparent p-2"
        style={{ zIndex: 1051 }}
      >
        <IoCloseSharp className="fs-1" />
      </button>

      <div className="text-center mt-5 mb-3">
        <FaUserCircle className="text-secondary fs-1" style={{ fontSize: "4rem" }} />
      </div>

      <hr />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="text-danger mb-0 fw-bold">{fullName || "Unknown User"}</h5>
        <FaPencil className="text-danger" style={{ cursor: "pointer", fontSize: "1.2rem" }} />
      </div>

      <div className="mb-3">
        <strong>Roles:</strong> {role}
      </div>

      <div className="mb-3">
        <strong>Login ID:</strong> {loginId}
      </div>

      <div className="mb-3">
        <strong>Section:</strong> {section}
      </div>

      <div className="mb-4">
        <strong>Total Activity:</strong> {totalActivity}
      </div>

      <div className="d-flex gap-2 mt-4">
        <Button variant="secondary" onClick={onClose} className="flex-grow-1">
          Cancel
        </Button>
        <Button variant="danger" onClick={deleteUser} className="flex-grow-1">
          Delete
        </Button>
      </div>
    </div>
  );
}

