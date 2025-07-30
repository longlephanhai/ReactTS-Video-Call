import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";

const LiveVideo = () => {

  const appId = import.meta.env.VITE_APP_ID; // Get the Agora App ID from environment variables
  // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const { channelName } = useParams() //pull the channel name from the param

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const { localCameraTrack } = useLocalCameraTrack(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(true);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const toggleCamera = () => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(!cameraOn);
      setCameraOn(!cameraOn);
    }
  };

  const toggleMic = () => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  };


  // to leave the call
  const navigate = useNavigate()

  // Join the channel
  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token: "007eJxTYBA7/lYs4pXCVCmB7ekXWx95/uhlmrhVW4r9g2uwhIt7UIECQ7KRqamBZZqlkaGRpYlZkpFlsrmRqXlasplJYopZmolFulZXRkMgI8M+E14WRgYIBPF5GYJSE5NLQoJ1wzJTUvMZGACWcx8g",
    },
    activeConnection,
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // play the remote user audio tracks
  useEffect(() => {
    audioTracks.forEach(track => track.play());
  }, [audioTracks]);

  return (
    <>
      <div id='remoteVideoGrid'>
        {
          // Initialize each remote stream using RemoteUser component
          remoteUsers.map((user) => (
            <div key={user.uid} className="remote-video-container">
              <RemoteUser user={user} />
            </div>
          ))
        }
      </div>
      <div id='localVideo'>
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={micOn}
          playVideo={cameraOn}
          className=''
        />
        <div>
          {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
          <div id="controlsToolbar">
            <div id="mediaControls">
              <button className="btn" onClick={toggleMic}>
                {micOn ? "Mic Off" : "Mic On"}
              </button>
              <button className="btn" onClick={toggleCamera}>
                {cameraOn ? "Camera Off" : "Camera On"}
              </button>
            </div>
            <button id="endConnection"
              onClick={() => {
                setActiveConnection(false)
                localCameraTrack?.close();
                localMicrophoneTrack?.close();
                navigate('/')
              }}> Disconnect
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LiveVideo