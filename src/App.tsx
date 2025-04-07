import { FC, ReactNode, useEffect, useState } from "react";
import { BrowserRouter } from "react-router";

import AppRouter from "./router/AppRouter.tsx";
import { useAppDispatch } from "./hooks/redux.ts";
import { checkAuth } from "./store/slices/authSlice.ts";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner.tsx";

const App: FC = (): ReactNode => {
  const dispatch = useAppDispatch();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (window.localStorage.getItem("refreshToken")) {
        try {
          await dispatch(checkAuth()).unwrap();
        } catch (error) {
          console.log(error);
        } finally {
          setAppLoading(false);
        }
      }

      setAppLoading(false);
      return;
    };

    checkAuthStatus();
  }, []);

  if (appLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
};

export default App;
