import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Header } from './components/Header';
import { CountryDetails } from './components/allCountries/CountryDetails';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/:name' element={<CountryDetails />} />
        <Route path='/' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
