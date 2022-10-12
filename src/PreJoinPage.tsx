import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { createLocalVideoTrack, LocalVideoTrack } from "livekit-client";
import {
  AudioSelectButton,
  ControlButton,
  VideoSelectButton,
} from "@livekit/react-components";
import { VideoRenderer } from "@livekit/react-core";
import { ReactElement, useEffect, useState } from "react";
import { AspectRatio } from "react-aspect-ratio";
import { useNavigate, useLocation } from "react-router-dom";
import cryptoRandomString from "crypto-random-string";
import axios from "axios";
import { generateName } from "./names";
import { getServerFromQuery } from "./serverList";

export const PreJoinPage = () => {
  // state to pass onto room
  const [name, setName] = useState<string>(generateName());
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  // disable connect button unless validated
  const [connectDisabled, setConnectDisabled] = useState(true);
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [audioDevice, setAudioDevice] = useState<MediaDeviceInfo>();
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo>();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  const roomQuery = query.get("r");
  const room: string =
    roomQuery !== undefined && roomQuery !== null
      ? roomQuery
      : cryptoRandomString({ length: 16, type: "url-safe" });

  const passwordQuery = query.get("k");
  const password: string =
    passwordQuery !== undefined && passwordQuery !== null
      ? passwordQuery
      : cryptoRandomString({ length: 16, type: "url-safe" });

  const serverQuery = query.get("s");
  const server = getServerFromQuery(serverQuery);

  useEffect(() => {
    if (name) {
      setConnectDisabled(false);
    } else {
      setConnectDisabled(true);
    }
  }, [name]);

  const toggleVideo = async () => {
    if (videoTrack) {
      videoTrack.stop();
      setVideoEnabled(false);
      setVideoTrack(undefined);
    } else {
      const track = await createLocalVideoTrack({
        deviceId: videoDevice?.deviceId,
      });
      setVideoEnabled(true);
      setVideoTrack(track);
    }
  };

  useEffect(() => {
    // enable video by default
    createLocalVideoTrack({
      deviceId: videoDevice?.deviceId,
    }).then((track) => {
      setVideoEnabled(true);
      setVideoTrack(track);
    });
  }, [videoDevice]);

  const toggleAudio = () => {
    if (audioEnabled) {
      setAudioEnabled(false);
    } else {
      setAudioEnabled(true);
    }
  };

  const selectVideoDevice = (device: MediaDeviceInfo) => {
    setVideoDevice(device);
    if (videoTrack) {
      if (
        videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId
      ) {
        return;
      }
      // stop video
      videoTrack.stop();
    }
  };

  const connectToRoom = async () => {
    if (videoTrack) {
      videoTrack.stop();
    }

    // Get access token
    const { data } = await axios.post(
      `${process.env.REACT_APP_SERVER_ENDPOINT!}/join`,
      {
        room: room,
        name: name,
      }
    );

    const params: { [key: string]: string } = {
      r: room,
      k: password,
      t: data.token,
      s: server,
      videoEnabled: videoEnabled ? "1" : "0",
      audioEnabled: audioEnabled ? "1" : "0",
    };
    if (audioDevice) {
      params.audioDeviceId = audioDevice.deviceId;
    }
    if (videoDevice) {
      params.videoDeviceId = videoDevice.deviceId;
    } else if (videoTrack) {
      // pass along current device id to ensure camera device match
      const deviceId = await videoTrack.getDeviceId();
      if (deviceId) {
        params.videoDeviceId = deviceId;
      }
    }
    navigate({
      pathname: "/room",
      search: "?" + new URLSearchParams(params).toString(),
    });
  };

  let videoElement: ReactElement;
  if (videoTrack) {
    videoElement = <VideoRenderer track={videoTrack} isLocal={true} />;
  } else {
    videoElement = <div className="placeholder" />;
  }

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
      <main className="hero">
        <div className="content">
          <div className="entrySection">
            <div>
              <div className="label">Name</div>
              <div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="right">
              <ControlButton
                label="Connect"
                disabled={connectDisabled}
                icon={faBolt}
                onClick={connectToRoom}
                className="green"
              />
            </div>
          </div>

          <div className="videoSection">
            <AspectRatio ratio={16 / 9}>{videoElement}</AspectRatio>
          </div>

          <div className="controlSection">
            <div>
              <AudioSelectButton
                isMuted={!audioEnabled}
                onClick={toggleAudio}
                onSourceSelected={setAudioDevice}
              />
              <VideoSelectButton
                isEnabled={videoTrack !== undefined}
                onClick={toggleVideo}
                onSourceSelected={selectVideoDevice}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
