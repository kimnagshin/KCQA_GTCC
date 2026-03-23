import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    ChevronRight,
    ChevronLeft,
    Users,
    Briefcase,
    Wrench,
    Microscope,
    Heart,
    Shield,
    BookOpen,
    Globe,
    LogIn,
    Menu,
    X,
    Sun,
    Moon,
    AlertCircle,
    User,
    Phone
} from 'lucide-react';
import { CertificateService } from '../services/dataService';
import { isExpired } from '../utils';
import { Certificate } from '../types';
import { KCQA_NAME } from '../constants';

export const Landing: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchError, setSearchError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [foundCerts, setFoundCerts] = useState<Certificate[]>([]);
    const [certIndex, setCertIndex] = useState(0);
    const navigate = useNavigate();

    // Handle theme persistence
    useEffect(() => {
        const savedTheme = localStorage.getItem('kcqa_theme');
        if (savedTheme === 'light') setIsDarkMode(false);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('kcqa_theme', newTheme ? 'dark' : 'light');
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearchError('');

        if (!searchName || !searchPhone) {
            setSearchError('성명과 전화번호를 모두 입력해주세요.');
            return;
        }

        try {
            const certs = await CertificateService.getByNameAndPhone(searchName, searchPhone);

            if (!certs || certs.length === 0) {
                setSearchError('일치하는 자격 정보를 찾을 수 없습니다. 성명과 전화번호를 확인해주세요.');
                return;
            }

            // Optional: Block if all are revoked? For now allow viewing.
            // const valid = certs.some(c => !isExpired(c.expirationDate) && c.status === 'ACTIVE');
            // if (!valid) ...

            setFoundCerts(certs);
            setCertIndex(0);
            setShowModal(true);
        } catch (err: any) {
            setSearchError('오류가 발생했습니다. 나중에 다시 시도해주세요.');
            console.error(err);
        }
    };

    const services = [
        { title: '상담', icon: <Users className="w-8 h-8" />, desc: '모든 상담 관련 과정을 포함한 자격.', bg: isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50' },
        { title: '관리', icon: <Briefcase className="w-8 h-8" />, desc: '자격 기준과 운영 전반을 포함한 관리 자격.', bg: isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-50' },
        { title: '특성화', icon: <Wrench className="w-8 h-8" />, desc: '산업 맞춤 교육과 훈련을 포함한 특성화 자격.', bg: isDarkMode ? 'bg-indigo-900/40' : 'bg-indigo-50' },
        { title: '연구', icon: <Microscope className="w-8 h-8" />, desc: '직무 역량 평가와 연구를 포함한 연구 자격.', bg: isDarkMode ? 'bg-cyan-900/40' : 'bg-cyan-50' },
        { title: '복지', icon: <Heart className="w-8 h-8" />, desc: '전문가 지원과 복지를 포함한 복지 자격.', bg: isDarkMode ? 'bg-rose-900/40' : 'bg-rose-50' },
        { title: '행정', icon: <Shield className="w-8 h-8" />, desc: '자격 검증과 행정 업무를 포함한 행정 자격.', bg: isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50' },
        { title: '교육', icon: <BookOpen className="w-8 h-8" />, desc: '인재 양성과 교육 과정을 포함한 교육 자격.', bg: isDarkMode ? 'bg-teal-900/40' : 'bg-teal-50' },
        { title: '외국어', icon: <Globe className="w-8 h-8" />, desc: '외국어 소통 능력 평가를 포함한 외국어 자격.', bg: isDarkMode ? 'bg-violet-900/40' : 'bg-violet-50' },
    ];

    const themeClasses = isDarkMode
        ? "bg-slate-950 text-slate-200 selection:bg-emerald-500/30"
        : "bg-white text-slate-900 selection:bg-emerald-500/20";

    return (
        <div className={`min-h-screen transition-colors duration-500 font-sans ${themeClasses}`}>

            {/* Theme Toggle Button (Side) */}
            <button
                onClick={toggleTheme}
                className={`fixed right-6 bottom-10 z-[100] p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
                    }`}
                title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-md transition-all duration-300 ${isDarkMode ? 'bg-slate-950/80 border-white/10' : 'bg-white/80 border-slate-200'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="KCQA Logo" className="w-12 h-12 object-contain" />
                            <span className={`text-lg sm:text-xl font-bold tracking-tight font-display ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>KCQA</span>
                        </div>

                        <div className="flex-1 flex justify-center px-2">
                            <div id="google_translate_element" className="flex items-center scale-90 sm:scale-100 origin-center"></div>
                        </div>

                        <div className={`hidden md:flex items-center gap-6 border-l pl-8 ml-8 ${isDarkMode ? 'border-white/10' : 'border-slate-200'
                            }`}>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all transform hover:scale-105 shadow-lg shadow-emerald-600/20 text-sm font-semibold tracking-wide"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>관계자 시스템 접속</span>
                            </Link>
                        </div>

                        <button className={`p-2 shrink-0 ${isDarkMode ? 'text-white' : 'text-slate-950'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className={`md:hidden p-4 space-y-4 border-b animate-in slide-in-from-top duration-300 ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'
                        }`}>
                        <Link to="/login" className="block py-4 px-4 bg-emerald-600 text-white rounded-xl text-center font-bold">
                            KCQAADMIN
                        </Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-full -z-10 transition-opacity duration-1000 ${isDarkMode ? 'opacity-60' : 'opacity-10'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-slate-950 via-slate-950/40 to-emerald-950/20' : 'from-emerald-50 to-white'}`}></div>
                    <img
                        src="/landing_hero.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <div className={`inline-block px-4 py-1.5 mb-8 rounded-full border text-sm font-bold tracking-widest animate-fade-in ${isDarkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        }`}>
                        한국민간자격관리정보서비스
                    </div>
                    <h1 className={`text-5xl lg:text-7xl font-black mb-8 font-display tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Korea Private Qualification  <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600">
                            Management Information Service
                        </span>
                    </h1>
                    <p className={`max-w-3xl mx-auto text-xl mb-12 leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        모든 민간자격을 한곳에서 관리.검색.증명서를 재 발급을 하실수 있습니다 .
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <a href="#checker" className={`group px-10 py-5 rounded-full font-black transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 ${isDarkMode ? 'bg-white text-slate-950 hover:bg-emerald-400 shadow-white/5' : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-200'
                            }`}>
                            민간자격확인
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <button className={`px-10 py-5 border rounded-full font-black transition-all ${isDarkMode ? 'bg-slate-800/40 border-white/10 text-white hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
                            }`}>
                            협회 소개
                        </button>
                    </div>
                </div>
            </section>

            {/* Qualification Checker Section */}
            <section id="checker" className={`py-24 relative transition-colors ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className={`border rounded-[2.5rem] p-8 lg:p-16 shadow-2xl relative overflow-hidden group transition-all ${isDarkMode ? 'bg-slate-950 border-white/10' : 'bg-white border-slate-200'
                        }`}>
                        <div className={`absolute -top-24 -right-24 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 pointer-events-none ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                            <Shield className="w-96 h-96 rotate-12" />
                        </div>

                        <div className="text-center mb-12">
                            <h2 className={`text-4xl font-black mb-4 font-display ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>민간자격확인</h2>
                            <p className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>모든 기관에서 발급된 민간자격의 유효성을 실시간으로 확인하실 수 있습니다.</p>
                        </div>

                        {searchError && (
                            <div className="mb-8 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl animate-shake">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="font-bold text-sm">{searchError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-7 gap-6">
                            <div className="md:col-span-3">
                                <label className={`block text-xs font-bold uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    성명
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="예: 홍길동"
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:outline-none transition-all ${isDarkMode
                                            ? 'bg-slate-800 border-slate-700 text-white focus:ring-emerald-500 placeholder-slate-500'
                                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500 placeholder-slate-400'
                                            } border`}
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <User className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <label className={`block text-xs font-bold uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    전화번호
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        required
                                        placeholder="010-1234-5678"
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:outline-none transition-all ${isDarkMode
                                            ? 'bg-slate-800 border-slate-700 text-white focus:ring-emerald-500 placeholder-slate-500'
                                            : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-blue-500 placeholder-slate-400'
                                            } border`}
                                        value={searchPhone}
                                        onChange={(e) => setSearchPhone(e.target.value)}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <Phone className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-1 flex items-end">
                                <button
                                    type="submit"
                                    className="w-full h-[62px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/20"
                                >
                                    <Search className="w-6 h-6" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-4" id="about-detail">
                            <h4 className="text-emerald-600 font-black tracking-[0.2em] text-sm">검증된 신뢰와 원칙</h4>
                            <h2 className={`text-5xl lg:text-6xl font-black font-display leading-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                                민간자격. <br />
                                관리의 편리성.
                            </h2>
                        </div>

                        <p className={`text-xl leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            KCQA는 모든 기관의 민간자격을 한곳에서 관리할수 있는 편리성을 제공합니다.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className={`p-8 rounded-3xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-200 hover:border-emerald-500/30'
                                }`}>
                                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>개별적 민간자격</h3>
                                <p className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>개인의 민간자격 관리의 편리성을 제공합니다.</p>
                            </div>
                            <div className={`p-8 rounded-3xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-200 hover:border-emerald-500/30'
                                }`}>
                                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>기관별 민간자격</h3>
                                <p className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>기간별 민간자격 관리의 편리성을 제공합니다.</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className={`aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 transition-all duration-700 ${isDarkMode ? 'grayscale' : ''} hover:grayscale-0`}>
                            <img
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
                                alt="Professional Expertise"
                                className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-slate-950/80' : 'from-slate-950/20'} to-transparent`}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className={`py-32 transition-colors ${isDarkMode ? 'bg-slate-900/20' : 'bg-slate-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
                        <div className="space-y-4 max-w-2xl" id="services-detail">
                            <h4 className="text-emerald-600 font-bold tracking-widest text-sm">민간자격구분</h4>
                            <h2 className={`text-4xl lg:text-5xl font-black font-display ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>전문 역량 영역</h2>
                        </div>
                        <p className={`max-w-md text-lg font-medium lg:text-right ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            각 분야별 특성화된 코드로 민간자격을 관리하는 핵심 영역입니다.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, idx) => (
                            <div
                                key={idx}
                                className={`group p-10 rounded-[2.5rem] border backdrop-blur-md transition-all duration-500 cursor-pointer ${isDarkMode
                                    ? 'hover:border-emerald-500/50 hover:bg-emerald-500/5 border-white/5 ' + service.bg
                                    : 'hover:border-emerald-500 bg-white border-slate-200'
                                    }`}
                            >
                                <div className="mb-8 text-emerald-600 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    {service.icon}
                                </div>
                                <h3 className={`text-xl font-black mb-4 font-display tracking-wider uppercase ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>{service.title}</h3>
                                <p className={`leading-relaxed font-bold transition-colors ${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>{service.desc}</p>
                                <div className="mt-8 flex items-center gap-2 text-emerald-600 text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                    더 보기 <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form CTA */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[3.5rem] p-1 shadow-2xl shadow-emerald-600/20">
                    <div className={`rounded-[3.4rem] p-8 lg:p-20 grid lg:grid-cols-2 gap-16 items-center ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
                        <div className="space-y-8">
                            <h2 className={`text-4xl lg:text-5xl font-black font-display ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>자신의 전문성을 입증할 <br />준비가 되셨습니까?</h2>
                            <p className={`text-xl leading-relaxed font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                이미 수천 명의 전문가들이 KCQA를 통해 자신의 가치를 증명했습니다.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="px-10 py-5 bg-emerald-600 text-white rounded-full font-black hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">자격 신청</button>
                                <button className={`px-10 py-5 border rounded-full font-black transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-950 hover:bg-slate-100'
                                    }`}>상담 문의</button>
                            </div>
                        </div>
                        <div className={`border p-8 rounded-[2rem] space-y-4 shadow-sm ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                            <input type="text" placeholder="성명 입력" className={`w-full border rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-slate-950 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-950'
                                }`} />
                            <input type="email" placeholder="이메일 입력" className={`w-full border rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-slate-950 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-950'
                                }`} />
                            <textarea placeholder="문의 내용 입력" rows={4} className={`w-full border rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none ${isDarkMode ? 'bg-slate-950 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-950'
                                }`}></textarea>
                            <button className={`w-full py-4 rounded-xl font-black transition-all ${isDarkMode ? 'bg-white text-slate-950 hover:bg-emerald-400' : 'bg-slate-900 text-white hover:bg-emerald-600'
                                }`}>문의하기</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-24 border-t transition-colors ${isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 lg:col-span-2 space-y-8">
                            <div className="flex items-center gap-3">
                                <img src="/logo.png" alt="KCQA Logo" className="w-12 h-12 object-contain" />
                                <span className={`text-3xl font-black font-display tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>KCQA</span>
                            </div>
                            <p className={`text-lg max-w-sm leading-relaxed font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                혁신적인 글로벌 표준 수립을 통해 민간자격 관리의 미래를 선도합니다.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <h4 className={`text-sm font-black tracking-[0.2em] uppercase ${isDarkMode ? 'text-white' : 'text-slate-400'}`}>바로가기</h4>
                            <ul className={`space-y-4 font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">홈</a></li>
                                <li><Link to="/login" className="hover:text-emerald-600 transition-colors underline decoration-emerald-500/50 underline-offset-8 uppercase">관계자 로그인</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className={`text-sm font-black tracking-[0.2em] uppercase ${isDarkMode ? 'text-white' : 'text-slate-400'}`}>문의처</h4>
                            <ul className={`space-y-4 font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                <li>yjisc@naver.com</li>
                                <li>010-5909-9320</li>
                                <li>길주로270 <br />경기도 부천시</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-black tracking-widest uppercase ${isDarkMode ? 'border-white/5 text-slate-600' : 'border-slate-100 text-slate-400'
                        }`}>
                        <p>© 2025 KOREA CIVIL QUALIFICATION ASSOCIATION</p>
                        <div className="flex gap-12">
                            <a href="#" className="hover:text-emerald-600 transition-colors">개인정보처리방침</a>
                            <a href="#" className="hover:text-emerald-600 transition-colors">이용약관</a>
                        </div>
                    </div>
                </div>
            </footer>
            {/* Data Protection/Personal Info Modal */}
            {showModal && foundCerts.length > 0 && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
                    <div className={`relative w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-3xl shadow-2xl transition-all transform animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
                        <div className={`shrink-0 h-2 ${isDarkMode ? 'bg-emerald-500' : 'bg-blue-600'}`}></div>
                        <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden">
                            <div className="shrink-0 flex justify-between items-start mb-6">
                                <div>
                                    <h3 className={`text-2xl font-black font-display ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>자격 결과</h3>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            자격 정보 확인됨
                                        </p>
                                        {foundCerts.length > 1 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-blue-600'}`}>
                                                {certIndex + 1}/{foundCerts.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                                <div className="flex flex-col items-center relative">
                                    {/* Navigation Arrows */}
                                    {foundCerts.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCertIndex(prev => (prev - 1 + foundCerts.length) % foundCerts.length)}
                                                className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-gray-100 text-slate-900 shadow-lg'}`}
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setCertIndex(prev => (prev + 1) % foundCerts.length)}
                                                className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full z-10 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-gray-100 text-slate-900 shadow-lg'}`}
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}

                                    <div className={`w-52 h-64 md:w-64 md:h-72 rounded-2xl overflow-hidden mb-4 shadow-xl border-4 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}>
                                        {foundCerts[certIndex].photoUrl ? (
                                            <img src={foundCerts[certIndex].photoUrl} alt={foundCerts[certIndex].name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                <Users className={`w-24 h-24 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className={`text-xl font-black uppercase text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{foundCerts[certIndex].name}</h4>
                                </div>

                                <div className="space-y-3 pb-4">
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>KCQA 등록번호</p>
                                        <p className={`text-base font-black font-mono ${isDarkMode ? 'text-emerald-400' : 'text-blue-600'}`}>{foundCerts[certIndex].kcqaNumber}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>민간자격 등록번호</p>
                                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{foundCerts[certIndex].ncqaNumber}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>자격 종목</p>
                                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{foundCerts[certIndex].qualificationType}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>발급일자</p>
                                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{foundCerts[certIndex].issueDate}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>교육 과정</p>
                                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{foundCerts[certIndex].eduDept}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>발급 기관</p>
                                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{foundCerts[certIndex].issuingOffice}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>발급 국가</p>
                                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{foundCerts[certIndex].issuingCountry}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>유효기간</p>
                                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{foundCerts[certIndex].expirationDate || 'N/A'}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                        <p className={`text-[10px] uppercase font-black mb-0.5 cursor-default ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>검증 기관</p>
                                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{KCQA_NAME}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 pt-6">
                                <button
                                    onClick={() => navigate(`/guest/view/${foundCerts[certIndex].id}`)}
                                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl ${isDarkMode
                                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                                        }`}
                                >
                                    증서 보기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
