"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Table, Button, Form, Modal, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import * as client from "../client";
import { RootState } from "../../store";

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  section?: string;
  loginId?: string;
  lastActivity?: string;
  totalActivity?: string;
}

interface NewUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Users() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [newUser, setNewUser] = useState<NewUser>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "STUDENT",
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") {
      router.push("/Account/Signin");
      return;
    }
    loadUsers();
  }, [currentUser, router]);

  useEffect(() => {
    let filtered = users;
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    if (nameFilter) {
      const searchTerm = nameFilter.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(searchTerm) ||
          u.lastName?.toLowerCase().includes(searchTerm) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm)
      );
    }
    setFilteredUsers(filtered);
  }, [users, roleFilter, nameFilter]);

  const loadUsers = async () => {
    try {
      const allUsers = await client.findAllUsers();
      setUsers(allUsers || []);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await client.updateUser(editingUser);
      await loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await client.deleteUserById(userId);
      setUsers(users.filter((u) => u._id !== userId));
      if (selectedUser?._id === userId) {
        setShowDetails(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleAddUser = async () => {
    try {
      await client.createUser(newUser);
      await loadUsers();
      setShowAddModal(false);
      setNewUser({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "STUDENT",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Users</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" />
          People
        </Button>
      </div>

      <div className="mb-3 d-flex gap-2">
        <Form.Select
          style={{ width: "200px" }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Admin</option>
        </Form.Select>
        <Form.Control
          style={{ width: "300px" }}
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      <Table striped hover responsive>
        <thead className="table-secondary">
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>
                {editingUser?._id === user._id ? (
                  <InputGroup size="sm">
                    <Form.Control
                      value={editingUser.firstName || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, firstName: e.target.value })
                      }
                      placeholder="First Name"
                    />
                    <Form.Control
                      value={editingUser.lastName || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, lastName: e.target.value })
                      }
                      placeholder="Last Name"
                    />
                    <Button size="sm" variant="success" onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </Button>
                  </InputGroup>
                ) : (
                  <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleUserClick(user)}
                  >
                    <FaUserCircle className="me-2" />
                    {user.firstName} {user.lastName}
                  </span>
                )}
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {editingUser?._id !== user._id && (
                  <>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrash />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>
                <strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              {selectedUser.section && (
                <p>
                  <strong>Section:</strong> {selectedUser.section}
                </p>
              )}
              {selectedUser.loginId && (
                <p>
                  <strong>Login ID:</strong> {selectedUser.loginId}
                </p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={newUser.username || ""}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={newUser.password || ""}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={newUser.firstName || ""}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={newUser.lastName || ""}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={newUser.email || ""}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={newUser.role || "STUDENT"}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

