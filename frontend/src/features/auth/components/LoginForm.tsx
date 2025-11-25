import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./Layout";
import { loginThunk } from "../store/thunks";
import { useAppDispatch } from "../../../app/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "../schemas/login";
import { AxiosError } from "axios";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await dispatch(
        loginThunk(data)
      )
        .unwrap();
      navigate("/");
    } catch (error: AxiosError | any) {
      console.error("Failed to login:", error.message);
    }
  };



  return (
    <AuthLayout title="Sign In" buttonText="Login" formAction={handleSubmit(onSubmit)}>
      <span>
        <label htmlFor="clusterHandle" className="block text-sm font-medium text-gray-700 mb-2">Cluster Handle</label>
        <input
          id="clusterHandle"
          type="text"
          placeholder="Cluster Handle"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
          {...register("handle")}
        />
        {errors.handle && <p className="text-red-600 text-sm mb-4">{errors.handle.message}</p>}
      </span>
      <span>
        <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          id="emailAddress"
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
          {...register("email")}
        />
        {errors.email && <p className="text-red-600 text-sm mb-4">{errors.email.message}</p>}
      </span>
      <span>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
          {...register("password")}
        />
        {errors.password && <p className="text-red-600 text-sm mb-4">{errors.password.message}</p>}
      </span>
    </AuthLayout>
  );
}