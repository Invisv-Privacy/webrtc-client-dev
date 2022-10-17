import {
  faSquare,
  faThLarge,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Room,
  RoomEvent,
  setLogLevel,
  VideoPresets,
  DisconnectReason,
} from "livekit-client";
import {
  DisplayContext,
  DisplayOptions,
  LiveKitRoom,
} from "@livekit/react-components";
import { useState, useEffect } from "react";
import "react-aspect-ratio/aspect-ratio.css";
import { useNavigate, useLocation } from "react-router-dom";
import InvisvIcon from "./InvisvIcon";

import { getServerFromQuery, getServerUrlFromQuery } from "./serverList";

export const RoomPage = () => {
  const [numParticipants, setNumParticipants] = useState(0);
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: "grid",
    showStats: false,
  });
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("t");
  const recorder = query.get("recorder");
  const room = query.get("r");
  const passwordQuery = query.get("k");
  const password = passwordQuery || "";

  const serverQuery = query.get("s") || "";

  const server = getServerFromQuery(serverQuery);
  const url = getServerUrlFromQuery(serverQuery);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(
        () => setTimeRemaining(timeRemaining - 1),
        1000
      );
      return () => clearInterval(timer);
    } else {
      return () => {};
    }
  }, [timeRemaining]);

  if (!url || !token || !room || !password) {
    return <div>url and token are required</div>;
  }

  const params: { [key: string]: string } = {
    r: room,
    s: server,
    k: password,
  };

  const joinLink =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port !== "" ? ":" + window.location.port : "") +
    window.location.pathname +
    "#" +
    "?" +
    new URLSearchParams(params).toString();

  setLogLevel("debug");

  if (
    window.location.protocol === "https:" &&
    url.startsWith("ws://") &&
    !url.startsWith("ws://localhost")
  ) {
    return <div>Unable to connect to insecure websocket from https</div>;
  }

  const onLeave = () => {
    navigate({
      pathname: "/",
      search: "?" + new URLSearchParams(params).toString(),
    });
  };

  const updateParticipantSize = (room: Room) => {
    setNumParticipants(room.participants.size + 1);
  };

  const onParticipantDisconnected = (room: Room) => {
    updateParticipantSize(room);

    /* Special rule for recorder */
    if (
      recorder &&
      parseInt(recorder, 10) === 1 &&
      room.participants.size === 0
    ) {
      console.log("END_RECORDING");
    }
  };

  function handleRoomDisconnect(room: Room, reason?: DisconnectReason) {
    if (!room) return;
    console.log("DISCONNECTED FROM ROOM", reason);
  }

  const updateOptions = (options: DisplayOptions) => {
    setDisplayOptions({
      ...displayOptions,
      ...options,
    });
  };

  return (
    <DisplayContext.Provider value={displayOptions}>
      <div className="roomContainer">
        <div className="topBar">
          <div>
            <a href="https://invisv.com/booth" className="boothlogo">
              Booth
            </a>
          </div>
          <div className="right">
            {timeRemaining > 0 && (
              <div className="countdownTimer">
                Time Remaining: {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, "0")}
              </div>
            )}
            <div className="showStatsContainer">
              <input
                id="showStats"
                type="checkbox"
                onChange={(e) => updateOptions({ showStats: e.target.checked })}
              />
              <label htmlFor="showStats">Show Stats</label>
            </div>
            <div>
              <button
                className="iconButton"
                disabled={displayOptions.stageLayout === "grid"}
                onClick={() => {
                  updateOptions({ stageLayout: "grid" });
                }}
              >
                <FontAwesomeIcon height={32} icon={faThLarge} />
              </button>
              <button
                className="iconButton"
                disabled={displayOptions.stageLayout === "speaker"}
                onClick={() => {
                  updateOptions({ stageLayout: "speaker" });
                }}
              >
                <FontAwesomeIcon height={32} icon={faSquare} />
              </button>
            </div>
            <div className="participantCount">
              <FontAwesomeIcon icon={faUserFriends} />
              <span>{numParticipants}</span>
            </div>
            <div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(joinLink);
                }}
              >
                {" "}
                Copy Join Link to Clipboard{" "}
              </button>
            </div>
          </div>
        </div>
        <LiveKitRoom
          url={url}
          token={token}
          onConnected={(room) => {
            onConnected(room, query);
            setTimeRemaining(room.roomTimeRemaining);
            room.on(RoomEvent.ParticipantConnected, () =>
              updateParticipantSize(room)
            );
            room.on(RoomEvent.ParticipantDisconnected, () =>
              onParticipantDisconnected(room)
            );
            room.on(RoomEvent.Disconnected, (reason?: DisconnectReason) =>
              handleRoomDisconnect(room, reason)
            );
            updateParticipantSize(room);
          }}
          roomOptions={{
            adaptiveStream: true,
            dynacast: true,
            publishDefaults: {
              simulcast: true,
            },
            videoCaptureDefaults: {
              resolution: VideoPresets.h720.resolution,
            },
            // @ts-ignore
            e2ePassword: password,
          }}
          onLeave={onLeave}
        />
        <div className="privacyLabels">
          <div>🔐 End-to-End Encryption Enabled</div>
          <div className="metadataSecurity">
            <InvisvIcon /> Metadata Security Enabled
          </div>
        </div>
      </div>
    </DisplayContext.Provider>
  );
};

async function onConnected(room: Room, query: URLSearchParams) {
  // make it easier to debug
  (window as any).currentRoom = room;

  if (isSet(query, "audioEnabled")) {
    const audioDeviceId = query.get("audioDeviceId");
    if (audioDeviceId && room.options.audioCaptureDefaults) {
      room.options.audioCaptureDefaults.deviceId = audioDeviceId;
    }
    await room.localParticipant.setMicrophoneEnabled(true);
  }

  if (isSet(query, "videoEnabled")) {
    const videoDeviceId = query.get("videoDeviceId");
    if (videoDeviceId && room.options.videoCaptureDefaults) {
      room.options.videoCaptureDefaults.deviceId = videoDeviceId;
    }
    await room.localParticipant.setCameraEnabled(true);
  }
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === "1" || query.get(key) === "true";
}
