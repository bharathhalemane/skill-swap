import { useEffect } from "react"

export const useAppBadge = (unreadCount) => {
    useEffect(() => {
        if(!("setAppBadge" in navigator)) return 

        if (unreadCount > 0) {
            navigator.setAppBadge(unreadCount).catch(() => { })
        } else if ("clearAppBadge" in navigator) {
            navigator.clearAppBadge().catch(() => {})
        }
    },[unreadCount])
}

export default useAppBadge 