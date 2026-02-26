import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, SearchX, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndFilter = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, 'lostItems'));
                const allItems = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // กรองผลลัพธ์ฝั่ง client ตามชื่อและหมวดหมู่
                const filtered = query
                    ? allItems.filter((item) => {
                        const name = (item.name || '').toLowerCase();
                        const description = (item.description || '').toLowerCase();
                        const location = (item.location || '').toLowerCase();
                        const q = query.toLowerCase();
                        const matchesText = name.includes(q) || description.includes(q) || location.includes(q);
                        const matchesCategory = category === 'all' || item.category === category;
                        return matchesText && matchesCategory;
                    })
                    : [];

                setResults(filtered);
            } catch (error) {
                console.error('Error fetching items for search:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilter();
    }, [query, category]);

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
                        {loading ? 'กำลังค้นหา...' : `พบ ${results.length} รายการ`}
                    </p>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-10 h-10 text-navy animate-spin" />
                        <span className="ml-4 text-gray-500 text-sm">กำลังค้นหา...</span>
                    </div>
                ) : results.length > 0 ? (
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
                                        src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={item.name || 'รายการ'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                                            {item.tag || item.category || 'ทั่วไป'}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${item.status === 'พบของ' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                            {item.status || 'ยังไม่พบเจ้าของ'}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-800 text-lg group-hover:text-navy transition-colors">
                                        {item.name || 'ไม่ระบุชื่อ'}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                        {item.location || 'ไม่ระบุสถานที่'}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                        {item.date || 'ไม่ระบุวันที่'}
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
                            ลองค้นหาด้วยคำอื่น เช่น "กระเป๋า", "กุญแจ", "โทรศัพท์"
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
