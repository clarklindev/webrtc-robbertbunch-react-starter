import peerConfiguration from './stunServers'
import socketConnection from "./socketConnection";

const createPeerConnection = (userName,typeOfCall)=>{
    //token for example
    const token = 123
    //init socket connection
    const socket = socketConnection(token) 
    try{
        const peerConnection = new RTCPeerConnection(peerConfiguration);
        //RTCPeerConnection is how WebRTC connects to another browser (peer).
        //It takes a config object, which (here) is just stun servers
        //STUN servers get our ICE candidates
        const remoteStream = new MediaStream();

        //peerConnection listeners
        peerConnection.addEventListener('signalingstatechange', (event)=>{
            console.log('signaling event change!');
            console.log(event);
            console.log(peerConnection.signalingState);
        })

        peerConnection.addEventListener('icecandidate', (event)=>{
            console.log('found an ice candidate');
            if(event.candidate){
                socket.emit('sendIceCandidateToSignalingServer', {
                    iceCandidate: event.candidate,
                    iceUserName: userName,
                    didIOffer: typeOfCall === 'offer'
                })
            }
        })

        //from remote -> they sent us a  track
        //- add to our remote stream
        peerConnection.addEventListener('track', (event)=>{
            event.streams[0].getTracks().forEach(track=>{
                remoteStream.addTrack(track, remoteStream);
                console.log('this should add some video/audio to the remote feed.');
            })
        })

        return({
            peerConnection,
            remoteStream,
        })
    }catch(err){
        console.log(err)
    }
}

export default createPeerConnection
