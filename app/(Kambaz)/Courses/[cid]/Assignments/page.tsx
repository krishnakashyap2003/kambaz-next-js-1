"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "@/app/(Kambaz)/Courses/client";
import { BsGripVertical, BsSearch } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import "./assignments.css";

// ------------------------
//  Assignment Type
// ------------------------
interface Assignment {
  _id?: string;
  title: string;
  availableFrom?: string;
  availableUntil?: string;
  dueDate?: string;
  points?: number;
  course?: string;
  description?: string;
  group?: string;
}

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isFacultyOrAdmin = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  // -----------------------------
  // LOAD ASSIGNMENTS FOR COURSE
  // -----------------------------
  const load = async () => {
    const list = await client.findAssignmentsForCourse(cid as string);
    setAssignments(list || []);
  };

  useEffect(() => {
    load();
  }, [cid]);

  // -----------------------------
  // DELETE ASSIGNMENT
  // -----------------------------
  const remove = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      await client.deleteAssignment(id);
      setAssignments((prev: Assignment[]) =>
        prev.filter((x) => x._id !== id)
      );
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      // Handle different date formats
      let date: Date;
      if (dateString.includes("T")) {
        date = new Date(dateString);
      } else if (dateString.includes(" ")) {
        // Handle "May 6" format
        const parts = dateString.split(" ");
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = monthNames.findIndex(m => m === parts[0]);
        if (monthIndex !== -1) {
          const currentYear = new Date().getFullYear();
          date = new Date(currentYear, monthIndex, parseInt(parts[1]));
        } else {
          date = new Date(dateString);
        }
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return dateString;
      }

      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      // If time is 00:00, show "12:00am", if 23:59, show "11:59pm"
      if (hours === 0 && minutes === 0) {
        return `${month} ${day} • 12:00am`;
      } else if (hours === 23 && minutes === 59) {
        return `${month} ${day} • 11:59pm`;
      } else {
        const ampm = hours >= 12 ? "pm" : "am";
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, "0");
        return `${month} ${day} • ${displayHours}:${displayMinutes}${ampm}`;
      }
    } catch {
      return dateString;
    }
  };

  // Filter assignments based on search
  const filteredAssignments = assignments.filter((a) =>
    a.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total percentage (assuming 40% for now, can be dynamic)
  const totalPercentage = 40;

  // ----------------------------------
  // RENDER
  // ----------------------------------
  return (
    <div className="wd-assignments-page">
      {/* Top Control Bar */}
      <div className="wd-assignments-controls d-flex justify-content-between align-items-center mb-3">
        {/* Search Bar */}
        <div className="wd-search-container position-relative" style={{ flex: "1", maxWidth: "400px" }}>
          <BsSearch className="wd-search-icon position-absolute" />
          <input
            type="text"
            className="form-control wd-search-input ps-5"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        {isFacultyOrAdmin && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-secondary wd-action-btn"
              style={{ height: "38px" }}
            >
              <FaPlus className="me-2" style={{ fontSize: "1rem", color: "#000" }} />
              Group
            </button>
            <button
              className="btn btn-danger wd-action-btn"
              style={{ height: "38px" }}
              onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}
            >
              <FaPlus className="me-2" style={{ fontSize: "1rem" }} />
              Assignment
            </button>
          </div>
        )}
      </div>

      <hr className="mb-3" />

      {/* Assignments Section Header */}
      <div className="wd-assignments-header d-flex justify-content-between align-items-center mb-3">
        <h3 className="wd-assignments-title mb-0">ASSIGNMENTS</h3>
        <div className="d-flex align-items-center gap-2">
          <div className="wd-total-percentage d-flex align-items-center gap-2 px-3 py-1">
            <span>{totalPercentage}% of Total</span>
            {isFacultyOrAdmin && (
              <>
                <FaPlus className="wd-icon-small" style={{ cursor: "pointer" }} />
                <IoEllipsisVertical className="wd-icon-small" style={{ cursor: "pointer" }} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="wd-assignments-list">
        {filteredAssignments.length === 0 ? (
          <div className="text-center text-muted py-5">
            {searchQuery ? "No assignments found" : "No assignments yet"}
          </div>
        ) : (
          filteredAssignments.map((a: Assignment) => (
            <div key={a._id} className="wd-assignment-item">
              {/* Green Left Border with Draggable Handle */}
              <div className="wd-assignment-left-border">
                <div className="wd-drag-handle">
                  <BsGripVertical style={{ fontSize: "1.2rem" }} />
                </div>
              </div>

              {/* Assignment Content */}
              <div className="wd-assignment-content flex-grow-1">
                {/* Assignment Title */}
                <div className="wd-assignment-title">
                  <a
                    href={`/Courses/${cid}/Assignments/${a._id}`}
                    className="text-primary text-decoration-none fw-bold"
                  >
                    {a.title}
                  </a>
                </div>

                {/* Assignment Details */}
                <div className="wd-assignment-details">
                  <span className="wd-multiple-modules text-success">Multiple Modules</span>
                  {(a.availableFrom || (a as any).available) && (a.dueDate || (a as any).due) && (
                    <span className="wd-assignment-meta text-muted ms-2">
                      Not available until {formatDate(a.availableFrom || (a as any).available)} | Due {formatDate(a.dueDate || (a as any).due)} | {a.points || 100} pts
                    </span>
                  )}
                </div>
              </div>

              {/* Action Icons */}
              {isFacultyOrAdmin && (
                <div className="wd-assignment-actions d-flex align-items-center gap-2">
                  <GreenCheckmark />
                  <FaTrash
                    className="text-danger"
                    style={{ cursor: "pointer", fontSize: "1.1rem" }}
                    onClick={() => remove(a._id!)}
                    title="Delete Assignment"
                  />
                  <IoEllipsisVertical
                    className="text-muted"
                    style={{ cursor: "pointer", fontSize: "1.1rem" }}
                    title="More Options"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
