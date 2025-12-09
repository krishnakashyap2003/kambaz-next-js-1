"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Table, Button, Form, Modal, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
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
      // Update selectedUser with the edited data
      setSelectedUser(editingUser);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDelete = async (userId: string) => {
    const userToDelete = users.find((u) => u._id === userId);
    const userName = userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : "this user";
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;
    try {
      await client.deleteUserById(userId);
      await loadUsers();
      if (selectedUser?._id === userId) {
        setShowDetails(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
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
        <Button variant="primary" onClick={() => setShowAddModal(true)} className="d-flex flex-column align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
          <FaPlus className="mb-1" style={{ fontSize: "1.5rem" }} />
          <span>People</span>
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
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr 
              key={user._id}
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer" }}
              className={selectedUser?._id === user._id ? "table-active" : ""}
            >
              <td className="wd-full-name text-nowrap">
                {editingUser?._id === user._id ? (
                  <InputGroup size="sm" onClick={(e) => e.stopPropagation()}>
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
                  <>
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">{user.firstName}</span>{" "}
                    <span className="wd-last-name">{user.lastName}</span>
                  </>
                )}
              </td>
              <td className="wd-login-id">{user.loginId || `00${user._id}`}</td>
              <td className="wd-section">{user.section || "-"}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity || "-"}</td>
              <td className="wd-total-activity">{user.totalActivity || "-"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showDetails && selectedUser && (
        <div className="wd-user-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow-lg" style={{ width: "25%", zIndex: 1050, overflowY: "auto" }}>
          <button
            onClick={() => setShowDetails(false)}
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
            {editingUser?._id === selectedUser._id ? (
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
                  onClick={() => {
                    setEditingUser(null);
                    setSelectedUser(users.find((u) => u._id === selectedUser._id) || selectedUser);
                  }}
                >
                  Cancel
                </Button>
              </InputGroup>
            ) : (
              <>
                <h5 className="text-danger mb-0 fw-bold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h5>
                <FaPencil 
                  className="text-danger" 
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  onClick={() => {
                    setEditingUser({ ...selectedUser });
                  }}
                />
              </>
            )}
          </div>

          {editingUser?._id !== selectedUser._id && (
            <>
              <div className="mb-3">
                <strong>Roles:</strong> {selectedUser.role}
              </div>

              <div className="mb-3">
                <strong>Login ID:</strong> {selectedUser.loginId || `00${selectedUser._id}`}
              </div>

              <div className="mb-3">
                <strong>Section:</strong> {selectedUser.section || "-"}
              </div>

              <div className="mb-4">
                <strong>Total Activity:</strong> {selectedUser.totalActivity || "-"}
              </div>

              {selectedUser.username && (
                <div className="mb-3">
                  <strong>Username:</strong> {selectedUser.username}
                </div>
              )}

              {selectedUser.email && (
                <div className="mb-3">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
              )}
            </>
          )}

          <div className="d-flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setShowDetails(false)} className="flex-grow-1">
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={() => {
                handleDelete(selectedUser._id);
                setShowDetails(false);
              }} 
              className="flex-grow-1"
            >
              Delete
            </Button>
          </div>
        </div>
      )}

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

