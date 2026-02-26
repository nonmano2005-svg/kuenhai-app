import React, { useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

// Keyword mapping logic
function categorizeByName(name = '') {
    const lower = name.toLowerCase();

    // อุปกรณ์อิเล็กทรอนิกส์
    if (['เมาส์', 'สายชาร์จ', 'หูฟัง', 'โทรศัพท์', 'แท็บเล็ต', 'โน้ตบุ๊ค'].some(kw => lower.includes(kw))) {
        return 'อุปกรณ์อิเล็กทรอนิกส์';
    }

    // ของใช้ทั่วไป (กระเป๋าและของใช้)
    if (['ขวดน้ำ', 'แว่นตา', 'สมุด', 'แหวน', 'ตุ๊กตา', 'เสื้อ', 'กระเป๋า', 'ปากกา'].some(kw => lower.includes(kw))) {
        return 'ของใช้ทั่วไป';
    }

    // กุญแจ
    if (lower.includes('กุญแจ')) {
        return 'กุญแจ';
    }

    // อื่นๆ
    return 'อื่นๆ';
}

export default function CategoryMigration() {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isDone, setIsDone] = useState(false);

    const addLog = (message, type = 'info') => {
        setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString('th-TH') }]);
    };

    const runMigration = async () => {
        if (!window.confirm('⚠️ คุณแน่ใจหรือไม่ว่าต้องการอัปเดต category ของทุกรายการ?')) return;

        setIsRunning(true);
        setLogs([]);
        setIsDone(false);
        addLog('🚀 เริ่มดึงข้อมูลจาก Firestore...');

        try {
            const snapshot = await getDocs(collection(db, 'lostItems'));
            addLog(`📦 พบทั้งหมด ${snapshot.size} รายการ`);

            let updated = 0;
            let skipped = 0;

            for (const docSnap of snapshot.docs) {
                const data = docSnap.data();
                const itemName = data.name || '';
                const newCategory = categorizeByName(itemName);
                const oldCategory = data.category || '(ไม่มี)';

                if (oldCategory === newCategory) {
                    skipped++;
                    continue;
                }

                await updateDoc(doc(db, 'lostItems', docSnap.id), {
                    category: newCategory,
                });

                updated++;
                addLog(`✅ "${itemName}" : ${oldCategory} → ${newCategory}`);
            }

            addLog(`🎉 เสร็จสิ้น! อัปเดต ${updated} รายการ, ข้าม ${skipped} รายการ (category ตรงอยู่แล้ว)`, 'success');
            setIsDone(true);
        } catch (error) {
            console.error('Migration error:', error);
            addLog(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                        Category Migration Tool
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        เครื่องมือสำหรับอัปเดต category ของรายการใน Firestore ตาม keyword ในชื่อ
                    </p>

                    {/* Keyword Mapping Reference */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
                        <p className="font-semibold text-gray-700 mb-2">กฎการจัดหมวดหมู่:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>📱 เมาส์, สายชาร์จ → <span className="font-medium text-emerald-600">อุปกรณ์อิเล็กทรอนิกส์</span></li>
                            <li>📦 ขวดน้ำ, แว่นตา, สมุด, แหวน, ตุ๊กตา, เสื้อ, กระเป๋า, ปากกา → <span className="font-medium text-blue-600">ของใช้ทั่วไป</span></li>
                            <li>🔑 กุญแจ → <span className="font-medium text-amber-600">กุญแจ</span></li>
                            <li>❓ อื่นๆ → <span className="font-medium text-gray-600">อื่นๆ</span></li>
                        </ul>
                    </div>

                    <button
                        onClick={runMigration}
                        disabled={isRunning}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        {isRunning ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> กำลังอัปเดต...</>
                        ) : isDone ? (
                            <><CheckCircle className="w-5 h-5" /> เสร็จสิ้น — กดเพื่อรันอีกครั้ง</>
                        ) : (
                            '🚀 เริ่มอัปเดต Category'
                        )}
                    </button>

                    {/* Logs */}
                    {logs.length > 0 && (
                        <div className="mt-6 bg-gray-900 rounded-xl p-4 max-h-80 overflow-y-auto">
                            {logs.map((log, i) => (
                                <p key={i} className={`text-xs font-mono mb-1 ${log.type === 'error' ? 'text-red-400' :
                                        log.type === 'success' ? 'text-green-400' :
                                            'text-gray-300'
                                    }`}>
                                    <span className="text-gray-500">[{log.time}]</span> {log.message}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
