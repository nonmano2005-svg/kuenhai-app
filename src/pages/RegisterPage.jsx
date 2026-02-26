import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Phone, Lock, Loader2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            // บันทึกข้อมูลเข้า Firestore ตรงๆ (เลี่ยงปัญหา API Key ของระบบ Auth)
            await addDoc(collection(db, 'users'), {
                name: formData.name,
                phone: formData.phone,
                password: formData.password,
                createdAt: serverTimestamp()
            });

            alert('สมัครสมาชิกสำเร็จ! ข้อมูลเบอร์โทรเข้าระบบกลางเรียบร้อย');
            navigate('/login');
        } catch (error) {
            console.error("Firestore Error:", error);
            setErrorMsg('สมัครไม่ได้: เช็ค Rules ใน Firebase ให้เป็น true ครับ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2D3142] flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="bg-yellow-400 text-gray-900 text-xl font-black py-2 px-6 rounded-xl inline-block mb-2">KUEN HAI</div>
                    <h2 className="text-2xl font-bold text-gray-800">สมัครสมาชิก (ใช้เบอร์โทร)</h2>
                </div>

                {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center border border-red-100">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="text" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400" placeholder="ชื่อของคุณ" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="tel" required onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400" placeholder="08x-xxx-xxxx" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">กำหนดรหัสผ่าน</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400" placeholder="••••••" />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors mt-4">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                        ยืนยันการสมัคร
                    </button>
                </form>
            </div>
        </div>
    );
}