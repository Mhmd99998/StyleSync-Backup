import axiosInstance from "./axiosInstance";

const API_URl = "/payments";

class PaymentService {
  async createPaymentIntent(amount: number) {
    try {
      const response = await axiosInstance.post(
        `${API_URl}/create-payment-intent`,
        {
          amount,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create payment intent");
    }
  }
}

export default new PaymentService();
