import React from "react";
import Axios from "axios";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { AuthProvider, PrivateRoute } from "./AuthHandler";
import { View } from "./components/view/View";
import ErrorView from "./views/error/ErrorView";

const Settings = require("./config/settings.json");
const StripePromise = loadStripe(
  Settings[process.env.NODE_ENV].stripe.publishableAPIKey
);

const routes = [
  ...require("./routes/AppRoutes").default,
  ...require("./routes/AuthRoutes").default,
];

console.log("Logging out Routes from App.js");
console.log(routes);

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loc = window.location;
  Axios.defaults.baseURL = `${loc.protocol}//${loc.hostname}${
    loc.hostname === "localhost" ? ":8080" : ""
  }`;

  if (user?.token) {
    Axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
  }

  return (
    <Elements stripe={StripePromise}>
      <ChakraProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {routes.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      route.permission ? (
                        <PrivateRoute permission={route.permission}>
                          <View
                            display={route.view}
                            layout={route.layout}
                            title={route.title}
                          />
                        </PrivateRoute>
                      ) : (
                        <View
                          display={route.view}
                          layout={route.layout}
                          title={route.title}
                        />
                      )
                    }
                  />
                );
              })}

              {/* Everything else i.e. not found */}
              <Route
                path="*"
                element={
                  <View
                    display={ErrorView}
                    layout="marketing"
                    title="404 Not Found "
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ChakraProvider>
    </Elements>
  );
}

export default App;
