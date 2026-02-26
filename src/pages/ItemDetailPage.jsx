import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Phone, MessageCircle, Shield, Share2, PackageX, Trash2 } from 'lucide-react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// แก้ไข default icon ของ Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});


export default function ItemDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posterName, setPosterName] = useState('');

    // Fetch item from Firestore
    useEffect(() => {
        const fetchItem = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'lostItems', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setItem({ id: docSnap.id, ...data });

                    // ดึงชื่อผู้โพสต์จาก users collection
                    if (data.userId) {
                        try {
                            const userDocRef = doc(db, 'users', data.userId);
                            const userDocSnap = await getDoc(userDocRef);
                            if (userDocSnap.exists()) {
                                const userData = userDocSnap.data();
                                setPosterName(userData.displayName || userData.name || 'ผู้ใช้ไม่ระบุชื่อ');
                            } else {
                                setPosterName('ผู้ใช้ไม่ระบุชื่อ');
                            }
                        } catch (err) {
                            console.error('Error fetching poster info:', err);
                            setPosterName('ผู้ใช้ไม่ระบุชื่อ');
                        }
                    } else {
                        setPosterName(data.finderName || 'ผู้ใช้ไม่ระบุชื่อ');
                    }
                } else {
                    setItem(null);
                }
            } catch (error) {
                console.error('Error fetching item:', error);
                setItem(null);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);


    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 font-kanit flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-navy mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (!item) {
        return (
            <div className="min-h-screen bg-gray-50 font-kanit flex items-center justify-center">
                <div className="text-center">
                    <PackageX className="w-20 h-20 text-gray-300 mx-auto mb-5" />
                    <h2 className="text-2xl font-semibold text-gray-500">ไม่พบรายการนี้</h2>
                    <p className="text-gray-400 mt-2 text-sm">รายการที่คุณกำลังค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-navy hover:bg-navy-dark text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl mt-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-kanit">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-navy text-sm transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            กลับหน้าหลัก
                        </Link>
                        <button className="inline-flex items-center gap-1.5 text-gray-500 hover:text-navy text-sm transition-colors">
                            <Share2 className="w-4 h-4" />
                            แชร์
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            <img
                                src={item.image ? item.image.replace('400/300', '800/600') : 'https://via.placeholder.com/800x600?text=No+Image'}
                                alt={item.name || 'รายการ'}
                                className="w-full h-72 sm:h-96 object-cover"
                            />
                        </div>

                        {/* Map Section */}
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    สถานที่พบ
                                </h3>
                            </div>
                            <div className="relative rounded-b-2xl overflow-hidden" style={{ height: '224px' }}>
                                {item.pinLocation ? (
                                    <MapContainer
                                        center={[item.pinLocation.lat, item.pinLocation.lng]}
                                        zoom={15}
                                        scrollWheelZoom={false}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[item.pinLocation.lat, item.pinLocation.lng]} />
                                    </MapContainer>
                                ) : (
                                    <iframe
                                        title="Google Map"
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(item.location || 'Thailand')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                        className="w-full h-full border-0"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details & Chat */}
                    <div className="space-y-5">
                        {/* Item Info Card */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                    {item.name || 'ไม่ระบุชื่อ'}
                                </h1>
                                <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${(item.status === 'พบของ') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.status || 'ยังไม่พบเจ้าของ'}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-5">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {item.date || 'ไม่ระบุวันที่'}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {item.time || 'ไม่ระบุเวลา'}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {item.location || 'ไม่ระบุสถานที่'}
                                </div>
                            </div>

                            <div className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-4">
                                {item.tag || item.category || 'ทั่วไป'}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                {item.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                            </p>
                        </div>

                        {/* Finder Profile */}
                        <div className="bg-slate-50 rounded-2xl shadow-md border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-navy" />
                                ข้อมูลผู้แจ้ง
                            </h3>

                            {/* Avatar + Name */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.reporterImage || item.finderImage || 'https://ui-avatars.com/api/?name=User&background=0D1B2A&color=fff&size=100'}
                                    alt={posterName || item.finderName || 'ผู้แจ้ง'}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-navy/20 shadow-sm"
                                />
                                <div className="flex-1">
                                    <p className="text-xl font-bold text-gray-800">{item.reporterName || posterName || item.finderName || 'ผู้ใช้ไม่ระบุชื่อ'}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">ผู้แจ้งของหาย • ยืนยันตัวตนแล้ว ✓</p>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="mt-5 pt-5 border-t border-gray-200 space-y-4">
                                <a
                                    href={item.contactPhone ? `tel:${item.contactPhone}` : '#'}
                                    onClick={(e) => { if (!item.contactPhone) { e.preventDefault(); alert('ไม่พบเบอร์โทรศัพท์ติดต่อ'); } }}
                                    className="flex items-center gap-3 text-sm p-3 -mx-3 rounded-xl hover:bg-green-50 transition-colors cursor-pointer group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                                        <Phone className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-400 text-xs">เบอร์โทรติดต่อ</p>
                                        <p className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">{item.contactPhone || '-'}</p>
                                    </div>
                                    {item.contactPhone && (
                                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full group-hover:bg-green-100">กดโทร</span>
                                    )}
                                </a>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">ช่องทางอื่นๆ</p>
                                        <p className="font-medium text-gray-800">{item.otherContact || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">สถานที่นัดรับของ</p>
                                        <p className="font-medium text-gray-800">{item.meetingLocation || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => {
                                        if (item.contactPhone) {
                                            window.location.href = `tel:${item.contactPhone}`;
                                        } else {
                                            alert('ไม่พบเบอร์โทรศัพท์ติดต่อ');
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-navy hover:bg-navy-dark text-white py-3 rounded-xl font-medium text-sm transition-colors shadow-md hover:shadow-lg"
                                >
                                    <Phone className="w-4 h-4" />
                                    ติดต่อผู้พบ
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-navy-dark py-3 rounded-xl font-medium text-sm transition-colors shadow-md hover:shadow-lg">
                                    <MessageCircle className="w-4 h-4" />
                                    แจ้งเป็นเจ้าของ
                                </button>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={async () => {
                                    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?')) {
                                        try {
                                            await deleteDoc(doc(db, 'lostItems', id));
                                            alert('ลบประกาศเรียบร้อยแล้ว');
                                            navigate('/');
                                        } catch (error) {
                                            console.error('Error deleting item:', error);
                                            alert('เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่');
                                        }
                                    }
                                }}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 mt-4 transition-colors shadow-md hover:shadow-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                                ลบประกาศนี้
                            </button>


                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}
