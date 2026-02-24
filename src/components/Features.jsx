import { LayoutGrid, Megaphone, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: LayoutGrid,
        title: 'หมวดหมู่ครอบคลุม',
        text: 'รองรับของหายทุกประเภท ไม่ว่าจะเป็นเอกสารสำคัญ สัตว์เลี้ยง กุญแจรถ หรืออุปกรณ์อิเล็กทรอนิกส์ เราจัดหมวดหมู่ไว้ชัดเจนเพื่อให้คุณค้นหาเจอได้ง่ายที่สุด',
        gradient: 'from-blue-500 to-indigo-600',
    },
    {
        icon: Megaphone,
        title: 'ประกาศง่าย เจอไว',
        text: 'แพลตฟอร์มที่ออกแบบมาให้ใช้งานสะดวก ไม่ซับซ้อน ช่วยให้คุณลงประกาศตามหาของ หรือแจ้งเจอของได้ทันที เพื่อโอกาสในการได้รับของคืนที่รวดเร็วยิ่งขึ้น',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        icon: ShieldCheck,
        title: 'ปลอดภัย เชื่อถือได้',
        text: 'เราให้ความสำคัญกับความปลอดภัยของผู้ใช้งานเป็นหลัก ด้วยระบบยืนยันตัวตน (Verify) และระบบแชทกลาง เพื่อคัดกรองและป้องกันมิจฉาชีพก่อนการนัดรับของ',
        gradient: 'from-emerald-500 to-teal-600',
    },
];

export default function Features() {
    return (
        <section className="bg-navy-dark font-kanit py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        ทำไมต้อง <span className="text-accent">KUEN HAI</span> ?
                    </h2>
                    <p className="text-white/50 text-sm sm:text-base max-w-lg mx-auto">
                        เราออกแบบแพลตฟอร์มเพื่อช่วยคุณค้นหาของที่หายอย่างมีประสิทธิภาพ
                    </p>
                </div>

                {/* Feature Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {features.map((feat, i) => (
                        <div key={i} className="group text-center">
                            {/* Circular Icon */}
                            <div className="relative mx-auto mb-6 w-24 h-24">
                                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${feat.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                                    <feat.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                                </div>
                                {/* Glow effect */}
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${feat.gradient} opacity-30 blur-xl group-hover:opacity-50 transition-opacity`} />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                                {feat.title}
                            </h3>

                            {/* Description */}
                            <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                                {feat.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom Divider / Footer Info */}
                <div className="mt-20 pt-8 border-t border-white/10 text-center">
                    <p className="text-white/30 text-sm">
                        © 2026 KUEN HAI (คืนให้) — แพลตฟอร์มแจ้งของหายและคืนของ
                    </p>
                </div>
            </div>
        </section>
    );
}
