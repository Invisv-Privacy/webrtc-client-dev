const serverList = {
  lax: "wss://lax.livekit.stations.invisv.com",
  iad: "wss://iad.livekit.stations.invisv.com",
  lhr: "wss://lhr.livekit.stations.invisv.com",
  sin: "wss://sin.livekit.stations.invisv.com",
  fra: "wss://fra.livekit.stations.invisv.com",
  sjc: "wss://sjc.livekit.stations.invisv.com",
  "lax-no-preproxy": "wss://lax-no-preproxy.livekit.stations.invisv.com",
};

export const getServerFromQuery: (
  query: string | null | undefined
) => string = (query: string | null | undefined) => {
  return (query || "") in serverList
    ? query || ""
    : process.env.REACT_APP_WEBRTC_SERVER || "";
};

export const getServerUrlFromQuery: (query: string) => string = (
  query: string
) => {
  const server = getServerFromQuery(query);
  const url: string =
    server in serverList
      ? serverList[server]
      : process.env.REACT_APP_WEBRTC_ENDPOINT;

  return url;
};
