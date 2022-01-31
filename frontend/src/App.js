import logo from './logo.svg';
import './App.css';
import MeetingList from './components/MeetingList.js';
import AddMeeting from './components/AddMeeting.js';
import Participants from './components/Participants.js';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element ={<MeetingList/>} />
            <Route path="/AddMeeting" element ={<AddMeeting/>} />
            <Route path="/AddMeeting/:id" element ={<AddMeeting/>} />
            <Route path="/Participants/:id" element ={<Participants/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
