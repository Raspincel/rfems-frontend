import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { selectIsAuthenticated, setIsLoggedIn } from "../store/slice";
import { Loader } from "../../../components/common/Loader";
import { IsLoggedIn } from "../../../../wailsjs/go/bindings/app";

export function ProtectedRoute() {
  const [isChecking, setIsChecking] = useState(true);
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function checkLogin() {
      try {
        const verified = await IsLoggedIn();

        if (mounted) {
          dispatch(setIsLoggedIn(verified));

          setIsChecking(false);

          if (!verified) {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Auth check failed", err);
        if (mounted) navigate("/login");
      }
    }

    checkLogin();

    return () => {
      mounted = false;
    };
  }, [dispatch, navigate]);

  if (isChecking) return <Loader />;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}
