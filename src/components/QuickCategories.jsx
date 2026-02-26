import { Link } from 'react-router-dom';
import categoryConfig, { CATEGORY_TYPES, saveRecentCategory } from '../data/categories';

export default function QuickCategories() {
    const handleClick = (type) => {
        saveRecentCategory(type);
    };

    return (
        <div className="relative z-10 -mt-14 sm:-mt-16 font-kanit">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
                        {CATEGORY_TYPES.map((type) => {
                            const cat = categoryConfig[type];
                            return (
                                <Link
                                    key={type}
                                    to={type === 'settings' ? '/settings' : `/all-items?category=${encodeURIComponent(cat.label)}`}
                                    onClick={() => handleClick(type)}
                                    className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                                >
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-200`}>
                                        <cat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.8} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-navy transition-colors">
                                            {cat.label}
                                        </p>
                                        <p className="text-[10px] text-gray-400 hidden sm:block">{cat.sublabel}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
