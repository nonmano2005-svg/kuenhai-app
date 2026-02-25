import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, PackageX } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const categoryMap = {
    general: { label: 'ของใช้ทั่วไป', color: 'from-blue-500 to-blue-600' },
    keys: { label: 'กุญแจ', color: 'from-amber-500 to-amber-600' },
    electronics: { label: 'อิเล็กทรอนิกส์', color: 'from-emerald-500 to-emerald-600' },
    pets: { label: 'สัตว์เลี้ยง', color: 'from-pink-500 to-pink-600' },
    documents: { label: 'เอกสาร', color: 'from-purple-500 to-purple-600' },
    settings: { label: 'การตั้งค่า', color: 'from-gray-500 to-gray-600' },
};

export default function CategoryPage() {
    const { type } = useParams();
    const category = categoryMap[type] || { label: type, color: 'from-gray-500 to-gray-600' };

    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'lostItems'),
                    where('category', '==', type)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFilteredItems(data);
            } catch (error) {
                console.error('Error fetching category items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [type]);

    return (
        <div className="min-h-screen bg-gray-50 font-kanit">
            {/* Hero Banner */}
            <div className={`bg-gradient-to-br ${category.color} py-12 sm:py-16`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        กลับหน้าหลัก
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        หมวดหมู่: {category.label}
                    </h1>
                    <p className="text-white/70 mt-2 text-sm sm:text-base">
                        {loading ? 'กำลังโหลด...' : `พบ ${filteredItems.length} รายการในหมวดหมู่นี้`}
                    </p>
                </div>
            </div>

            {/* Items Grid */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500"></div>
                        <span className="mt-4 text-gray-500 text-sm">กำลังโหลดข้อมูล...</span>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredItems.map((item) => (
                            <Link
                                to={`/item/${item.id}`}
                                key={item.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
                            >
                                {/* Item Image */}
                                <div className="h-40 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-800 text-lg group-hover:text-navy transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {item.location}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {item.date}
                                    </div>
                                    <div className="mt-3">
                                        <span
                                            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${item.status === 'พบของ'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <PackageX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-500">ยังไม่มีรายการในหมวดหมู่นี้</h2>
                        <p className="text-gray-400 mt-2 text-sm">ลองกลับมาดูใหม่ภายหลัง</p>
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
