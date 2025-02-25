import React, { useContext, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AXIOS from "axios";
import { toast } from "react-toastify";
import Context from "../context/context";
import MyNavbar from "./flowbiteHeader";
import { handleEmailRegEx, handlePasswordRegEx } from "../helpers/handleRegEx";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] =
    useState(false);
  useEffect(() => {
    localStorage.getItem("role") && navigate("/");
  });
  const [signupData, setSignUpData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const signUpHandleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const signUpHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        signupData.password === signupData.confirmPassword &&
        Object.keys(error).length == 0
      ) {
        const resSignUpData = await AXIOS.post(
          "https://zenglow-server.onrender.com/user/generate-otp",
          signupData
        );
        localStorage.setItem("token", resSignUpData.data.data);
        localStorage.setItem("verification", resSignUpData.data.Otp);
        sessionStorage.setItem("targetTime", resSignUpData.data.time);

        if (resSignUpData.data.success) {
          toast.success(resSignUpData.data.message);
          navigate("/otp-verification");
        } else {
          toast.error(resSignUpData.data.message);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const generalContext = useContext(Context);
  const [showSignInPassword, SetShowSignInPassword] = useState(false);
  const [SignIndata, SetSignInData] = useState({
    email: "",
    password: "",
  });

  const SignInHandleChange = (e) => {
    const { name, value } = e.target;

    SetSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SignInHandleSubmit = async (e) => {
    e.preventDefault();
    console.log(SignIndata);

    try {
      const resData = await AXIOS.post(
        "https://zenglow-server.onrender.com/user/login",
        SignIndata
      );
      localStorage?.setItem("token", resData.data.data.token);
      localStorage?.setItem("role", resData.data.data.role);
      if (resData.data.success) {
        toast.success(resData.data.message);
        generalContext.fetchUserDetials();
        generalContext.fetchUserAddToCart();
        navigate("/");
        navigate(0);
      }
      if (resData.data.error) {
        toast.error(resData.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const [error, setError] = useState({});

  return (
    <div>
      <div className="pt-16">
        <div className="flex lg:hidden justify-center items-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-accent-dark via-primary-light to-accent-dark font-[Jost]">
          <div className="relative w-screen h-[calc(100vh-64px)] rounded-lg shadow-[5px_0px_50px_rgba(0,0,0)] bg-cover bg-center overflow-hidden phnsigninBackground">
            <input type="checkbox" id="chk" className="hidden" />

            {/* Login Form */}
            <div className="login absolute  inset-0 transition-transform duration-700 ease-in-out transform translate-y-0">
              <form
                onSubmit={SignInHandleSubmit}
                className="h-[100%] mt-[10%] flex flex-col items-center"
              >
                <label
                  htmlFor="chk"
                  className="head text-white text-[60px] font-bold cursor-pointer transition-all duration-500"
                >
                  Login
                </label>

                <div className=" w-full h-[90%] flex flex-col pb-[20%] items-center justify-center">
                  <div className="relative w-[70%]">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={SignIndata.email}
                      onChange={SignInHandleChange}
                      onBlur={(e) =>
                        !handleEmailRegEx(e.target.value)[0]
                          ? setError({
                              ...error,
                              Email: handleEmailRegEx(e.target.value)[1],
                            })
                          : setError(({ Email, ...rest }) => rest)
                      }
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm mb-2 text-black bg-transparent border-b-[3px] border-white appearance-none focus:outline-none focus:ring-0 focus:border-white peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute text-lg text-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Email
                    </label>
                    {error.Email && (
                      <p className="text-xs text-black ml-4 py-2">
                        *{error.Email}
                      </p>
                    )}
                  </div>

                  <div className="flex w-[70%]">
                    <div className="relative w-full">
                      <input
                        type={showSignInPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={SignIndata.password}
                        onChange={SignInHandleChange}
                        onBlur={(e) =>
                          !handlePasswordRegEx(e.target.value)[0]
                            ? setError({
                                ...error,
                                Password: handlePasswordRegEx(
                                  e.target.value
                                )[1],
                              })
                            : setError(({ Password, ...rest }) => rest)
                        }
                        className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm mb-2 text-black bg-transparent border-b-[3px] border-white appearance-none focus:outline-none focus:ring-0 focus:border-white peer"
                        placeholder=" "
                      />
                      <label
                        className="absolute text-lg text-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      {error.Password && (
                        <p className="text-xs text-black ml-4 py-2">
                          *{error.Password}
                        </p>
                      )}
                      <div
                        className="cursor-pointer absolute right-1 top-2 flex items-center text-xl text-pink-200"
                        onClick={() => SetShowSignInPassword((prev) => !prev)}
                      >
                        <span className="hover:text-black">
                          {showSignInPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={"/forgot-password"}
                    className="lg:block text-center lg:w-fit w-full   ml-auto hover:underline hover:text-white"
                  >
                    Forgot password?
                  </Link>
                  <button className="bg-accent-dark border-2 border-white text-white font-bold px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 hover:bg-tertiary-dark">
                    LOG IN
                  </button>
                </div>
              </form>
            </div>

            {/* SignUp Form */}
            <div className="signup absolute inset-0 h-[calc(100vh-64px)] bg-white rounded-[60%_/_10%] rounded-b-none transform translate-y-[80%] transition-transform duration-[0.8s] ease-in-out">
              <form
                onSubmit={signUpHandleSubmit}
                className="h-[90%] flex flex-col items-center mt-4"
              >
                <label
                  htmlFor="chk"
                  className="text-accent-dark text-3xl font-bold mb-[20%] transform transition-transform duration-500"
                >
                  Sign up
                </label>
                <div className=" w-full h-full flex flex-col items-center justify-center pb-[50%]">
                  <div className="relative w-[70%] mb-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={signupData.name}
                      onChange={signUpHandleChange}
                      required
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="name"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Name
                    </label>
                  </div>
                  <div className="relative w-[70%] mb-2">
                    <input
                      type="email"
                      name="email"
                      id="Email"
                      value={signupData.email}
                      onChange={signUpHandleChange}
                      onBlur={(e) =>
                        !handleEmailRegEx(e.target.value)[0]
                          ? setError({
                              ...error,
                              email: handleEmailRegEx(e.target.value)[1],
                            })
                          : setError(({ email, ...rest }) => rest)
                      }
                      required
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="Email"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Email
                    </label>
                    {error.email && (
                      <p className="text-xs text-red-600 ml-4 py-2">
                        *{error.email}
                      </p>
                    )}
                  </div>

                  <div className="relative w-[70%] mb-2">
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      name="password"
                      id="Password"
                      value={signupData.password}
                      onChange={signUpHandleChange}
                      onBlur={(e) =>
                        !handlePasswordRegEx(e.target.value)[0]
                          ? setError({
                              ...error,
                              password: handlePasswordRegEx(e.target.value)[1],
                            })
                          : setError(({ password, ...rest }) => rest)
                      }
                      required
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="Password"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Password
                    </label>
                    {error.password && (
                      <p className="text-xs text-red-600 ml-4 py-2">
                        *{error.password}
                      </p>
                    )}
                    <div
                      className="cursor-pointer absolute right-1 top-2 flex items-center text-xl"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    >
                      <span className="hover:text-pink-700">
                        {showSignUpPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="relative w-[70%] mb-2">
                    <input
                      type={showSignUpConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={signUpHandleChange}
                      onBlur={(e) =>
                        !handlePasswordRegEx(e.target.value)[0]
                          ? setError({
                              ...error,
                              confirmPassword: handlePasswordRegEx(
                                e.target.value
                              )[1],
                            })
                          : setError(({ confirmPassword, ...rest }) => rest)
                      }
                      required
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="confirmPassword"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-5 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Confirm Password
                    </label>
                    {error.confirmPassword && (
                      <p className="text-xs text-red-600 ml-4 py-2">
                        *{error.confirmPassword}
                      </p>
                    )}
                    {signupData?.confirmPassword &&
                      signupData?.password !== signupData?.confirmPassword && (
                        <p className="text-xs text-red-600 ml-4 py-2">
                          *Password and confirmpassword doesn't match
                        </p>
                      )}
                    <div
                      className="cursor-pointer absolute right-1 top-2 flex items-center text-xl"
                      onClick={() =>
                        setShowSignUpConfirmPassword(!showSignUpConfirmPassword)
                      }
                    >
                      <span className="hover:text-pink-700">
                        {showSignUpConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-accent-dark text-white font-bold px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 hover:bg-tertiary-dark"
                  >
                    SIGN UP
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center h-[613px] bg-pink-50">
          <div className="relative overflow-hidden w-[854px] max-w-full h-[475px] bg-white rounded-[30px] border-2 border-accent-dark shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
            <div
              className={`absolute top-0 h-full w-1/2 transition-transform duration-500 ease-in-out ${
                isActive
                  ? "transform translate-x-full opacity-0 z-[1]"
                  : "opacity-100 z-[2]"
              }`}
            >
              <div className="p-10">
                <h1 className="text-center text-4xl sm:text-5xl font-bold text-accent-dark">
                  Log In
                </h1>
                <form
                  onSubmit={SignInHandleSubmit}
                  className="pt-8 flex justify-center flex-col gap-4"
                >
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={SignIndata.email}
                      onChange={SignInHandleChange}
                      onBlur={(e) =>
                        !handleEmailRegEx(e.target.value)[0]
                          ? setError({
                              ...error,
                              Email: handleEmailRegEx(e.target.value)[1],
                            })
                          : setError(({ Email, ...rest }) => rest)
                      }
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Email
                    </label>
                    {error.Email && (
                      <p className="text-xs text-red-600 ml-4 py-2">
                        *{error.Email}
                      </p>
                    )}
                  </div>

                  <div className="flex">
                    <div className="relative w-full">
                      <input
                        type={showSignInPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={SignIndata.password}
                        onChange={SignInHandleChange}
                        className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                        placeholder=" "
                      />
                      <label
                        className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                        htmlFor="password"
                      >
                        Password
                      </label>

                      <div
                        className="cursor-pointer absolute right-1 top-2 flex items-center text-xl text-textColor-light"
                        onClick={() => SetShowSignInPassword((prev) => !prev)}
                      >
                        <span className="hover:text-accent-light">
                          {showSignInPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={"/forgot-password"}
                    className="block w-fit ml-auto hover:underline hover:text-pink-700"
                  >
                    Forgot password?
                  </Link>
                  <button className="bg-accent-dark text-white font-bold px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 hover:bg-tertiary-dark">
                    LOG IN
                  </button>
                </form>
                <p className="lg:hidden py-6">
                  Don't have an account?{" "}
                  <Link
                    to={"/sign-up"}
                    className="text-pink-700 hover:underline hover:text-pink-900"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>

            <div
              className={`absolute top-0 h-full w-1/2 left-0 transition-transform duration-500 ease-in-out ${
                isActive
                  ? "opacity-100 z-[2] transform translate-x-full"
                  : "transform -translate-x-full opacity-0 z-[1]"
              }`}
            >
              <div className="p-10">
                <h1 className="text-center text-5xl font-bold text-accent-dark">
                  Sign Up
                </h1>
                <form
                  onSubmit={signUpHandleSubmit}
                  className="pt-8 flex flex-col gap-6"
                >
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={signupData.name}
                      onChange={signUpHandleChange}
                      required
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="name"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={signupData.email}
                      onChange={signUpHandleChange}
                      onBlur={(e) =>
                        !handleEmailRegEx(e.target.value)[0]
                          ? setError({
                              ...error,
                              email: handleEmailRegEx(e.target.value)[1],
                            })
                          : setError(({ email, ...rest }) => rest)
                      }
                      required
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Email
                    </label>
                    {error.email && (
                      <p className="text-xs text-red-600 ml-4 py-2">
                        *{error.email}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={signupData.password}
                      onChange={signUpHandleChange}
                      onBlur={(e) =>
                        !handlePasswordRegEx(e.target.value)[0]
                          ? setError({
                              ...error,
                              password: handlePasswordRegEx(e.target.value)[1],
                            })
                          : setError(({ password, ...rest }) => rest)
                      }
                      required
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="password"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Password
                    </label>
                    {error.password && (
                      <p className="text-xs text-red-600 ml-4 py-2">
                        *{error.password}
                      </p>
                    )}
                    <div
                      className="cursor-pointer absolute right-1 top-2 flex items-center text-xl"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    >
                      <span className="hover:text-pink-700">
                        {showSignUpPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type={showSignUpConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={signupData.confirmPassword}
                      onChange={signUpHandleChange}
                      onBlur={(e) =>
                        !handlePasswordRegEx(e.target.value)[0]
                          ? setError({
                              ...error,
                              confirmPassword: handlePasswordRegEx(
                                e.target.value
                              )[1],
                            })
                          : setError(({ confirmPassword, ...rest }) => rest)
                      }
                      required
                      className="block ring-0 border-0 px-2.5 pb-0.5 pt-4 w-full text-sm text-gray-900 bg-transparent border-b-[3px] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-accent-dark peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="confirmPassword"
                      className="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-5 origin-[0] peer-focus:text-accent-dark px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      Confirm Password
                    </label>
                    {error.confirmPassword && (
                      <p className="text-xs text-red-600 ml-4 py-2">
                        *{error.confirmPassword}
                      </p>
                    )}
                    <div
                      className="cursor-pointer absolute right-1 top-2 flex items-center text-xl"
                      onClick={() =>
                        setShowSignUpConfirmPassword(!showSignUpConfirmPassword)
                      }
                    >
                      <span className="hover:text-pink-700">
                        {showSignUpConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-accent-dark text-white font-bold px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 hover:bg-tertiary-dark"
                  >
                    SIGN UP
                  </button>
                </form>
                <p className="lg:hidden py-6">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="text-pink-700 hover:underline hover:text-pink-900"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </div>

            <div
              className={` absolute signInBackground top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-500 ease-in-out rounded-l-3xl z-[5] ${
                isActive ? "transform -translate-x-full rounded-r-3xl" : ""
              }`}
            >
              <div
                className={` h-full text-white relative -left-full w-[200%] transition-transform duration-500 ease-in-out ${
                  isActive
                    ? "transform translate-x-1/2"
                    : "transform translate-x-0"
                }`}
              >
                <div
                  style={{ textShadow: "1px 1px 1px rgba(0, 0, 0)" }}
                  className={`absolute signUpBackground w-1/2 h-full flex items-center justify-center flex-col p-8 text-center top-0 transition-all duration-500 ease-in-out ${
                    isActive ? "transform-none " : " -translate-x-full"
                  }`}
                >
                  <div className="flex flex-col gap-3 items-center">
                    <p className="text-4xl font-extrabold text-white font-serif">
                      Welcome Back!
                    </p>
                    <p className="text-center w-[80%] text-white">
                      To keep connected with us please login with your personal
                      info
                    </p>
                    <button
                      style={{ textShadow: "1px 1px 1px rgba(0, 0, 0)" }}
                      className=" bg-transparent shadow-md shadow-black border-2 border-white text-white text-lg py-1 font-serif font-bold px-11 rounded-md tracking-wider uppercase mt-2 cursor-pointer"
                      id="signUp"
                      onClick={() => setIsActive(false)}
                    >
                      Sign IN
                    </button>
                  </div>
                </div>

                <div
                  style={{ textShadow: "1px 1px 1px rgba(0, 0, 0)" }}
                  className={`absolute  right-0 w-1/2 h-full flex items-center justify-center flex-col p-8 text-center top-0 transition-all duration-500 ease-in-out ${
                    isActive ? "translate-x-full" : "transform-none"
                  }`}
                >
                  <div className="flex flex-col gap-3 mt-20 items-center">
                    <p className="text-4xl font-extrabold text-white font-serif">
                      Hello, Friend!
                    </p>
                    <p className="text-center w-[80%] text-white">
                      Enter your personal details and start your journey with
                      us.
                    </p>
                    <button
                      style={{ textShadow: "1px 1px 1px rgba(0, 0, 0)" }}
                      className=" bg-transparent shadow-md shadow-black border-2 border-white text-white text-lg py-1 font-serif font-bold px-11 rounded-md tracking-wider uppercase mt-2 cursor-pointer"
                      id="login"
                      onClick={() => setIsActive(true)}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
