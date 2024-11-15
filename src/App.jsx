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

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return loading ? (
    <div>
      <Loader />
    </div>
  ) : (
    <>
      <DefaultLayout>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Calendar />
              </>
            }
          />

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
                <SignIn />
              </>
            }
          />
        </Routes>
      </DefaultLayout>
    </>
  );
}

export default App;
