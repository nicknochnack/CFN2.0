import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = React.createContext();
const useAPI = require("./components/helpers/hooks").useAPI;
const permissions = require("./config/permissions");

export function AuthProvider(props) {
  const cache = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : false;
  const [user, setUser] = useState(cache);
  const auth = useAPI(user ? "/api/auth" : null);

  useEffect(() => {
    if (!auth.loading && auth.data) {
      auth.data.authenticated ? update(auth.data) : signout();
    }
  }, [auth]);

  function signin(res) {
    if (res.data) {
      localStorage.setItem("user", JSON.stringify(res.data));
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + res.data.token;

      if (!res.data.plan) return (window.location = "/signup/plan");

      return (window.location = "/");
    }
  }

  async function switchAccount(id) {
    const res = await axios({
      method: "post",
      url: "/api/auth/switch",
      data: { account: id },
    });

    if (res.data) signin(res);
  }

  async function signout() {
    axios({ method: "delete", url: "/api/auth" });
    localStorage.clear();
    return (window.location = "/signin");
  }

  function update(data) {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));

      for (let key in data) {
        if (typeof data[key] === "object") {
          for (let innerKey in data[key]) {
            user[key][innerKey] = data[key][innerKey];
          }
        } else {
          user[key] = data[key];
        }
      }

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: user,
        signin: signin,
        signout: signout,
        update: update,
        switchAccount: switchAccount,
        permission: permissions[user?.permission],
      }}
      {...props}
    />
  );
}

export function PrivateRoute(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const path = window.location.pathname;
  const permittedRoutes = [
    "/account/billing",
    "/signup/plan",
    "/account/upgrade",
    "/acccount",
    "/account/profile",
  ];

  if (user?.token) {
    if (permissions[user.permission][props.permission]) {
      // check the user has a plan
      if (!user.plan && path !== "/account/profile" && path !== "/signup/plan")
        return <Navigate to="/signup/plan" />;

      // user has a plan, but no subscription
      if (
        user.subscription !== "active" &&
        user.subscription !== "trialing" &&
        !permittedRoutes.includes(path)
      )
        return <Navigate to="/account/billing" />;

      // user is good
      return props.children;
    }
  }

  return <Navigate to="/signin" />;
}
