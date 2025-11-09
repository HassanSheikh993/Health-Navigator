
export function NotificationBox(props){
    return(
        <>
        <div className="notification_box">
            <h1 className="notification_box_heading">{props.message} Notifications</h1>
            <h2>{props.data}</h2>
          </div>
        </>
    )
}