import { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router";

import AppRouter from "./components/AppRouter/AppRouter.tsx";

const App: FC = (): ReactNode => {
  return (
    <div className="app">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
};

export default App;
