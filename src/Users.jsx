import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./Users.css";
import { getUsers, updateUser, deleteUserFromStore } from "./localData";

function Users() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    city: "",
  });

  const fetchUsers = () => {
    setUsers(getUsers());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    deleteUserFromStore(id);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setForm({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    updateUser(form.id, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
    });
    setEditUser(null);
    fetchUsers();
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        <h2 className="admin-title">Users</h2>

        {/* EDIT FORM */}
        {editUser && (
          <div className="edit-box">
            <h3>Edit User</h3>

            <input className="input-field" name="name" value={form.name} onChange={handleChange} />
            <input className="input-field" name="email" value={form.email} onChange={handleChange} />
            <input className="input-field" name="phone" value={form.phone} onChange={handleChange} />
            <input className="input-field" name="city" value={form.city} onChange={handleChange} />

            <div className="btn-group">
              <button className="btn-update" onClick={handleUpdate}>Update</button>
              <button className="btn-cancel" onClick={() => setEditUser(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* TABLE */}
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.city || "-"}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(u)}>Edit</button>
                    <button className="btn-delete" onClick={() => deleteUser(u.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;