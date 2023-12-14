import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import TeamWiseStats from './components/TeamWiseStats';
import HighestRunsAndWickets from './components/HighestRunsAndWickets';
import MiscStats from './components/MiscStats';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/" Component={Home} />
          <Route exact path="/highestsRunsAndWickets" Component={HighestRunsAndWickets}/>
          <Route exact path="/teamWiseStats" Component={TeamWiseStats}/>
          <Route exact path="/miscStats" Component={MiscStats}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
