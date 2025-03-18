import { useEffect, useRef, useState } from "react";
import './VideoPage.css'
import { useSearchParams, useNavigate } from 'react-router-dom';
import socketConnection from '../webrtcUtilities/socketConnection'
import ActionButtons from './ActionButtons/ActionButtons'
import VideoMessageBox from "./VideoMessageBox";
import { useWebrtc } from "../context/WebrtcContext";

const CallerVideo = ()=>{

    const { callStatus, updateCallStatus, peerConnection, remoteStream, setRemoteStream, userName, setUserName, localStream, setLocalStream} = useWebrtc();

    const remoteFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const localFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const navigate = useNavigate();
    const [ videoMessage, setVideoMessage ] = useState("Please enable video to start!")
    const [ offerCreated, setOfferCreated ] = useState(false)

    //send back to home if no localStream
    useEffect(()=>{
        if(!localStream){
            navigate('/');
        }
        else{
            //set video tags
            remoteFeedEl.current.srcObject = remoteStream;
            localFeedEl.current.srcObject = localStream;
        }
    },[])
    
    //if we have tracks, disable the video message
    useEffect(()=>{
        if(peerConnection){

        }
    },[peerConnection])

    //once the user has shared video, start WebRTC'ing :)
    useEffect(()=>{
        const shareVideoAsync = async ()=>{
            const offer = await peerConnection.createOffer();
            peerConnection.setLocalDescription(offer);
            //we can now start collecting ice candidates!
            //we need to emit the offer to the server
            const socket = socketConnection(userName);
            socket.emit('newOffer', offer);
            setOfferCreated(true);//so useEffect doesnt make offer again
            setVideoMessage('Awaiting answer....');//update video message box
            console.log("created offer, setLocalDesc, emitted offer, updated VideoMessage")

        }
        if(!offerCreated && callStatus.videoEnabled){
            //CREATE AN OFFER!
            console.log('we have video and no offer...making an offer');
            shareVideoAsync();
        }
    },[callStatus.videoEnabled,offerCreated])
    

    useEffect(()=>{
        console.log(callStatus)
        const addAnswerAsync = async()=>{
            console.log(callStatus)
            await peerConnection.setRemoteDescription(callStatus.answer);
            console.log(peerConnection.signalingState)
            console.log("Answer added!")
        }
        if(callStatus.answer){
            addAnswerAsync()
        }
    },[callStatus])

    return (
        <div>
            <div className="videos">
                <VideoMessageBox message={videoMessage} />
                <video id="local-feed" ref={localFeedEl} autoPlay controls playsInline></video>
                <video id="remote-feed" ref={remoteFeedEl} autoPlay controls playsInline></video> 
            </div>
            <ActionButtons 
                localFeedEl={localFeedEl}
                remoteFeedEl={remoteFeedEl}
                callStatus={callStatus}
                localStream={localStream}
                updateCallStatus={updateCallStatus}
                peerConnection={peerConnection}
            />
        </div>
    )
}

export default CallerVideo
