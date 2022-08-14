import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import Survey from './components/survey/Survey';
import Home from './pages/Home';
import Header from './components/header/Header';

function App() {
  return (
    <div className="App">
    <Header/>
    <Navbar/>
<BrowserRouter>
  <Routes>
  <Route path='/' element={<Survey/>}/>
</Routes>
</BrowserRouter>
    </div>
  );
}
export default App;