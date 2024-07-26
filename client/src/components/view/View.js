/***
 *
 *   VIEW
 *   The view houses global components that are common to all views
 *   (notification, modal), handles errors and renders the layout
 *
 **********/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Modal, Notification, Loader, useNavigate } from "../lib";
import AppLayout from "../layout/AppLayout";
import DashboardLayout from "../layout/DashboardLayout";
import AuthLayout from "../layout/AuthLayout";
import MarketingLayout from "../layout/MarketingLayout";
import Lesson from "../../views/course/LessonView";

// import './scss/normalize.scss';
// import './scss/view.scss';
// import './scss/typography.scss';

export const ViewContext = React.createContext();

export function View(props) {
  const navigate = useNavigate();

  // state
  const [notification, setNotification] = useState({
    visible: "hide",
    autoclose: true,
  });
  const [modal, setModal] = useState({});
  const [loading, setLoading] = useState(false);

  // layouts
  const layouts = {
    app: AppLayout,
    dashboard: DashboardLayout,
    auth: AuthLayout,
    marketing: MarketingLayout,
  };

  // set title & layout
  document.title = props.title;
  let Layout = props.layout ? layouts[props.layout] : AppLayout;

  if (!props.display) return false;

  function showNotification(text, type, autoclose, format, icon) {
    setNotification({
      text: text,
      type: type,
      show: true,
      format: format,
      icon: icon,
      autoclose: autoclose,
    });

    if (autoclose) setTimeout(hideNotification, 2000);
  }

  function hideNotification() {
    setNotification({
      text: "",
      type: "",
      show: false,
      format: null,
      icon: null,
      autoclose: true,
    });
  }

  function showModal(content, callback) {
    let data = { ...modal };

    if (content) {
      for (let key in content) data[key] = content[key];

      data.show = true;
      data.callback = callback;
    }

    setModal(data);
  }

  function hideModal(cancel, res) {
    // callback?
    if (!cancel && modal.callback) modal.callback(modal.form, res);

    // reset the modal
    setModal({
      title: null,
      text: null,
      buttonText: null,
      url: null,
      method: null,
      show: false,
    });
  }

  function handleError(err) {
    let message = "There was a glitch in the matrix – please try again";

    if (err) {
      message = err.toString();

      if (err.response) {
        if (err.response.data?.message) message = err.response.data.message;

        if (err.response.status) {
          switch (err.response.status) {
            case 401:
              navigate("/signin");
              break;

            case 404:
              navigate("/notfound");
              break;

            case 429:
              showNotification(err.response.data, "error", false);
              break;

            case 402: // payment required
              navigate("/account/upgrade?plan=" + err.response.data.plan);
              break;

            default:
              console.error(err);
              showNotification(message, "error", false);
              break;
          }
        }
      }
    }
  }

  const context = {
    notification: {
      show: showNotification,
      hide: hideNotification,
      data: notification,
    },
    modal: {
      show: showModal,
      hide: hideModal,
      data: modal,
    },

    setLoading: (state) => setLoading(state),
    handleError: handleError,
  };
  console.log("Logging data props from View.js");
  console.log(props);
  return (
    <ViewContext.Provider value={context}>
      {/* {notification.show && <Notification {...notification} />} */}

      {/* {loading && <Loader fullScreen />} */}

      {/* {modal.show && <Modal {...modal} />} */}

      <Layout title={props.title}>{props.display}</Layout>
    </ViewContext.Provider>
  );
}
