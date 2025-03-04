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

// const fetchTickerPrice = async () => {
//   try {
//     const response = await price("BTCUSDT");

//     if (response && response.data) {
//       console.log(response.data);
//     }
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

export default App;
