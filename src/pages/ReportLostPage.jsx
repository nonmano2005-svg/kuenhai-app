import React, { useState } from 'react';
import { Upload, MapPin, Calendar, Tag, Bell, Loader2 } from 'lucide-react';
import { db } from '../firebase'; // 👈 ดึงฐานข้อมูลมาใช้
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // 👈 เครื่องมือส่งข้อมูล

export default function ReportLostPage() {
    const [formData, setFormData] = useState({
        name: '', category: '', description: '', location: '', date: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [reportedItems, setReportedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // สถานะปุ่มหมุนๆ ตอนกดส่ง

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🛠️ เทคนิคบีบอัดรูปภาพอัตโนมัติ ไม่ให้เกิน 1MB
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    // ย่อขนาดให้ความกว้างเหลือแค่ 600px (ขนาดกำลังดีและไฟล์เล็กมาก)
                    const MAX_WIDTH = 600;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // แปลงเป็นโค้ด Base64 คุณภาพ 60%
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    setImagePreview(compressedBase64);
                };
            };
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. ส่งข้อมูลทั้งหมด (รวมถึงรูปที่แปลงเป็นโค้ดแล้ว) ไปเก็บในฐานข้อมูล Firestore
            const docRef = await addDoc(collection(db, 'lostItems'), {
                ...formData,
                image: imagePreview || 'https://via.placeholder.com/300x200?text=No+Image',
                createdAt: serverTimestamp() // เก็บเวลาที่แจ้งด้วย
            });

            // 2. เอามาโชว์ด้านล่างแบบ Real-time
            const newItem = {
                id: docRef.id,
                ...formData,
                image: imagePreview || 'https://via.placeholder.com/300x200?text=No+Image'
            };
            setReportedItems([newItem, ...reportedItems]);

            // 3. ล้างฟอร์ม
            setFormData({ name: '', category: '', description: '', location: '', date: '' });
            setImagePreview(null);
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">อัปโหลดรูปภาพ (ขนาดไม่เกิน 5MB)</label>
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