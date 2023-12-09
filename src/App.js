import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import Navbar from './components/Navbar';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import HighestRuns from './components/HighestRuns';
import HighestWickets from './components/HighestWickets';
import TeamWiseStats from './components/TeamWiseStats';

function App() {
  
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/" Component={Home} />
          <Route exact path="/highestRuns" Component={HighestRuns}/>
          <Route exact path="/highestWickets" Component={HighestWickets}/>
          <Route exact path="/teamWiseStats" Component={TeamWiseStats}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
