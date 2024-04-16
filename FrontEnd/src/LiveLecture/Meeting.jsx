import { useLocation } from "react-router-dom";

function Meeting(){

    const state = useLocation()
    console.log('id is '+state);
    return(
        <h1>Wait joining you</h1>
    )
}

export default Meeting;