import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupList from './group/GroupList';
import GroupEdit from './group/GroupEdit';
import UserList from './user/UserList';
import FriendsList from './user/FriendsList';
import FriendRequestsList from './user/FriendRequestsList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/groups' element={<GroupList />} />
        <Route path='/users' element={<UserList />} />
        <Route path='/users/friends' element={<FriendsList />} />
        <Route path='/users/friends/requests' element={<FriendRequestsList />} />
        <Route path='/groups/:id' element={<GroupEdit />} />
      </Routes>
    </Router>
  )
}

export default App;