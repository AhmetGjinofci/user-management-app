import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser, deleteUser } from "../usersSlice";

export default function UserList() {
  const { list: users, loading, error } = useSelector((state) => state.users);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("cards");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = users || [];
    if (q) {
      out = out.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }
    return [...out].sort((a, b) => {
      let A, B;
      if (sortBy === "company") {
        A = (a.company?.name || "").toLowerCase();
        B = (b.company?.name || "").toLowerCase();
      } else {
        A = ((a[sortBy] || "") + "").toLowerCase();
        B = ((b[sortBy] || "") + "").toLowerCase();
      }
      return A < B ? -1 : A > B ? 1 : 0;
    });
  }, [users, query, sortBy]);

  const handleStartEdit = (user) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditCompany(user.company?.name || "");
  };

  const handleSaveEdit = (id) => {
    dispatch(
      updateUser({
        id,
        name: editName,
        email: editEmail,
        company: { name: editCompany },
      })
    );
    setEditingId(null);
  };

  const handleAddUser = () => {
    navigate("/new");
  };

  return (
    <div className="card p-4">
      {/* Top controls all in one line */}
      <div className="flex items-center w-full gap-2 mb-4">
        <input
          className="input p-2 border rounded"
          placeholder="Search name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input p-2 border rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort: Name</option>
          <option value="email">Sort: Email</option>
          <option value="company">Sort: Company</option>
        </select>
        <button
          className="btn bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddUser}
        >
          Add User
        </button>
        <button
          className="btn bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setViewMode("cards")}
        >
          Cards
        </button>
        <button
          className="btn bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setViewMode("table")}
        >
          Table
        </button>
      </div>

      {/* States */}
      {loading && <div>Loading users...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && filtered.length === 0 && <div>No users found.</div>}

      {/* Cards View */}
      {viewMode === "cards" ? (
        <div className="usersGrid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u) => (
            <div key={u.id} className="userCard p-4 border rounded shadow">
              {editingId === u.id ? (
                <>
                  <input
                    className="input mb-2"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    className="input mb-2"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                  <input
                    className="input mb-2"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="btn bg-green-500 text-white p-2 rounded"
                      onClick={() => handleSaveEdit(u.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn bg-red-500 text-white p-2 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold">{u.name}</h3>
                  <div>{u.email}</div>
                  <div className="text-sm text-gray-500">{u.company?.name}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="smallBtn bg-yellow-500 text-white p-1 rounded"
                      onClick={() => handleStartEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="smallBtn bg-red-500 text-white p-1 rounded"
                      onClick={() => dispatch(deleteUser(u.id))}
                    >
                      Delete
                    </button>
                    <button
                      className="smallBtn bg-blue-500 text-white p-1 rounded"
                      onClick={() => navigate(`/users/${u.id}`)}
                    >
                      View
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <table className="table w-full border-collapse">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b">
                {editingId === u.id ? (
                  <>
                    <td>
                      <input
                        className="input p-1 border rounded"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input p-1 border rounded"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input p-1 border rounded"
                        value={editCompany}
                        onChange={(e) => setEditCompany(e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn bg-green-500 text-white p-1 rounded mr-1"
                        onClick={() => handleSaveEdit(u.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn bg-red-500 text-white p-1 rounded"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.company?.name}</td>
                    <td className="flex gap-0">
                      <button
                        className="smallBtn bg-yellow-500 text-white p-1 rounded"
                        onClick={() => handleStartEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="smallBtn bg-red-500 text-white p-1 rounded"
                        onClick={() => dispatch(deleteUser(u.id))}
                      >
                        Delete
                      </button>
                      <button
                        className="smallBtn bg-blue-500 text-white p-1 rounded"
                        onClick={() => navigate(`/users/${u.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
