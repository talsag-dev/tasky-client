import { Theme } from "@radix-ui/themes";
import { Taskify } from "./Taskify";
import "./App.css";
import "./lib/client";

export const App: React.FC = () => {
  return (
    <Theme>
      <Taskify />
    </Theme>
  );
};
