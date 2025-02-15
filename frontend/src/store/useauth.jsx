import { create } from "zustand";
import axios from "axios";

const useAuth = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  
  signup: async (formData) => {
    try {
      set({ loading: true });
      if (formData.password !== formData.confirmPassword) {
        console.log("Password and confirm password do not match");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name: formData.fullname,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      console.log(response);    

      // Set user state after successful signup
      set({ user: response.data, loading: false });
    } catch (error) {
      console.log("signup failed in the useauth.jsx file", error);
      set({ loading: false });
    }
  },

  login: async (formData) => {
    try {
      set({ loading: true });
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      },
      { withCredentials: true });
      console.log("Login response:", response.data);
      set({ user: response.data, loading: false });
      return true; 
    } catch (error) {
      set({ loading: false });
      console.log("Login failed in the useauth.jsx file", error);
      return false; // Return failure for component to handle error state
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      set({ user: null, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Something went wrong!",
        loading: false,
      });
    }
  },

  // Action to reset error and success state
  clearMessages: () => {
    set({ error: null, success: null });
  },
}));

export default useAuth;
