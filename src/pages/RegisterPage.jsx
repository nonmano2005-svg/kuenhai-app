import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Phone, Lock, User, Loader2, KeyRound } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [step, setStep] = useState(1); // 1: กรอกเบอร์, 2: กรอก OTP
    const [isLoading, setIsLoading] = useState(false);

    // ตั้งค่าตัวป้องกันสแปม (reCAPTCHA)
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible'
            });
        }
    };

    // ขั้นตอนที่ 1: ส่ง SMS
    const onSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const formatPhone = '+' + phone.replace(/\D/g, ''); // ต้องเป็นฟอร์แมต +668xxxx

        try {
            const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
            setConfirmationResult(confirmation);
            setStep(2);
            alert('ส่งรหัส OTP ไปที่มือถือแล้วครับ!');
        } catch (error) {
            console.error(error);
            alert('ส่งไม่สำเร็จ: เช็คโควต้า 10 ครั้งต่อวัน หรือ API Key ใน Vercel ครับ');
        } finally {
            setIsLoading(false);
        }
    };

    // ขั้นตอนที่ 2: ยืนยัน OTP และบันทึกลง Firestore
    const onOTPVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await confirmationResult.confirm(otp);
            const user = result.user;

            // บันทึกข้อมูลเข้าฐานข้อมูลกลาง
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name,
                phone: phone,
                createdAt: serverTimestamp()
            });

            alert('ยืนยันตัวตนสำเร็จ! ข้อมูลเข้าระบบแล้ว');
            navigate('/login');
        } catch (error) {
            alert('รหัส OTP ไม่ถูกต้องครับ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2D3142] flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
                <div className="bg-yellow-400 text-gray-900 font-black py-2 px-6 rounded-xl inline-block mb-6">KUEN HAI</div>
                <div id="recaptcha-container"></div>

                {step === 1 ? (
                    <form onSubmit={onSignup} className="space-y-4 text-left">
                        <h2 className="text-xl font-bold mb-4">สมัครด้วยเบอร์โทรศัพท์</h2>
                        <input type="text" placeholder="ชื่อ-นามสกุล" required onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-xl outline-none" />
                        <input type="tel" placeholder="66812345678 (ใส่ 66 แทนเลข 0)" required onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border rounded-xl outline-none" />
                        <button type="submit" className="w-full bg-yellow-500 text-white font-bold py-3 rounded-xl">ส่งรหัส OTP</button>
                    </form>
                ) : (
                    <form onSubmit={onOTPVerify} className="space-y-4 text-left">
                        <h2 className="text-xl font-bold mb-4">กรอกรหัส 6 หลักจาก SMS</h2>
                        <input type="text" placeholder="รหัส OTP" required onChange={(e) => setOtp(e.target.value)} className="w-full p-3 border rounded-xl outline-none text-center text-2xl tracking-widest" />
                        <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-xl">ยืนยันรหัส</button>
                    </form>
                )}
            </div>
        </div>
    );
}