import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';

function App() {
  return (
   <>
   <Header/>
   {/* <IPAddress></IPAddress> */}
   <Routes>
    <Route path='/' Component={Home}></Route>
   </Routes>
   </>
  );
}

export default App;
