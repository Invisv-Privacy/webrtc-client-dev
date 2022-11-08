import "@livekit/react-components/dist/index.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PreJoinPage } from "./PreJoinPage";
import { RoomPage } from "./RoomPage";

const BrowserNotSupported = () => {
  return (
    <div className="prejoin">
      <header>
        <a href="https://invisv.com/booth" className="boothlogo">
          Booth
        </a>
        <nav>
          <ul>
            <li>
              <a href="https://invisv.com/" className="navlogo">
                INVISV
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="browserSupportContainer">
        <h1>Browser not supported. Please use a chromium based browser (Vivaldi, Brave, Chrome, Edge, etc.) instead.</h1>
      </div>
    </div>
  );
};

const App = () => {
  const isChrome = navigator.userAgent.includes("Chrome");
  if (isChrome) {
    return (
      <div className="container">
        <Router>
          <Routes>
            <Route path="/room" element={<RoomPage />} />
            <Route path="/" element={<PreJoinPage />} />
          </Routes>
        </Router>
      </div>
    );
  } else {
    return <BrowserNotSupported />;
  }
};

export default App;
