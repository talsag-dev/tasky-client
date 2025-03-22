import { useState } from "react";
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
import "./AuthScreen.css";

export const AuthScreen = () => {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const toggleMode = () => {
    setMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "sign-in") {
      const { accessToken, refreshToken, user } =
        await AuthService.authControllerLogin({
          email,
          password,
        });

      console.log(accessToken, refreshToken, user);
    } else {
      const { id } = await UsersService.usersControllerCreate({
        email,
        password,
        name,
      });

      console.log(id);
    }
  };

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

          <Button type="submit" size="3">
            {mode === "sign-in" ? "Log In" : "Sign Up"}
          </Button>
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
