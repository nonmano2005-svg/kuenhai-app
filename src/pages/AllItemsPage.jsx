import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Search, Loader2, X } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function AllItemsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category');

    useEffect(() => {
        const fetchAllItems = async () => {
            setLoading(true);
            try {
                let q;
                if (selectedCategory) {
                    q = query(collection(db, 'lostItems'), where('category', '==', selectedCategory));
                } else {
                    q = collection(db, 'lostItems');
                }
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                // เรียงฝั่ง client: ใหม่สุดก่อน
                data.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis?.() || 0;
                    const timeB = b.createdAt?.toMillis?.() || 0;
                    return timeB - timeA;
                });
                setItems(data);
            } catch (error) {
                console.error('Error fetching all items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllItems();
    }, [selectedCategory]);

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
                    <div className="flex items-center gap-3 mb-2">
                        <Search className="w-8 h-8 text-accent" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            {selectedCategory ? `หมวดหมู่: ${selectedCategory}` : 'รายการประกาศทั้งหมด'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <p className="text-white/60 text-sm sm:text-base">
                            พบทั้งหมด {items.length} รายการ
                        </p>
                        {selectedCategory && (
                            <Link
                                to="/all-items"
                                className="inline-flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
                            >
                                <X className="w-3 h-3" />
                                ล้างตัวกรอง
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Items Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-10 h-10 text-navy animate-spin" />
                        <span className="ml-4 text-gray-500 text-sm">กำลังโหลดข้อมูล...</span>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-sm">ยังไม่มีประกาศในขณะนี้</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {items.map((item) => (
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
                )}

                {/* Bottom Back Button */}
                <div className="mt-10 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-dark text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
}
