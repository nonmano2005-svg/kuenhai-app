import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import items from '../data/mockItems';

const recentAnnouncements = items.slice(0, 5);

export default function Announcements() {
    return (
        <section className="bg-navy font-kanit pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">ประกาศล่าสุด</h2>
                        <p className="text-white/50 text-sm mt-1">Latest Announcements</p>
                    </div>
                    <Link to="/all-items" className="group flex items-center gap-1 text-accent hover:text-yellow-300 text-sm font-medium transition-colors">
                        ดูทั้งหมด
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {recentAnnouncements.map((card) => (
                        <Link
                            to={`/item/${card.id}`}
                            key={card.id}
                            className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-accent/50 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                        >
                            {/* Card Image */}
                            <div className="h-32 relative overflow-hidden">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className="bg-accent/90 text-navy-dark text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                        {card.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4">
                                <h3 className="text-white font-medium text-sm mb-2 group-hover:text-accent transition-colors line-clamp-1">
                                    {card.title}
                                </h3>
                                <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="line-clamp-1">{card.location}</span>
                                </div>
                                <div className="flex items-center gap-1 text-white/30 text-xs">
                                    <Clock className="w-3 h-3" />
                                    <span>{card.date}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
