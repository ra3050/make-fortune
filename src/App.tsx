import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "components/pages/MainPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
