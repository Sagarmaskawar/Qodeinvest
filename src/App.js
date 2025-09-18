import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './HomePage/HomePage';
import Portfolio from './Portfolio/Portfolio';
import Blogs from './Blogs/Blogs';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path='/' element={<HomePage/>}/>
        <Route path='/portfolios' element={<Portfolio/>}/> */}
         <Route path="/" element={<HomePage />}>
          <Route index element={<Blogs/>} />
          <Route path="portfolio" element={<Portfolio />} />
        </Route>
      </Routes>
      
  
    </div>
  );
}

export default App;
