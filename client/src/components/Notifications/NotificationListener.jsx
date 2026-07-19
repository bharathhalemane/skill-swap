import { useEffect } from "react";
import Cookies from "js-cookie"
import { useDispatch, useSelector } from 'react-redux'
import  {socket}  from "../../Socket";
import { fetchUnreadCount } from "../../redux/features/notifications/notificationsActions";
import { addNotification } from "../../redux/features/notifications/notificationsSlice";
import { useAppBadge } from "../../hooks/useAppBadge"

const NotificationListener = () => {
    const dispatch = useDispatch() 
    const unreadCount = useSelector(state => state.notifications.unreadCount)

    useAppBadge(unreadCount)

    useEffect(() => {
        const userId = Cookies.get("userId")
        if (!userId) return 
        
        dispatch(fetchUnreadCount)

        const handleNewNotification = (payload) => {
            dispatch(addNotification(payload))
        }

        socket.on("notification:new", handleNewNotification)

        return () => {
            socket.off("notification:new",handleNewNotification)
        }
    }, [dispatch])
    
    return null
}

export default NotificationListener