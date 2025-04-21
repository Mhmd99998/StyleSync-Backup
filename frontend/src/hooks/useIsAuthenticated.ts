import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const useIsAuthenticated = () => {
  const { isAuthenticated, token, tokenExpiration } = useSelector(
    (state: RootState) => state.user
  );

  // Check if the token is expired
  if (!isAuthenticated || !token || !tokenExpiration) {
    return false;
  }

  // Check if token is expired (compare expiration time with current time)
  // if (tokenExpiration < Date.now()) {
    // return false;
  // }

  return true;
};

export default useIsAuthenticated;
