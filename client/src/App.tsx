import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface ApiResponse {
  success: boolean;
  message: string;
  couponCode?: string;
  claimedCoupons?: string[];
}

function App() {
  const [coupon, setCoupon] = useState<string | null>(null);
  const [claimedCoupons, setClaimedCoupons] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserCoupons();
  }, []);

  const claimCoupon = async () => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/claim`, {}, { withCredentials: true });

      if (response.data.success && response.data.couponCode) {
        setCoupon(response.data.couponCode);
        setClaimedCoupons((prev) => [...prev, response.data.couponCode!]);
        toast.success(`Coupon Claimed: ${response.data.couponCode}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCoupons = async () => {
    try {
      const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/user-coupons`, { withCredentials: true });

      if (response.data.success && response.data.claimedCoupons) {
        setClaimedCoupons(response.data.claimedCoupons);
      }
    } catch (error) {
      console.error("Error fetching user coupons:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-4">Claim Your Coupon</h1>
      <button
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition"
        onClick={claimCoupon}
        disabled={loading}
      >
        {loading ? "Claiming..." : "Claim Coupon"}
      </button>

      {coupon && (
        <p className="mt-4 text-green-600 text-lg font-medium">
          Your Coupon Code: <span className="font-bold">{coupon}</span>
        </p>
      )}

      <h2 className="text-xl font-semibold mt-6">Your Claimed Coupons:</h2>
      <ul className="mt-2 text-gray-700">
        {claimedCoupons.length > 0 ? (
          claimedCoupons.map((c, index) => (
            <li key={index} className="text-md font-medium">
              {c}
            </li>
          ))
        ) : (
          <p>No coupons claimed yet.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
