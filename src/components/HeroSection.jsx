import { Search, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section
            className="relative overflow-hidden font-kanit"
            style={{
                backgroundImage: `url("/bgicon.png")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/25" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 sm:pt-20 sm:pb-32 text-center">
                {/* Main Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    ของหาย{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10">เราช่วยคืน</span>
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-accent/40 -z-0 rounded" />
                    </span>
                </h1>

                <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-10">
                    แพลตฟอร์มแจ้งของหายและคืนของให้
                </p>

                {/* Feature badges */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <Link to="/all-items" className="group flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer border border-white/20">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-accent transition-colors">
                            <Search className="w-5 h-5 text-white group-hover:text-navy transition-colors" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-white text-sm">ตามหาของ</p>
                            <p className="text-xs text-white/60">Find Lost Item</p>
                        </div>
                    </Link>

                    <Link to="/report" className="group flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer border border-white/20">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-accent transition-colors">
                            <Megaphone className="w-5 h-5 text-white group-hover:text-navy transition-colors" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-white text-sm">แจ้งของหาย</p>
                            <p className="text-xs text-white/60">Report Lost Item</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
