import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupList from './GroupList';
import GroupEdit from './GroupEdit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/groups' element={<GroupList/>}/>
        <Route path='/groups/:id' element={<GroupEdit/>}/>
      </Routes>
    </Router>
  )
}

export default App;