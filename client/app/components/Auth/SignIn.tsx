import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // useNavigate instead of redirect

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const schema = z.object({

    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
   
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setIsLoading(true);
      await axios.post("/api/auth/login", data);
      toast.success("Account created!");
      navigate("/Workspace");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">
          Create Account
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Sign up to get started with your workspace
        </p>

  

        {/* Email */}
        <div className="mb-5">
          <input
            {...form.register("email")}
            type="email"
            placeholder="Email Address"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {form.formState.errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <input
            {...form.register("password")}
            type="password"
            placeholder="Password"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {form.formState.errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-md"
        >
          {isLoading ? "Registering..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-400 text-center mt-6">
         Dont have an account?{" "}
          <a
            href="/SignUp"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};
