import { UpdateUserDto, User } from "../models/User";
import axiosInstance from "./axiosInstance";

const API_URL = "/users";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

class UserService {
  async getUsers() {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  async register(credentials: RegisterRequest): Promise<User> {
    try {
      const response = await axiosInstance.post<User>(API_URL, credentials);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create new user");
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`${API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Could not find user with ID: ${userId}`);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`${API_URL}/by-email`, {
        params: {
          email,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Could not find user with email: ${email}`);
    }
  }

  async updateUser(userId: string, user: UpdateUserDto): Promise<User> {
    try {
      const response = await axiosInstance.put(`${API_URL}/${userId}`, user);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update user data");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${API_URL}/${userId}`);
    } catch (error) {
      throw new Error(`Failed to delete user: ${userId}`);
    }
  }
}

export default new UserService();
