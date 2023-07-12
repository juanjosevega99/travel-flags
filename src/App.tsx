import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Header } from './components/Header';
import { CountryDetails } from './components/allCountries/CountryDetails';
import { HomePage } from './pages/HomePage';

function App() {
  const PUBLIC_URL = 'http://localhost:5173'

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' caseSensitive element={<HomePage />} />
        <Route caseSensitive path='/:name' element={<CountryDetails />} />
      </Routes>
      <HomePage />
    </BrowserRouter>
  );
}

export default App;
