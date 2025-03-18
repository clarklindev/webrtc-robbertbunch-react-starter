# [React with WebRTC in 80min - video chat app with React](https://www.youtube.com/watch?v=jIi_QuizfnQ)

[0:00](https://www.youtube.com/watch?v=jIi_QuizfnQ) - [1. Whiteboard Project](#1-whiteboard-project)  
[3:02](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=182s) - [2. Issues when putting these 2 together](#2-issues-when-putting-these-2-together)  
[8:13](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=493s) - [3. Demo](#3-demo)  
[10:04](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=604s) - [4. Project setup & resources](#4-project-setup-and-resources)  
[13:27](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=807s) - [5. Backend overview and test connection](#5-backend-overview-and-test-connection)  
[17:32](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=1052s) - [6. Handling potential errors (IMPORTANT!)](#6-handling-potential-errors-important)  
[19:21](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=1161s) - [7. Front-end code overview](#7-front-end-code-overview)  
[24:22](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=1462s) - [8. socketConnection and socket events](#8-socketconnection-and-socket-events)  
[28:02](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=1682s) - [9.Call and offer](#9-call-and-offer)  
[54:14](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=3254s) - [10. Enable and disable video](#10-enable-and-disable-video)  
[70:26](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=4226s) - [11. Answer](#11-answer)  
[81:30](https://www.youtube.com/watch?v=jIi_QuizfnQ&t=4890s) - [12. Hangup button](#12-hangup-button)  

## 1. Whiteboard Project  

<img
src='exercise_files/01-whiteboard-project-who-drives.png'
alt=''
width=600
/>


## 2. Issues when putting these 2 together
- let webrtc drive (as it is async) and do its thing then hand it to react 

## 3. Demo

<img
src='exercise_files/03-demo-1.png'
alt='03-demo-1.png'
width=600
/>

<img
src='exercise_files/03-demo-1b.png'
alt='03-demo-1b.png'
width=600
/>

<img
src='exercise_files/03-demo-2.png'
alt='03-demo-2.png'
width=600
/>

<img
src='exercise_files/03-demo-3.png'
alt='03-demo-3.png'
width=600
/>

<img
src='exercise_files/03-demo-4.png'
alt='03-demo-4.png'
width=600
/>

## 4. Project setup and resources
- [https://www.youtube.com/watch?v=jIi_QuizfnQ](https://www.youtube.com/watch?v=jIi_QuizfnQ)
- [https://github.com/robertbunch/webrtc-react-starter](https://github.com/robertbunch/webrtc-react-starter)
- connecting from frontend requires https (WebRTC Media requires https)
- backend is http

### create react app (https in development)
- NOTE: REQUIRED STEP!
- [https in development](https://create-react-app.dev/docs/using-https-in-development/#custom-ssl-certificate)
- package.json 
    - `"start": "cross-env HTTPS=true SSL_CRT_FILE=./certs/cert.crt SSL_KEY_FILE=./certs/cert.key react-scripts start"`
    - note that im using `cross-env` npm module for crossplatform env variable and i am also using my certs... 

## 5. Backend overview and test connection  

### test the connection:
- 16min40sec 
- front-end/src/Components/Home.js
- uncomment
- NOTE: after test, recomment else it will mess with the backend
- OUTCOME: browser console logs `pong`
- TROUBLESHOOT: the version of frontend package and backend package should be same 
    - eg. backend "socket.io": "^4.7.5"
    - eg. frontend "socket.io-client": "^4.7.5"

```js
//front-end/src/Components/Home.js
useEffect(()=>{
    const test = async()=>{
        const socket = socketConnection("test")
    }
    //if this works, you will get pong in the console!
    test()
},[])
```
## 6. Handling potential errors (IMPORTANT!)
- @17min32sec 
- restart server
- restart browser/page

## 7. Front-end code overview  
- @19min21sec
- TODO: move app state (which in tutorial is being passed down to each component) into react context
- App State (tutorial):
    - callStatus
    - localStream
    - remoteStream
    - peerConnection
    - username
    - offerData

- OUTCOME: code has been updated to use react context for app level state (instead of passing props to each component) 
- OUTCOME: using react-router 6.3

<img
src='exercise_files/07-front-end-code-overview-move-app-state-to-react-context.png'
alt='07-front-end-code-overview-move-app-state-to-react-context.png'
width=600
/>

### Home 
- once `join` is clicked, 
- user asked for username
- INITIATE socket connection: `const socket = socketConnection(userName);`
- socketConnection.js code runs...


```js
//Home.js
useEffect(() => {
    if(joined){
        const userName = prompt('enter username: ');
        setUserName(userName);

        const setCalls = data => {
            setAvailableCalls(data);
            console.log(data);
        }
        //initiate socket connection
        const socket = socketConnection(userName);
        socket.on('availableOffers', setCalls);
        socket.on('newOfferWaiting', setCalls);
    }
}, [joined]);
```
## 8. socketConnection and socket events  
### socketConnection.js
- single instance socket pattern
- receives name as prop
- creates the socket connection:
- passes to socket connection object `auth` object which has `password`

```js

const socketConnection = userName =>{
    //...

    socket = io.connect('http://localhost:8181',{
    // socket = io.connect('https://192.168.1.44:8181',{
        auth: {
            // jwt,
            password: "x",
            userName, 
        }
    });
    }
```

## 9. Call and offer  
- 28min02sec

### call 
```js
//Home.js
//called on "Call" or "Answer"
const initCall = async (typeOfCall) => {
    //set localStream and GUM
    await prepForCall(callStatus,updateCallStatus,setLocalStream);
};

//...
const call = async () => {
    //call related stuff goes here
    initCall('offer');
};
```

### prepForCall
- deals with GUM (get user media)
- sets `callStatus.haveMedia` to `true` 


```js
//webrtcUtilities/prepForCall.js
//Share this function for both sides, answer and caller
// because both sides need to do this same thing before
// we can move forward
import socketConnection from "./socketConnection";


const prepForCall = (callStatus,updateCallStatus,setLocalStream)=>{
    return new Promise(async(resolve, reject)=>{
        //can bring constraints in as a param
        const constraints = {
            video: true, //must have one constraint, dont have to show it yet
            audio: false, 
        }
        try{
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            //update bools
            const copyCallStatus = {...callStatus}
            copyCallStatus.haveMedia = true //signals to the app that we have media
            copyCallStatus.videoEnabled = null //init both to false, you can init to true
            copyCallStatus.audioEnabled = false
            updateCallStatus(copyCallStatus)
            setLocalStream(stream)
            resolve()
        }catch(err){
            console.log(err);
            reject(err)
        }
    })
}

export default prepForCall
```

### createPeerConnection() 
- which causes Home's next useEffect(() => {}, [callStatus.haveMedia]); to be called
- which causes a peerConnection to be setup `const peerConnection = new RTCPeerConnection(peerConfiguration);`
- `peerConfiguration` is our stun servers setup (iceServers)
- assign to `remoteStream` by creating a `new MediaStream()`
- add some listeners `signalingstatechange`, `icecandidate`, `track`
- when `icecandidate`s comes in, emit and send `sendIceCandidateToSignalingServer`
- for track listener, when it comes in (from other side), add each track to remoteStream
- createPeerConnection() returns `peerConnection` and `remoteStream`
- in Home -> destruct from the return of createPeerConnection `const {peerConnection, remoteStream} = createPeerConnection(userName, typeOfCall);`
- call setPeerConnection(peerConnection)

```js
//createPeerConn.js
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

        //peerConnection listeners'
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

        //something came in from other side -> tracks and add it to remoteStream
        peerConnection.addEventListener('track', (event)=>
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

```

### useEffect(() => {}, [typeOfCall, peerConnection]);
- the next part of Home, happens because we have just set peerConnection
- we can now add socketListeners
- check to see the sockListener is defined then call
- `webrtcUtilities/clientSocketListeners`
- this has 2 listeners inside:
    - `socket.on('answerResponse', ....);`
    - `socket.on('receivedIceCandiddateFromServer', ...)`

```js
//We know which type of client this is and have PC.
//Add socketlisteners
useEffect(() => {
    if(typeOfCall && peerConnection){
        const socket = socketConnection(userName);
        clientSocketListeners(socket,typeOfCall,callStatus,
    updateCallStatus,peerConnection);
    }
}, [typeOfCall, peerConnection]);
```

## 10. Enable and disable video  
### VideoButton
- @54min14sec -> @63min18sec

```js
//VideoButton.js
//handle user clicking on video button

const VideoButton = ({localFeedEl,callStatus,localStream,updateCallStatus,peerConnection})=>{

    //handle user clicking on video button
    const startStopVideo = ()=>{
        const copyCallStatus = {...callStatus};
        //useCases:
        if(copyCallStatus.videoEnabled){
            //1. video is enabled, so we need to disable it (ref. prepForCall.js)
            //disable
            copyCallStatus.videoEnabled = false;
            updateCallStatus(copyCallStatus);
            const tracks = localStream.getVideoTracks();
            tracks.forEach(track=>track.enabled === false); //correct way to disable track in peer connection

        }else if(copyCallStatus.videoEnabled === false){
            //2. video is disabled so we need to enable
            copyCallStatus.videoEnabled = true;
            updateCallStatus(copyCallStatus);
            const tracks = localStream.getVideoTracks();
            tracks.forEach(track=>track.enabled === true); //correct way to enable track in peer connection

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
```

### CallerVideo
- @64min07sec -> @70min26sec
```js
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
```

## 11. Answer  
- @70min26sec

## 12. Hangup button  
- @81min30sec