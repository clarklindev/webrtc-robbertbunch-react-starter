
const VideoButton = ({localFeedEl,callStatus,localStream,updateCallStatus,peerConnection})=>{

    //handle user clicking on video button
    const startStopVideo = ()=>{
        const copyCallStatus = {...callStatus};
        //useCases:
        if(copyCallStatus.videoEnabled){
            //1. video is enabled, so we need to disablee it (ref. prepForCall.js)
            //disable
            copyCallStatus.videoEnabled = false;
            updateCallStatus(copyCallStatus);
            const tracks = localStream.getVideoTracks();
            tracks.forEach(track=>track.enabled = false); //correct way to disable track in peer connection

        }else if(copyCallStatus.videoEnabled === false){
            //2. video is disabled so we need to enable
            copyCallStatus.videoEnabled = true;
            updateCallStatus(copyCallStatus);
            const tracks = localStream.getVideoTracks();
            tracks.forEach(track=>track.enabled = true); //correct way to enable track in peer connection

        } else if(copyCallStatus.videoEnabled === null){
            //3. video is null, so we need to init
            console.log('init video');
            copyCallStatus.videoEnabled = true;
            updateCallStatus(copyCallStatus);

            //we are not adding tracks so they are visible in the video tag.
            //we are adding them to the peerConnection so they can be sent
            localStream.getTracks().forEach(track=> {
                peerConnection.addTrack(track, localStream);
            })
        }


    }

    return(
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    )
}
export default VideoButton;