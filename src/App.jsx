import "./App.css";
// import { Button } from "@mui/material";
// import Loader from "./common/Loader";
import { Routes, Route, useLocation } from "react-router-dom";
import PageTitle from "./components/pageTitle";
import Calendar from "./pages/Calender";
import { useEffect, useState } from "react";
import Loader from "./common/Loader";
import SignUp from "./pages/Authentication/Signup";
import DefaultLayout from "./layouts/DefaultLayout";
import SignIn from "./pages/Authentication/Signin";
import { Navigate } from "react-router-dom";
import axios from "axios";
import ProtectedRoute from "./pages/Authentication/ProtectedRoute";
import UserTables from "./pages/UsersTable";
function App() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const { pathname } = useLocation();
  const baseUrl = "http://localhost:3000";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setAuth(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/api/v1/checkAuth`, {
          headers: {
            Authorization: `${token}`,
            Accept: "application/json, text/plain, */*",
          },
        });

        if (response.data.success) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (auth) {
      history.pushState(null, null, location.href);
      window.onpopstate = function () {
        history.go(1);
      };
    }
  }, [auth]);

  return loading ? (
    <div>
      <Loader />
    </div>
  ) : (
    <Routes>
      {auth ? (
        <>
          <Route path="/" element={<Navigate to="/Calender" replace />} />
          <Route
            path="/calender"
            element={
              <div>
                <ProtectedRoute isAuth={auth}>
                  <DefaultLayout setAuth={setAuth}>
                    <div>
                      <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <Calendar />
                    </div>
                  </DefaultLayout>
                </ProtectedRoute>
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuth={auth}>
                <DefaultLayout setAuth={setAuth}>
                  <div>
                    <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  </div>
                </DefaultLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/usersTable"
            element={
              <ProtectedRoute isAuth={auth}>
                <DefaultLayout setAuth={setAuth}>
                  <div>
                    <PageTitle title="UserTables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                    <UserTables />
                  </div>
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
        </>
      ) : (
        <>
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignUp />
              </>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="SignIn | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignIn setAuth={setAuth} />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/auth/signin" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
