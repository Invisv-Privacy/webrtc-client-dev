export const CopyJoinLink = ({room, password, server}: 
    { room: string; password: string; server: string }) => {

    const joinLinkParams: { [key: string]: string } = {
        r: room,
        k: password,
        s: server,
    };

    const joinLink =
    window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port !== "" ? ":" + window.location.port : "") +
    window.location.pathname +
    "#" +
    "?" +
    new URLSearchParams(joinLinkParams).toString();

    return (<button onClick={() => {navigator.clipboard.writeText(joinLink);}}>
        {" "}Copy Join Link{" "}
    </button>);
}