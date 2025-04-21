import Navbar from "../../components/shared/Navbar";
import AuthSwitcher from "../../components/users/AuthSwitcher";

const AuthPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <AuthSwitcher />
    </>
  );
}

export default AuthPage;