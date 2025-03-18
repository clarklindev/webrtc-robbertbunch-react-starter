import React, {useReducer, useContext } from 'react';

const initialState = {
    callStatus:{},
    localStream:null,
    remoteStream:null,
    peerConnection:null,
    username:'',
    offerData:null,
    //haveMedia,
    //videoEnabled, 
    //audioEnabled, 
    //haveOffer
}

const exposedFunctions = {
    updateCallStatus:()=>{},
    setLocalStream:()=>{},
    setRemoteStream:()=>{},
    setPeerConnection:()=>{},
    setUserName:()=>{},
    setOfferData:()=>{},
}

const WebrtcContext = React.createContext({
    ...initialState,
    ...exposedFunctions
});


const webrtcReducer = (state, action)=>{
    switch(action.type){
        case "updateCallStatus":
            return {...state, callStatus: action.payload.callStatus};
        case "setLocalStream":
            return {...state, localStream: action.payload.localStream};
        case "setRemoteStream":
            return {...state, remoteStream: action.payload.remoteStream};
        case "setPeerConnection":
            return {...state, peerConnection: action.payload.peerConnection};
        case "setUserName":
            return {...state, userName: action.payload.userName};
        case "setOfferData":
            return {...state, offerData: action.payload.offerData};
        default:
            return state;
    }
}

export const WebrtcProvider = ({children})=>{
    const [state, dispatch] = useReducer(webrtcReducer, initialState);
    
    const updateCallStatus = (callStatus)=>{
        dispatch({type: 'updateCallStatus', payload:{callStatus} });
    }

    const setLocalStream = (localStream)=>{
        dispatch({type: 'setLocalStream', payload:{localStream}})
    }

    const setRemoteStream = (remoteStream)=>{
        dispatch({type: 'setRemoteStream', payload:{remoteStream}})
    }

    const setPeerConnection = (peerConnection)=>{
        dispatch({type: 'setPeerConnection', payload:{peerConnection}})
    }
    
    const setUserName = (userName)=>{
        dispatch({type: 'setUserName', payload:{userName}})
    }

    const setOfferData = (offerData)=>{
        dispatch({type: 'setOfferData', payload:{offerData}})
    }

    const context = {
        ...state,
        updateCallStatus,
        setLocalStream,
        setRemoteStream,
        setPeerConnection,
        setUserName,
        setOfferData
    }

    return (
        <WebrtcContext.Provider value={ context }>
            {children}
        </WebrtcContext.Provider>
    );

}

export const useWebrtc = () => {
    return useContext(WebrtcContext );
};