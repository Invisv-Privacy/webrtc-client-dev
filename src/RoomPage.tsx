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
  ExternalE2EEKeyProvider,
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
import { CopyJoinLink } from "./joinLink";
import { getServerFromQuery, getServerUrlFromQuery } from "./serverList";

const e2eeKeyProvider = new ExternalE2EEKeyProvider();
const cryptoKey = new Uint8Array(32);
// Just testing w/ dumb key
// @ts-ignore
cryptoKey.forEach((v, i, array) => (array[i] = i));

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

  setLogLevel("debug");

  if (
    window.location.protocol === "https:" &&
    url.startsWith("ws://") &&
    !url.startsWith("ws://localhost")
  ) {
    return <div>Unable to connect to insecure websocket from https</div>;
  }

  const params: { [key: string]: string } = {
    r: room,
    s: server,
    k: password,
  };

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
            <a href="https://booth.video" className="boothlogo">
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
              <CopyJoinLink room={room} password={password} server={server} />
            </div>
          </div>
        </div>
        <LiveKitRoom
          url={url}
          token={token}
          onConnected={async (room) => {
            await room.setE2EEEnabled(true);

            // @ts-ignore
            e2eeKeyProvider.setKey(Uint8Array.from(cryptoKey));

            onConnected(room, query);
            // setTimeRemaining(room.roomTimeRemaining);
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
              simulcast: false,
            },
            videoCaptureDefaults: {
              resolution: VideoPresets.h720.resolution,
            },
            // @ts-ignore
            e2ePassword: password,

            e2ee: { keyProvider: e2eeKeyProvider },
          }}
          onLeave={onLeave}
        />
        <div className="privacyLabels">
          <div className="metadataSecurity tooltip">
            <InvisvIcon /> Metadata Security Enabled
            <span className="tooltiptext">
              First-of-its-kind metadata security: servers and third parties
              can't see the network identities or conversations of participants
              in a Booth.
            </span>
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
