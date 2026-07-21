import {useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import HomeHeader from "../../components/Header/HomeHeader"
import ConversationList from "./components/ConversationList"
import ChatWindow from "./components/ChatWindow"
import {fetchConversations}from "../../redux/features/chat/chatActions"
import {MessageSquare} from "lucide-react"
import styles from "./ChatPage.module.css"

const ChatPage = () => {
    const dispatch = useDispatch() 
    const navigate = useNavigate() 
    const { conversationId } = useParams()
    const conversations = useSelector(state => state.chat.conversations)
    const loading = useSelector(state=> state.chat.loading)
    useEffect(() => {
        dispatch(fetchConversations())  
    }, [dispatch])
    
    const activeConversation = conversations.find(c => c._id === conversationId) 


    return <>
        <HomeHeader />
        <div className={styles.page}>
            <div className={styles.shell}>
                <div className={`${styles.listPane} ${conversationId ? styles.hideOnMobile : ""}`}>
                    <ConversationList
                        conversations={conversations}
                        loading={loading}
                        activeId={conversationId}
                        onSelect={(id) => navigate(`/chat/${id}`)}
                    />
                </div>
                <div className={`${styles.windowPane} ${!conversationId ? styles.hideOnMobile : ""}`}>
                    {
                        activeConversation?(
                        <ChatWindow conversation={activeConversation} onBack={() => navigate("/chat")}/>
                        ) : (
                                <div className={styles.emptyState}>
                                    <MessageSquare size={48} strokeWidth={1.5} />
                                    <p>Pick a conversation to start chatting</p>
                                </div>
                    )}
                </div>
            </div>
        </div>
    </>
}

export default ChatPage