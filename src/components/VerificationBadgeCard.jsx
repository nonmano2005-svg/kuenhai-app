import { Link } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

function getTrustLabel(score) {
    if (score >= 80) return { text: 'สูงมาก', color: 'text-green-700' };
    if (score >= 40) return { text: 'ปานกลาง', color: 'text-yellow-700' };
    return { text: 'ต่ำ', color: 'text-red-600' };
}

export default function VerificationBadgeCard({
    emailVerified = false,
    phoneVerified = false,
    idVerified = false,
    trustScore = 0,
}) {
    const label = getTrustLabel(trustScore);

    const items = [
        { name: 'บัตรประชาชน', verified: idVerified },
        { name: 'เบอร์โทรศัพท์', verified: phoneVerified },
        { name: 'อีเมล', verified: emailVerified },
    ];

    // Dynamic border/bg based on score
    const cardBorder = trustScore >= 40 ? 'border-green-200' : 'border-gray-200';
    const cardBg = trustScore >= 40 ? 'bg-green-50' : 'bg-gray-50';
    const barFrom = trustScore >= 80 ? 'from-green-500' : trustScore >= 40 ? 'from-yellow-400' : 'from-red-400';
    const barTo = trustScore >= 80 ? 'to-emerald-500' : trustScore >= 40 ? 'to-yellow-500' : 'to-red-500';

    return (
        <div className={`mt-5 ${cardBg} border ${cardBorder} rounded-xl p-4`}>
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-navy" />
                สถานะการยืนยันตัวตน
            </h4>

            <div className="space-y-2.5">
                {items.map((item) => (
                    <div className="flex items-center gap-2.5" key={item.name}>
                        {item.verified ? (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${item.verified ? 'text-green-800' : 'text-gray-500'}`}>
                            {item.name}
                        </span>
                        <span
                            className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.verified
                                    ? 'text-green-600 bg-green-100'
                                    : 'text-gray-400 bg-gray-200'
                                }`}
                        >
                            {item.verified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Trust Score */}
            <div className="mt-4 pt-3 border-t border-green-200/60">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-700">คะแนนความน่าเชื่อถือ</span>
                    <span className={`text-xs font-bold ${label.color}`}>
                        {trustScore}% — {label.text}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`bg-gradient-to-r ${barFrom} ${barTo} h-2.5 rounded-full transition-all duration-700`}
                        style={{ width: `${trustScore}%` }}
                    />
                </div>
            </div>

            {/* Link to verification page */}
            <Link
                to="/verification"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-navy-dark py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm hover:shadow-md"
            >
                ไปหน้ายืนยันตัวตน
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
