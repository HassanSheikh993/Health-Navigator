

export function UserMessage(props){
    return(
        <>
        <div className="user_messages">
            <h3>You've Got a New Report</h3>
            <h4>From: {props.data}</h4>
          </div>
        </>
    )
}