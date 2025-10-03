import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Compare as strings to handle both number and string IDs
  const user = useSelector(state =>
    state.users.list.find(u => String(u.id) === id)
  );

  if (!user) return <div className="card">User not found</div>;

  return (
    <div className="card p-4">
      <button
        className="btn bg-gray-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="font-bold text-xl mb-2">{user.name}</h2>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Phone:</strong> {user.phone || "—"}</div>
      <div><strong>Website:</strong> {user.website || "—"}</div>
      <div>
        <strong>Address:</strong>{" "}
        {user.address
          ? `${user.address.street} ${user.address.suite} ${user.address.city}`
          : "—"}
      </div>
      <div><strong>Company:</strong> {user.company?.name || "—"}</div>
    </div>
  );
}
