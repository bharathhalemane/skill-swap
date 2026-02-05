import { useSearchParams } from 'react-router-dom'
import HomeHeader from '../Header/HomeHeader'
const BrowseSkills = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const userId = searchParams.get("userId")

    console.log(token, userId)    
    return (
        <div>
            <HomeHeader />
            <h2>Browse Skills Page</h2>
        </div>
    )
}

export default BrowseSkills;