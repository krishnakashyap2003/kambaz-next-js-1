"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table, Form, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import * as coursesClient from "@/app/(Kambaz)/Courses/client";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  section?: string;
  loginId?: string;
  lastActivity?: string;
  totalActivity?: string;
}

export default function People() {
  const { cid } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadUsers();
  }, [cid]);

  useEffect(() => {
    let filtered = users;
    
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((u) => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const username = (u.username || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const section = (u.section || "").toLowerCase();
        const role = (u.role || "").toLowerCase();
        
        return (
          fullName.includes(search) ||
          username.includes(search) ||
          email.includes(search) ||
          section.includes(search) ||
          role.includes(search) ||
          u._id.toLowerCase().includes(search)
        );
      });
    }
    
    setFilteredUsers(filtered);
  }, [users, roleFilter, searchTerm]);

  const loadUsers = async () => {
    try {
      const courseUsers = await coursesClient.findUsersForCourse(cid as string);
      setUsers(courseUsers || []);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-3">People</h3>
      
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <InputGroup style={{ maxWidth: "400px" }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search by name, username, email, section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <Form.Select
          style={{ width: "200px" }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="FACULTY">Faculty</option>
          <option value="TA">TA</option>
        </Form.Select>
      </div>

      <Table striped hover responsive className="table-bordered">
        <thead className="table-secondary">
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id}>
              <td>
                <FaUserCircle className="me-2 text-secondary" />
                {u.firstName} {u.lastName}
              </td>
              <td>{u.username || u._id}</td>
              <td>{u.email}</td>
              <td>{u.section || "-"}</td>
              <td>{u.role}</td>
              <td>{u.lastActivity || "-"}</td>
              <td>{u.totalActivity || "-"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {filteredUsers.length === 0 && (
        <div className="text-center text-muted mt-4">
          No users found for this course.
        </div>
      )}
    </div>
  );
}
