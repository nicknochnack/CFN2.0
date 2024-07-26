import ForgotPasswordView from "../views/auth/signin/ForgotPasswordView";
import ResetPasswordView from "../views/auth/signin/ResetPasswordView";
import SignInView from "../views/auth/signin/SignInView";
import SignUpView from "../views/auth/signup/SignUpView";

const Routes = [
  {
    path: "/signup",
    view: SignUpView,
    layout: "auth",
    title: "Sign Up",
  },
  {
    path: "/signin",
    view: SignInView,
    layout: "auth",
    title: "Sign In",
  },
  {
    path: "/forgotpassword",
    view: ForgotPasswordView,
    layout: "auth",
    title: "Forgot Your Password",
  },
  {
    path: "/resetpassword",
    view: ResetPasswordView,
    layout: "auth",
    title: "Reset Your Password",
  },
];

export default Routes;
