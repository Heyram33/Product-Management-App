import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";

import { loginSchema, type LoginFormData } from "./loginSchema";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);

      
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token not saved");
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Login successful",
      });

      navigate("/products", { replace: true });
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Login Failed",
        detail: "Invalid username or password",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Toast ref={toast} />
      <h1 className="text-center text-4xl font-semibold mb-10">
        Product Management App
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-[400px]"
      >
        <div className="w-full">
          <InputText
            {...register("username")}
            placeholder="Username"
            className="w-full"
          />
          {errors.username && (
            <small className="text-red-500">{errors.username.message}</small>
          )}
        </div>

        <div className="w-full">
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Password
                {...field}
                placeholder="Password"
                feedback={false}
                toggleMask
                className="w-full"
                inputClassName="w-full"
              />
            )}
          />
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
        </div>

        <Button
          label="Login"
          type="submit"
          loading={isSubmitting}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default Login;
