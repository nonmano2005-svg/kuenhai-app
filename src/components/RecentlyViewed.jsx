import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRecentCategories } from '../data/categories';

export default function RecentlyViewed() {
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        const data = getRecentCategories();
        setRecent(data);
    }, []);

    // Hide section entirely if nothing viewed yet
    if (recent.length === 0) return null;

    return (
        <section className="bg-navy font-kanit pb-16 pt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">หมวดหมู่ที่คุณดูล่าสุด</h2>
                        <p className="text-white/50 text-sm mt-1">Recently Viewed Categories</p>
                    </div>
                    <a href="#" className="group flex items-center gap-1 text-accent hover:text-yellow-300 text-sm font-medium transition-colors">
                        ดูทั้งหมด
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {recent.map((cat) => (
                        <Link
                            key={cat.type}
                            to={`/category/${cat.type}`}
                            className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/50 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:-translate-y-1 text-center"
                        >
                            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 mb-4`}>
                                <cat.icon className="w-8 h-8 text-white" strokeWidth={1.8} />
                            </div>
                            <h3 className="text-white font-medium text-sm mb-1 group-hover:text-accent transition-colors">
                                {cat.label}
                            </h3>
                            <p className="text-white/40 text-xs">{cat.count}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
