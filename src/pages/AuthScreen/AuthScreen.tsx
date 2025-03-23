import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Separator,
  Link,
} from "@radix-ui/themes";
import { AuthService, UsersService } from "@tasky/api-client";
import { useAuth } from "../../context/AuthContext";
import "./AuthScreen.css";

export const AuthScreen = () => {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login: loginUser } = useAuth();

  const toggleMode = () => {
    setMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
    setEmail("");
    setPassword("");
    setName("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const loginMutation = useMutation({
    mutationFn: () => AuthService.authControllerLogin({ email, password }),
    onSuccess: ({ accessToken, refreshToken, user }) => {
      loginUser(user, accessToken, refreshToken);
      setSuccessMessage(""); // Clear on successful login
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || error.message || "Login failed";
      setErrorMessage(msg);
    },
  });

  const signupMutation = useMutation({
    mutationFn: () =>
      UsersService.usersControllerCreate({ email, password, name }),
    onSuccess: () => {
      setSuccessMessage("Signup successful! You can now log in.");
      setErrorMessage("");
      setMode("sign-in");
      setEmail("");
      setPassword("");
      setName("");
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || error.message || "Signup failed";
      setErrorMessage(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (mode === "sign-in") {
      loginMutation.mutate();
    } else {
      signupMutation.mutate();
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      px="4"
      gap="4"
    >
      <Heading size="8">Taskify</Heading>
      <Text size="4" color="gray">
        {mode === "sign-in" ? "Welcome back 👋" : "Create your account"}
      </Text>

      <Separator size="4" />

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="3" width="300px">
          {mode === "sign-up" && (
            <TextField.Root
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <TextField.Root
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField.Root
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" size="3" disabled={isLoading}>
            {isLoading
              ? mode === "sign-in"
                ? "Logging in..."
                : "Signing up..."
              : mode === "sign-in"
              ? "Log In"
              : "Sign Up"}
          </Button>

          {errorMessage && (
            <Text color="red" size="2">
              {errorMessage}
            </Text>
          )}

          {successMessage && (
            <Text color="green" size="2">
              {successMessage}
            </Text>
          )}
        </Flex>
      </form>

      <Text size="2" color="gray">
        {mode === "sign-in" ? (
          <>
            Don’t have an account?{" "}
            <Link
              onClick={toggleMode}
              color="cyan"
              highContrast
              className="link-hover-underline"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              onClick={toggleMode}
              color="cyan"
              className="link-hover-underline"
              highContrast
            >
              Log In
            </Link>
          </>
        )}
      </Text>
    </Flex>
  );
};
