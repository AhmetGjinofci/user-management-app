import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../usersSlice";

export default function NewUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/.+@.+\..+/.test(email)) e.email = "Email is invalid";
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    dispatch(addUser({ name, email, company: { name: company || "—" } }));
    navigate("/");
  };

  return (
    <div className="card">
      <h2>Add New User</h2>
      <form onSubmit={submit}>
        <div className="formRow">
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="formRow">
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="formRow">
          <label>Company</label>
          <input value={company} onChange={e => setCompany(e.target.value)} />
        </div>
        <button type="submit">Add</button>
        <button type="button" onClick={() => navigate("/")}>Cancel</button>
      </form>
    </div>
  );
}