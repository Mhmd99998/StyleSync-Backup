import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const useIsAdmin = () => {
  const { role } = useSelector((state: RootState) => state.user);

  if (role == "customer") {
    return false;
  }

  return true;
};

export default useIsAdmin;
