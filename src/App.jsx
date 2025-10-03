import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUsers } from "./usersSlice";
import { Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";
import NewUser from "./components/NewUser";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/new" element={<NewUser />} />
      </Routes>
    </div>
  );
}