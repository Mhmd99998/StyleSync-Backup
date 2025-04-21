import axiosInstance from "./axiosInstance";
import { logout } from "../redux/slices/userSlice";
import { store } from "../redux/store";

const API_URl = "/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        `${API_URl}/login`,
        credentials
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error("Invalid login credentials");
    }
  }

  async sendVerificationEmail(email: string): Promise<void> {
    try {
      await axiosInstance.post(`${API_URl}/send-verification`, { email });
    } catch (error) {
      throw new Error("Failed to send verification email");
    }
  }

  logout(): void {
    store.dispatch(logout());
    localStorage.removeItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
