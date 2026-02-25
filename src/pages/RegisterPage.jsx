import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { User, Mail, Lock, Phone, UserPlus, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '', // ใช้เป็นไอดีสมมติเพื่อเลี่ยงระบบ OTP SMS ที่โควต้าน้อย
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('รหัสผ่านไม่ตรงกันครับ');
            return;
        }

        setIsLoading(true);
        try {
            // 1. สร้างบัญชีในระบบ Auth (ใช้อีเมลเป็น ID)
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. บันทึกข้อมูล ชื่อ + เบอร์โทร ลงระบบกลาง (Firestore)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                createdAt: serverTimestamp()
            });

            alert('สมัครสมาชิกสำเร็จ! ข้อมูลเบอร์โทรเข้าระบบกลางเรียบร้อยครับ');
            navigate('/login');
        } catch (error) {
            console.error(error);
            setErrorMsg('เกิดข้อผิดพลาด: ตรวจสอบการตั้งค่า API ใน Vercel หรืออีเมลซ้ำครับ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2D3142] flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="bg-yellow-400 text-gray-900 text-xl font-black py-2 px-6 rounded-xl inline-block mb-4">KUEN HAI</div>
                    <h2 className="text-2xl font-bold text-gray-800">สร้างบัญชีผู้ใช้ใหม่</h2>
                </div>

                {errorMsg && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center border border-red-100">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="text" name="name" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400" placeholder="สมชาย ใจดี" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">เบอร์โทรศัพท์ (สำคัญมาก)</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="tel" name="phone" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400" placeholder="08x-xxx-xxxx" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ไอดี/อีเมล (เช่น non@test.com)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="email" name="email" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400" placeholder="ใช้เมลอะไรก็ได้ครับ" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">รหัสผ่าน</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="password" name="password" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400" placeholder="••••••" />
                        </div>
                    </div>

                    <div className="pb-2">
                        <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-400" placeholder="ยืนยันรหัสผ่านอีกครั้ง" />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                        ยืนยันการสมัครสมาชิก
                    </button>
                </form>
            </div>
        </div>
    );
}