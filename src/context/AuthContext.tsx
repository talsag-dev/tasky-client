import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserResponseDto, AuthService } from "@tasky/api-client";

type AuthContextType = {
  user: UserResponseDto | null;
  accessToken: string | null;
  login: (
    user: UserResponseDto,
    accessToken: string,
    refreshToken: string
  ) => void;
  logout: () => void;
  isAuthResolved: boolean;
  isAuthLoading: boolean;
  authError: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    const tryRefresh = async () => {
      if (storedUser && storedRefreshToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const { accessToken, refreshToken } =
            await AuthService.authControllerRefresh({
              refreshToken: storedRefreshToken,
            });

          setUser(parsedUser);
          setAccessToken(accessToken);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken); // ✅ save rotated token
        } catch (err) {
          console.error("Refresh token failed", err);
          setAuthError("Session expired. Please log in again.");
          performLogout(); // ✅ safe logout
        }
      } else if (storedUser && storedAccessToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccessToken);
      }

      setIsAuthResolved(true);
      setIsAuthLoading(false);
    };

    tryRefresh();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      AuthService.authControllerRefresh({ refreshToken })
        .then(({ accessToken, refreshToken }) => {
          setAccessToken(accessToken);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        })
        .catch((err) => {
          console.error("Auto-refresh failed", err);
          setAuthError("Session expired");
          performLogout();
        });
    }, 1000 * 60 * 13); // every 13 minutes

    return () => clearInterval(interval);
  }, []);

  const login = (
    user: UserResponseDto,
    accessToken: string,
    refreshToken: string
  ) => {
    setUser(user);
    setAccessToken(accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAuthError(null);
    setIsAuthResolved(true);
    setIsAuthLoading(false);
  };

  const performLogout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const logout = () => {
    performLogout();
    setIsAuthResolved(true);
    setIsAuthLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        isAuthResolved,
        isAuthLoading,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
