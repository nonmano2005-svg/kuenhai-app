import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, SearchX } from 'lucide-react';
import items, { TAG_COLORS } from '../data/mockItems';

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';

    const results = query
        ? items.filter((item) => {
            const matchesTitle = item.title.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = category === 'all' || item.category === category;
            return matchesTitle && matchesCategory;
        })
        : [];

    return (
        <div className="min-h-screen bg-gray-50 font-kanit">
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-navy to-navy-dark py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        กลับหน้าหลัก
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        ผลการค้นหา: "{query}"
                    </h1>
                    <p className="text-white/60 mt-2 text-sm sm:text-base">
                        พบ {results.length} รายการ
                    </p>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {results.map((item) => (
                            <Link
                                to={`/item/${item.id}`}
                                key={item.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
                            >
                                {/* Item Image */}
                                <div className="h-44 overflow-hidden relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[item.tag] || 'bg-gray-100 text-gray-700'}`}>
                                            {item.tag}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${item.status === 'พบของ' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-800 text-lg group-hover:text-navy transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                        {item.location}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                        {item.date}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* No Results State */
                    <div className="text-center py-20">
                        <SearchX className="w-20 h-20 text-gray-300 mx-auto mb-5" />
                        <h2 className="text-2xl font-semibold text-gray-500">
                            ไม่พบผลลัพธ์สำหรับ "{query}"
                        </h2>
                        <p className="text-gray-400 mt-3 text-sm max-w-md mx-auto">
                            ลองค้นหาด้วยคำอื่น เช่น "กระเป๋า", "กุญแจ", "โทรศัพท์", "แมว"
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-dark text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl mt-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            กลับหน้าหลัก
                        </Link>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="mt-10 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-dark text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            กลับหน้าหลัก
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
