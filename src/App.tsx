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
        <h1>
          Requires a browser with WebRTC end-to-end encryption support (Chrome,
          Safari, Edge, Vivaldi, Brave).
        </h1>
      </div>
    </div>
  );
};

// From webrtc/samples:
// https://github.com/webrtc/samples/blob/8ffcd6d52e83ae2f857011c29dffc9bbff264eb4/src/content/insertable-streams/endtoend-encryption/js/main.js#L42-L57
const supportsE2EE = () => {
  // @ts-expect-error
  let hasEnoughAPIs = !!window.RTCRtpScriptTransform;

  if (!hasEnoughAPIs) {
    const supportsInsertableStreams =
      // @ts-expect-error
      !!window.RTCRtpSender?.prototype.createEncodedStreams;

    let supportsTransferableStreams = false;
    try {
      const stream = new ReadableStream();
      window.postMessage(stream, "*", [stream]);
      supportsTransferableStreams = true;
    } catch (e) {
      console.error("Transferable streams are not supported.");
    }
    hasEnoughAPIs = supportsInsertableStreams && supportsTransferableStreams;
  }
  return hasEnoughAPIs;
};

const App = () => {
  if (supportsE2EE()) {
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
