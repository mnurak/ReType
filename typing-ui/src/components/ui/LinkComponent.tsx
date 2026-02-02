// LinkComponent.tsx
import { Link, useNavigate } from "react-router-dom";

function LinkComponent({
  url,
  name,
  target,
  signout,
}: {
  url: string;
  name: string;
  target?: string;
  signout?: () => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if(signout){
      const navigate = useNavigate()
      e.preventDefault()
      signout()
      navigate("/auth")
    }
  }
  return (
    <Link
      onClick={handleClick}
      to={url}
      target={target}
      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
    >
      {name}
    </Link>
  );
}

export default LinkComponent;
