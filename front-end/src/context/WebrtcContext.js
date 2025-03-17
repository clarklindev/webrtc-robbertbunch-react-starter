import React, {useReducer, useContext } from 'react';

const initialState = {
    something:null,
    setSomethingElse:null
}

const exposedFunctions = {
    setSomething:()=>{},
    setSomethingElse:()=>{},
    addBlogPost:(title, detail)=>{}
}

const WebrtcContext = React.createContext({
    ...initialState,
    ...exposedFunctions
});


const webrtcReducer = (state, action)=>{
    switch(action.type){
        case "add_blogpost":
            return [...state, {title: action.payload.title, detail: action.payload.detail}];
        default:
            return state;
    }
}

export const WebrtcProvider = ({children})=>{
    const [state, dispatch] = useReducer(webrtcReducer, initialState);
    
    const setSomething = ()=>{}
    const setSomethingElse = ()=>{}
    const addBlogPost = (title, detail)=>{
        dispatch({type: 'add_blogpost', payload:{title, detail} });
    }
    
    const context = {
        ...state,
        setSomething,
        setSomethingElse,
        addBlogPost
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