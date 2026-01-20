// Header.tsx
import { useContext } from "react";
import LinkComponent from "../ui/LinkComponent";
import AuthContext from "../../context/auth/AuthContext";

function Header() {
  const { authenticated, signout } = useContext(AuthContext);
  return (
    <header className="border-b p-3 flex justify-between items-center bg-white shadow-md text-xl">
      {/* Left side: App name */}
      <div className="text-xl font-bold">
        <LinkComponent url="/" name="Re-Type" />
      </div>

      {/* Right side: Navigation links */}
      <nav className="flex gap-4">
        <LinkComponent url="/" name="Home" />

        {(authenticated && (
          <LinkComponent url="/auth" name="Sign Out" signout={signout} />
        )) || <LinkComponent url="/auth" name="login" />}
      </nav>
    </header>
  );
}

export default Header;
