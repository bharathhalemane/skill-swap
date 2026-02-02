import Header from "../Header/Header";
import './Dashboard.css'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const categories = [
    { name: "Technology", icon: "💻", count: 234 },
    { name: "Design", icon: "🎨", count: 189 },
    { name: "Photography", icon: "📷", count: 145 },
    { name: "Music", icon: "🎵", count: 167 },
    { name: "Languages", icon: "🌍", count: 198 },
    { name: "Wellness", icon: "🧘", count: 123 },
    { name: "Business", icon: "💼", count: 156 },
    { name: "Cooking", icon: "🍳", count: 134 },
];
const mockSkills = [
    {
        id: "1",
        title: "Web Development with React & TypeScript",
        category: "Technology",
        description: "Learn to build modern, scalable web applications using React and TypeScript from scratch.",
        instructor: {
            name: "Sarah Chen",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        },
        rating: 4.9,
        reviews: 128,
        duration: "8 hours",
        level: "Intermediate",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    },
    {
        id: "2",
        title: "Digital Illustration & Character Design",
        category: "Design",
        description: "Master digital illustration techniques and create stunning character designs using industry tools.",
        instructor: {
            name: "Marcus Johnson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
        rating: 4.8,
        reviews: 89,
        duration: "6 hours",
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    },
    {
        id: "3",
        title: "Photography Fundamentals",
        category: "Photography",
        description: "Understand camera settings, composition, and lighting to take professional-quality photos.",
        instructor: {
            name: "Elena Rodriguez",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        },
        rating: 4.7,
        reviews: 156,
        duration: "5 hours",
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    },
    {
        id: "4",
        title: "Data Science with Python",
        category: "Technology",
        description: "Analyze data, build ML models, and create visualizations using Python and popular libraries.",
        instructor: {
            name: "David Kim",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        },
        rating: 4.9,
        reviews: 203,
        duration: "12 hours",
        level: "Advanced",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    }]
const Dashboard = () => {
    return (
        <div className="dashboard-page">
            <Header />
            <section className="banner-section">
                <h1>Exchange Skills, <span>Grow Together</span></h1>
                <p>Trade Trade what you know for what you want to learn. Join our community of passionate learners and share your expertise.</p>
                <div className="banner-buttons">
                    <a href="/signup" ><button className='swapping-button'>Start Swapping <FaArrowRight className="arrow-icon" /></button></a>
                    <a href="/browse-skills" ><button className='browse-skills-button'>Browse Skills</button></a>
                </div>
            </section>

            <section className="categories-section">
                <div className="container">
                    <div className="head-section">
                        <h2 className="">Explore Categories</h2>
                        <p className="">
                            Discover skills across various categories and find the perfect match for your learning journey.
                        </p>
                    </div>
                    <div className="categories-list">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/browse?category=${category.name}`}
                                className="categories"
                            >
                                <span className="">{category.icon}</span>
                                <h3 className="">
                                    {category.name}
                                </h3>
                                <p className="">{category.count} skills</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

             <section className="skills-section">
                <div className="container">
                    <div className="skills-header">
                    <div className="head-section">
                        <h2 className="">Featured Skills</h2>
                        <p className="">
                        Discover top-rated skills from our community's best teachers.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link to="/browse">
                        View All Skills
                        <FaArrowRight className="" />
                        </Link>
                    </Button>
                    </div>
                    <div className="">
                    {featuredSkills.map((skill) => (
                        <SkillCard key={skill.id} {...skill} />
                    ))}
                    </div>
                </div>
                </section>
        </div>
    )
}

export default Dashboard;