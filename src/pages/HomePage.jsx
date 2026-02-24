import HeroSection from '../components/HeroSection';
import QuickCategories from '../components/QuickCategories';
import Announcements from '../components/Announcements';
import RecentlyViewed from '../components/RecentlyViewed';
import Features from '../components/Features';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <QuickCategories />
            <Announcements />
            <RecentlyViewed />
            <Features />
        </>
    );
}
