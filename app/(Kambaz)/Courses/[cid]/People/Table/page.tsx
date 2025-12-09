"use client";
import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as db from "../../../../Database";
import * as coursesClient from "@/app/(Kambaz)/Courses/client";
import PeopleDetails from "../Details";

export default function PeopleTable() {
  const { cid } = useParams();
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [users, setUsers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const courseUsers = await coursesClient.findUsersForCourse(cid as string);
      setUsers(courseUsers || []);
      
      // Also get enrollments if needed
      const allEnrollments = db.enrollments;
      setEnrollments(allEnrollments);
    } catch (error) {
      console.error("Error loading users:", error);
      // Fallback to database
      setUsers(db.user);
      setEnrollments(db.enrollments);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  const enrolled = users.filter((u: any) =>
    enrollments.some((e: any) => e.user === u._id && e.course === cid)
  );

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseDetails = () => {
    setSelectedUserId(undefined);
  };

  const handleUserDeleted = () => {
    fetchUsers();
  };

  return (
    <div id="wd-people-table" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold mb-0 text-dark">People</h4>
        <Link href={`/Courses/${cid}/Dashboard`}>
          <Button variant="outline-secondary" size="sm">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>

      <Table striped hover responsive>
        <thead className="table-secondary">
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolled.map((user: any) => (
            <tr 
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              style={{ cursor: "pointer" }}
              className={selectedUserId === user._id ? "table-active" : ""}
            >
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{`00${user._id}`}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedUserId && (
        <PeopleDetails
          uid={selectedUserId}
          onClose={handleCloseDetails}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}
