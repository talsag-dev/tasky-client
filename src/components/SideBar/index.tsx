import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
} from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

export const SideBar: React.FC<{
  sidebarOpen: boolean;
  handleSetSideBar: () => void;
}> = ({ sidebarOpen, handleSetSideBar }) => {
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-toggle">
        <IconButton
          variant="ghost"
          onClick={handleSetSideBar}
          aria-label="Toggle sidebar"
          style={{
            background: "transparent",
            boxShadow: "none",
            cursor: "pointer",
          }}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <ClipboardIcon />
          {sidebarOpen && <span className="sidebar-text">Tasks</span>}
        </NavLink>
      </nav>
    </aside>
  );
};
