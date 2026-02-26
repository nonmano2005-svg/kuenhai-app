import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Phone, MessageCircle, Send, User, Shield, Share2, PackageX, CheckCircle, Bot, Trash2 } from 'lucide-react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import VerificationBadgeCard from '../components/VerificationBadgeCard';

const aiResponses = [
    'รับทราบครับ ระบบกำลังบันทึกข้อมูล...',
    'ขอบคุณสำหรับข้อมูลครับ ผมจะช่วยตามหาให้นะครับ',
    'เข้าใจครับ ขอเวลาตรวจสอบข้อมูลสักครู่นะครับ',
    'ผมได้บันทึกข้อมูลเรียบร้อยแล้วครับ มีอะไรเพิ่มเติมไหมครับ?',
    'ขอบคุณครับ จะแจ้งให้ทราบทันทีเมื่อมีความคืบหน้าครับ',
    'ข้อมูลนี้มีประโยชน์มากครับ ช่วยให้ตามหาได้ง่ายขึ้น',
];

export default function ItemDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posterName, setPosterName] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: 'สวัสดีครับ ผมคือผู้ช่วย KUEN HAI มีอะไรให้ผมช่วยตามหาไหมครับ?', sender: 'ai', time: 'Now' },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    const idCounter = useRef(2);

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

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const getTimeNow = () =>
        new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        const userMsg = {
            id: idCounter.current++,
            text: trimmed,
            sender: 'user',
            time: getTimeNow(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');

        // Simulate AI typing delay (1000–1500ms)
        setIsTyping(true);
        const delay = 1000 + Math.random() * 500;
        setTimeout(() => {
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            const aiMsg = {
                id: idCounter.current++,
                text: randomResponse,
                sender: 'ai',
                time: getTimeNow(),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, delay);
    };

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

                        {/* Map Placeholder */}
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    สถานที่พบ
                                </h3>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://loremflickr.com/600/250/map,bangkok"
                                    alt="Map location"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                                    📍 {item.location || 'ไม่ระบุสถานที่'}
                                </div>
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
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-navy" />
                                ข้อมูลผู้พบ
                            </h3>
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.finderImage || 'https://ui-avatars.com/api/?name=User&background=0D1B2A&color=fff&size=100'}
                                    alt={item.finderName || 'ผู้พบ'}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-navy/20"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{posterName || item.finderName || 'ผู้ใช้ไม่ระบุชื่อ'}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">ผู้พบของ • ยืนยันตัวตนแล้ว ✓</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-5">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-navy hover:bg-navy-dark text-white py-3 rounded-xl font-medium text-sm transition-colors shadow-md hover:shadow-lg">
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

                            {/* Verification Status */}
                            <VerificationBadgeCard
                                emailVerified={true}
                                phoneVerified={true}
                                idVerified={true}
                                trustScore={100}
                            />
                        </div>

                        {/* Chat Section */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="bg-navy px-5 py-3.5">
                                <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                                    <MessageCircle className="w-4 h-4 text-accent" />
                                    แชทกับผู้พบ
                                </h3>
                            </div>

                            {/* Messages */}
                            <div className="p-4 space-y-3 max-h-80 overflow-y-auto bg-gray-50/50 scroll-smooth">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.sender === 'ai' && (
                                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-navy" />
                                            </div>
                                        )}
                                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 transition-all duration-200 ${msg.sender === 'user'
                                            ? 'bg-navy text-white rounded-br-md'
                                            : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-md'
                                            }`}
                                        >
                                            <p className={`text-[11px] font-semibold mb-0.5 ${msg.sender === 'user' ? 'text-accent' : 'text-navy'
                                                }`}>
                                                {msg.sender === 'user' ? 'คุณ' : 'KUEN HAI Bot'}
                                            </p>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/50' : 'text-gray-400'
                                                }`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex items-end gap-2 justify-start">
                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-navy" />
                                        </div>
                                        <div className="bg-white text-gray-400 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Auto-scroll anchor */}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="พิมพ์ข้อความ..."
                                        className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 transition-shadow"
                                        disabled={isTyping}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTyping || !inputValue.trim()}
                                        className="bg-navy hover:bg-navy-dark text-white p-2.5 rounded-full transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
