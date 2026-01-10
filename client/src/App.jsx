import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from "./pages/Signin";

import Signup from './pages/Signup';
import Search from './pages/Search';
import About from './pages/About';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import TestPayment from './pages/TestPayment';


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/test-payment" element={<TestPayment />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
