import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface IProps {
  children?: ReactNode;
}

function ScrollToTop({ children }: IProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return children;
}

export default ScrollToTop;
