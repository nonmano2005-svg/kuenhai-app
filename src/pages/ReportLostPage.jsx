import React, { useState } from 'react';
import { Upload, MapPin, Calendar, Tag, Bell, Loader2, Phone, MessageSquare, Handshake, UserCircle } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ReportLostPage() {
    const [formData, setFormData] = useState({
        name: '', category: '', description: '', location: '', date: '',
        contactPhone: '', otherContact: '', meetingLocation: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [reporterImagePreview, setReporterImagePreview] = useState(null);
    const [reportedItems, setReportedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // บีบอัดรูปภาพอัตโนมัติ (ใช้ร่วมกันทั้ง 2 ช่อง)
    const compressImage = (file, maxWidth, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleSize = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                callback(compressedBase64);
            };
        };
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) compressImage(file, 600, setImagePreview);
    };

    const handleReporterImageChange = (e) => {
        const file = e.target.files[0];
        if (file) compressImage(file, 300, setReporterImagePreview);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const docRef = await addDoc(collection(db, 'lostItems'), {
                ...formData,
                image: imagePreview || 'https://via.placeholder.com/300x200?text=No+Image',
                reporterImage: reporterImagePreview || null,
                userId: auth.currentUser ? auth.currentUser.uid : null,
                createdAt: serverTimestamp()
            });

            const newItem = {
                id: docRef.id,
                ...formData,
                image: imagePreview || 'https://via.placeholder.com/300x200?text=No+Image'
            };
            setReportedItems([newItem, ...reportedItems]);

            // ล้างฟอร์ม
            setFormData({ name: '', category: '', description: '', location: '', date: '', contactPhone: '', otherContact: '', meetingLocation: '' });
            setImagePreview(null);
            setReporterImagePreview(null);
            alert('✅ แจ้งรายการสิ่งของหาย และบันทึกลงฐานข้อมูลสำเร็จ!');
        } catch (error) {
            console.error('Error:', error);
            alert('❌ เกิดข้อผิดพลาด: รบกวนตรวจสอบว่าเปิด Firestore เป็น Test Mode หรือยังครับ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-[#2D3142] py-4">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <p className="text-sm">กรอกรายละเอียดสิ่งของที่หาย เพื่อให้ผู้พบสามารถติดต่อกลับได้</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* ===== ส่วนที่ 1: ข้อมูลสิ่งของ ===== */}
                        <div className="pb-2 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-yellow-500" />
                                ข้อมูลสิ่งของ
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อสิ่งของ <span className="text-red-500">*</span></label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="เช่น กระเป๋าสตางค์สีน้ำตาล"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">หมวดหมู่ <span className="text-red-500">*</span></label>
                            <select name="category" required value={formData.category} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-white">
                                <option value="">เลือกหมวดหมู่</option>
                                <option value="กระเป๋า">กระเป๋า</option>
                                <option value="อุปกรณ์อิเล็กทรอนิกส์">อุปกรณ์อิเล็กทรอนิกส์</option>
                                <option value="เอกสารสำคัญ">เอกสารสำคัญ</option>
                                <option value="กุญแจ">กุญแจ</option>
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">รายละเอียด <span className="text-red-500">*</span></label>
                            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                                placeholder="อธิบายลักษณะสิ่งของ..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">สถานที่ที่หาย <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="text" name="location" required value={formData.location} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                        placeholder="เช่น โรงอาหาร"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">วันที่หาย <span className="text-red-500">*</span></label>
                                <input type="date" name="date" required value={formData.date} onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">อัปโหลดรูปภาพสิ่งของ (ขนาดไม่เกิน 5MB)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition relative">
                                <div className="space-y-1 text-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 object-contain rounded" />
                                    ) : (
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    )}
                                    <div className="flex justify-center text-sm text-gray-600 mt-2">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                            <span>คลิกเพื่อเลือกไฟล์</span>
                                            <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== ส่วนที่ 2: ข้อมูลผู้แจ้ง ===== */}
                        <div className="pb-2 border-b border-gray-100 pt-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <UserCircle className="w-5 h-5 text-blue-500" />
                                ข้อมูลผู้แจ้ง / ช่องทางติดต่อ
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">เพื่อให้ผู้พบสามารถติดต่อนัดรับของคืนได้สะดวก</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">เบอร์โทรติดต่อ <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                        placeholder="0812345678"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ช่องทางติดต่ออื่นๆ</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="text" name="otherContact" value={formData.otherContact} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                        placeholder="Line ID, Facebook Link ฯลฯ"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">สถานที่นัดรับของ</label>
                            <div className="relative">
                                <Handshake className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input type="text" name="meetingLocation" value={formData.meetingLocation} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                    placeholder="เช่น ล็อบบี้ตึก A, หน้าเซเว่น ฯลฯ"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">รูปโปรไฟล์ผู้แจ้ง</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-200 border-dashed rounded-xl hover:bg-blue-50/50 transition relative">
                                <div className="space-y-1 text-center">
                                    {reporterImagePreview ? (
                                        <img src={reporterImagePreview} alt="Reporter" className="mx-auto h-24 w-24 object-cover rounded-full border-2 border-blue-300" />
                                    ) : (
                                        <UserCircle className="mx-auto h-12 w-12 text-blue-300" />
                                    )}
                                    <div className="flex justify-center text-sm text-gray-600 mt-2">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                            <span>อัปโหลดรูปโปรไฟล์</span>
                                            <input type="file" className="sr-only" accept="image/*" onChange={handleReporterImageChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-400">เพื่อให้ผู้พบสามารถยืนยันตัวตนคุณได้</p>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full bg-[#2D3142] hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:bg-gray-400">
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bell className="h-5 w-5" />}
                            {isLoading ? 'กำลังบันทึกข้อมูล...' : 'แจ้งสิ่งของหาย'}
                        </button>
                    </form>
                </div>

                {/* ส่วนแสดงรายการด้านล่าง */}
                {reportedItems.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Tag className="text-yellow-500" /> รายการที่เพิ่งแจ้งเข้ามา
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reportedItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-48 w-full bg-gray-200 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-5">
                                        <div className="text-xs font-bold text-yellow-600 bg-yellow-50 inline-block px-2 py-1 rounded-md mb-2">
                                            {item.category}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                        <div className="flex flex-col gap-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-red-400" />
                                                <span className="truncate">{item.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-blue-400" />
                                                <span>{item.date}</span>
                                            </div>
                                            {item.contactPhone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-green-400" />
                                                    <span>{item.contactPhone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}