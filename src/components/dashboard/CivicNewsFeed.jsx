import React, { useState, useEffect } from 'react';
import { Radio, Loader2, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const TRANSLATIONS_NEWS = {
  categories: {
    'ROAD ACCIDENT & POTHOLE HAZARD': {
      en: 'ROAD ACCIDENT & POTHOLE HAZARD',
      hi: 'सड़क दुर्घटना एवं गड्ढे का खतरा',
      mr: 'रस्ता अपघात आणि खड्ड्यांचा धोका'
    },
    'WATER INFRASTRUCTURE': {
      en: 'WATER INFRASTRUCTURE',
      hi: 'जल आपूर्ति अवसंरचना',
      mr: 'पाणीपुरवठा पायाभूत सुविधा'
    },
    'ELECTRICAL HAZARD': {
      en: 'ELECTRICAL HAZARD',
      hi: 'विद्युत सुरक्षा खतरा',
      mr: 'विद्युत सुरक्षा धोका'
    },
    'DRAINAGE CLEARANCE': {
      en: 'DRAINAGE CLEARANCE',
      hi: 'नाली एवं जल निकासी सफाई',
      mr: 'पाणी निचरा व नालेसफाई'
    },
    'EMERGENCY & CRIME': {
      en: 'EMERGENCY & CRIME',
      hi: 'आपातकालीन एवं सुरक्षा अलर्ट',
      mr: 'आपत्कालीन आणि सुरक्षा इशारा'
    },
    'CIVIC INFRASTRUCTURE': {
      en: 'CIVIC INFRASTRUCTURE',
      hi: 'नागरिक अवसंरचना अपडेट',
      mr: 'नागरी पायाभूत सुविधा अपडेट'
    },
    'TRANSIT & ROADS': {
      en: 'TRANSIT & ROADS',
      hi: 'यातायात एवं मार्ग सूचना',
      mr: 'वाहतूक आणि रस्ता सूचना'
    },
    'WEATHER ALERT': {
      en: 'WEATHER ALERT',
      hi: 'मौसम एवं वर्षा चेतावनी',
      mr: 'हवामान आणि पाऊस इशारा'
    }
  },
  severity: {
    'ALL': { en: 'ALL', hi: 'सभी', mr: 'सर्व' },
    'CRITICAL': { en: 'CRITICAL', hi: 'गंभीर', mr: 'अति-गंभीर' },
    'HIGH': { en: 'HIGH', hi: 'उच्च', mr: 'उच्च' },
    'UPDATE': { en: 'UPDATE', hi: 'अपडेट', mr: 'अपडेट' },
    'RESOLVED': { en: 'RESOLVED', hi: 'हल हुआ', mr: 'निवारण झाले' }
  },
  ui: {
    activeLog: { en: 'ACTIVE DISPATCH LOG', hi: 'सक्रिय नियंत्रण कक्ष लॉग', mr: 'थेट नियंत्रण कक्ष नोंद' },
    recentUpdates: { en: 'Recent Incident Updates', hi: 'हालिया नागरी घटना अपडेट', mr: 'अलीकडील नागरी घटना अपडेट' },
    liveAlert: { en: 'LIVE ALERT', hi: 'लाइव अलर्ट', mr: 'थेट इशारा' },
    noUpdates: { en: 'No updates found for this category.', hi: 'इस श्रेणी के लिए कोई अपडेट नहीं मिला।', mr: 'या श्रेणीसाठी कोणतेही अपडेट आढळले नाही.' },
    connecting: { en: 'Connecting to civic news feed...', hi: 'नागरिक समाचार फीड से जुड़ रहा है...', mr: 'नागरी बातम्या फीडशी जोडत आहे...' },
    mumbaiRegion: { en: 'Mumbai Region', hi: 'मुंबई परिक्षेत्र', mr: 'मुंबई परिक्षेत्र' }
  },
  fallbackItems: [
    {
      id: 'NEWS-881',
      category: 'ROAD ACCIDENT & POTHOLE HAZARD',
      severity: 'CRITICAL',
      time: '12 mins ago',
      timeHi: '१२ मिनट पहले',
      timeMr: '१२ मिनिटांपूर्वी',
      source: 'City Traffic Police & Municipal Control',
      location: 'Sector 17, Main Market Gate',
      title: {
        en: 'Road Accident Reported Near Sector 17 Market Entrance',
        hi: 'सेक्टर १७ मार्केट गेट के पास सड़क दुर्घटना की सूचना',
        mr: 'सेक्टर १७ मार्केट प्रवेशद्वाराजवळ रस्ता अपघाताची नोंद'
      },
      summary: {
        en: 'Two-wheeler accident reported due to pothole near Sector 17 market gate. Municipal Emergency Asphalt Dispatch #4 allocated for immediate resurfacing.',
        hi: 'सेक्टर १७ मार्केट गेट के पास सड़क के गड्ढे के कारण दोपहिया दुर्घटना। तत्काल डामरीकरण के लिए नगर निगम आपातकालीन पथक #४ रवाना।',
        mr: 'सेक्टर १७ मार्केट गेटजवळ रस्त्यावरील खड्ड्यामुळे दुचाकी अपघात. तातडीने डांबरीकरणासाठी महानगरपालिका आपत्कालीन पथक #४ रवाना.'
      }
    },
    {
      id: 'NEWS-880',
      category: 'WATER INFRASTRUCTURE',
      severity: 'HIGH',
      time: '45 mins ago',
      timeHi: '४५ मिनट पहले',
      timeMr: '४५ मिनिटांपूर्वी',
      source: 'Water Supply & Sewage Board',
      location: 'Road 12, Bus Depot Area',
      title: {
        en: '14-Inch Main Potable Supply Pipeline Rupture Floods Palm Beach Road',
        hi: '१४-इंच मुख्य पेयजल आपूर्ति पाइपलाइन फटने से पाम बीच रोड जलमग्न',
        mr: '१४-इंची मुख्य पिण्याच्या पाण्याच्या पाईपलाईन फुटीमुळे पाम बीच रस्त्यावर पाणी'
      },
      summary: {
        en: 'Pressurized water pipe seam burst reported. Water Supply Board engineers have initiated emergency isolation valves to stop fresh water wastage.',
        hi: 'दबावयुक्त पानी की पाइप फटने की सूचना। पानी की बर्बादी रोकने हेतु जल आपूर्ति बोर्ड के इंजीनियरों द्वारा आपातकालीन वाल्व बंद किए गए।',
        mr: 'दाबाखालील मुख्य पाणी पाईपलाईन फुटल्याची नोंद. पाणी वाया जाणे रोखण्यासाठी पाणीपुरवठा मंडळाच्या अभियंत्यांनी आपत्कालीन व्हॉल्व्ह बंद केले.'
      }
    },
    {
      id: 'NEWS-879',
      category: 'ELECTRICAL HAZARD',
      severity: 'HIGH',
      time: '2 hours ago',
      timeHi: '२ घंटे पहले',
      timeMr: '२ तासांपूर्वी',
      source: 'Electrical & Lighting Cell',
      location: 'Station Road, Bus Stop #3',
      title: {
        en: 'Exposed High-Voltage Armored Cable Isolated at Station Road',
        hi: 'स्टेशन रोड पर खुली हाई-वोल्टेज केबल को सुरक्षित किया गया',
        mr: 'स्टेशन रोडवर उघडी पडलेली हाय-व्होल्टेज वायर सुरक्षित केली'
      },
      summary: {
        en: 'Following citizen hazard report CR-1043, Electrical Duty Squad #2 neutralized exposed wire casing near Bus Stop #3 to prevent public shock risk.',
        hi: 'नागरिक शिकायत CR-1043 के बाद, बस स्टॉप #3 के पास खुले बिजली के तारों को सुरक्षित कर करंट के खतरे को टाला गया।',
        mr: 'नागरी तक्रार CR-1043 नंतर, बस थांबा #३ जवळ उघड्या विद्युत तारा दुरुस्त करून संभाव्य अपघात टाळला.'
      }
    },
    {
      id: 'NEWS-878',
      category: 'DRAINAGE CLEARANCE',
      severity: 'RESOLVED',
      time: '4 hours ago',
      timeHi: '४ घंटे पहले',
      timeMr: '४ तासांपूर्वी',
      source: 'Storm Water Drainage Gang',
      location: 'Sector 15, Service Lane',
      title: {
        en: 'Monsoon Storm Drain Obstruction Cleared Ahead of Rainfall Alert',
        hi: 'बारिश के अलर्ट से पहले मानसून ड्रेनेज रुकावट साफ की गई',
        mr: 'पावसाच्या इशाऱ्यापूर्वी पावसाळी नालेसफाई मोहीम पूर्ण'
      },
      summary: {
        en: 'Debris blockage cleared at Sector 15 storm drain grill, Restoring full channel capacity for rain runoff.',
        hi: 'सेक्टर १५ के मुख्य ड्रेनेज ग्रिल से कचरे का अवरोध हटाया गया, जिससे बारिश के पानी की निकासी सुचारू हो सके।',
        mr: 'सेक्टर १५ मधील पावसाळी नाल्यातील अडथळा दूर करून पाणी वाहून जाण्याचा मार्ग मोकळा करण्यात आला.'
      }
    }
  ]
};

const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const getRelativeTime = (dateString, lang = 'en') => {
  const date = new Date(dateString.replace(' ', 'T') + 'Z'); 
  const now = new Date();
  let diffInSeconds = Math.floor((now - date) / 1000);
  
  if (isNaN(diffInSeconds) || diffInSeconds < 0) {
     return lang === 'hi' ? "हाल ही में" : lang === 'mr' ? "नुकतेच" : "Recently"; 
  }
  
  if (diffInSeconds < 60) {
    return lang === 'hi' ? `${diffInSeconds} सेकंड पहले` : lang === 'mr' ? `${diffInSeconds} सेकंदांपूर्वी` : `${diffInSeconds} seconds ago`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return lang === 'hi' ? `${diffInMinutes} मिनट पहले` : lang === 'mr' ? `${diffInMinutes} मिनिटांपूर्वी` : `${diffInMinutes} mins ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return lang === 'hi' ? `${diffInHours} घंटे पहले` : lang === 'mr' ? `${diffInHours} तासांपूर्वी` : `${diffInHours} hours ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return lang === 'hi' ? `${diffInDays} दिन पहले` : lang === 'mr' ? `${diffInDays} दिवसांपूर्वी` : `${diffInDays} days ago`;
};

const categorizeNews = (title, content) => {
  const text = (title + ' ' + content).toLowerCase();
  
  const excludeKeywords = /\b(bjp|ncp|tmc|congress|shiv sena|aap|tax|court|bail|slams|minister|president|oppn|opposition|election|vote|campaign|rally|protest|policy|scheme|budget)\b/;
  if (excludeKeywords.test(text)) return null;
  
  if (text.match(/\b(accident|crash|fire|collapse|hazard|emergency|casualty|injury|death|killed|murder|crime)\b/)) {
    return { category: 'EMERGENCY & CRIME', severity: 'CRITICAL' };
  }
  if (text.match(/\b(water cut|pipe burst|water logging|pothole|drain|sewage|garbage|infrastructure|power cut|electricity|blackout)\b/)) {
    return { category: 'CIVIC INFRASTRUCTURE', severity: 'HIGH' };
  }
  if (text.match(/\b(traffic|road block|highway|train|local|station|metro|bridge|delay|derail)\b/)) {
    return { category: 'TRANSIT & ROADS', severity: 'UPDATE' };
  }
  if (text.match(/\b(rain|weather|monsoon|alert|flood|cyclone|storm)\b/)) {
    return { category: 'WEATHER ALERT', severity: 'HIGH' };
  }
  return null;
};

// Dynamic text translator for live feeds
const translateLiveText = (text, targetLang) => {
  if (!text || targetLang === 'en') return text;
  
  const replacements = {
    hi: [
      [/water/gi, 'पानी'],
      [/pothole/gi, 'सड़क का गड्ढा'],
      [/road/gi, 'सड़क'],
      [/accident/gi, 'दुर्घटना'],
      [/traffic/gi, 'यातायात'],
      [/fire/gi, 'आग'],
      [/rain/gi, 'बारिश'],
      [/flood/gi, 'बाढ़'],
      [/emergency/gi, 'आपातकाल'],
      [/pipeline/gi, 'पाइपलाइन'],
      [/leakage/gi, 'लीकेज'],
      [/mumbai/gi, 'मुंबई'],
      [/closure/gi, 'बंद'],
      [/delayed/gi, 'विलंबित'],
      [/repaired/gi, 'मरम्मत की गई'],
      [/police/gi, 'पुलिस'],
      [/alert/gi, 'चेतावनी']
    ],
    mr: [
      [/water/gi, 'पाणी'],
      [/pothole/gi, 'रस्त्यावरील खड्डा'],
      [/road/gi, 'रस्ता'],
      [/accident/gi, 'अपघात'],
      [/traffic/gi, 'वाहतूक'],
      [/fire/gi, 'आग'],
      [/rain/gi, 'पाऊस'],
      [/flood/gi, 'पूर'],
      [/emergency/gi, 'आपत्कालीन'],
      [/pipeline/gi, 'पाईपलाईन'],
      [/leakage/gi, 'गळती'],
      [/mumbai/gi, 'मुंबई'],
      [/closure/gi, 'बंद'],
      [/delayed/gi, 'उशीर'],
      [/repaired/gi, 'दुरुस्ती पूर्ण'],
      [/police/gi, 'पोलीस'],
      [/alert/gi, 'इशारा']
    ]
  };

  let translated = text;
  const list = replacements[targetLang] || [];
  list.forEach(([pattern, repl]) => {
    translated = translated.replace(pattern, repl);
  });
  return translated;
};

export const CivicNewsFeed = () => {
  const { language, changeLanguage } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.hindustantimes.com/feeds/rss/cities/mumbai-news/rssfeed.xml');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
          const processedNews = [];
          
          for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i];
            const classification = categorizeNews(item.title, item.description);
            
            if (classification) {
              const cleanSummary = stripHtml(item.description).slice(0, 150) + '...';
              processedNews.push({
                id: `LIVE-NEWS-${processedNews.length}`,
                category: classification.category,
                title: item.title,
                summary: cleanSummary,
                location: 'Mumbai Region',
                severity: classification.severity,
                rawDate: item.pubDate,
                source: 'Hindustan Times (Mumbai)',
                originalLink: item.link
              });
            }
          }

          if (processedNews.length < 4) {
             const needed = 4 - processedNews.length;
             processedNews.push(...TRANSLATIONS_NEWS.fallbackItems.slice(0, needed));
          }
          
          setNewsItems(processedNews.slice(0, 8));
        } else {
          setNewsItems(TRANSLATIONS_NEWS.fallbackItems);
        }
      } catch (error) {
        console.error("Error fetching live civic news:", error);
        setNewsItems(TRANSLATIONS_NEWS.fallbackItems);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getLocalizedCategory = (cat) => {
    return TRANSLATIONS_NEWS.categories[cat]?.[language] || cat;
  };

  const getLocalizedSeverity = (sev) => {
    return TRANSLATIONS_NEWS.severity[sev]?.[language] || sev;
  };

  const getLocalizedTitle = (item) => {
    if (item.title && typeof item.title === 'object') {
      return item.title[language] || item.title.en;
    }
    return translateLiveText(item.title, language);
  };

  const getLocalizedSummary = (item) => {
    if (item.summary && typeof item.summary === 'object') {
      return item.summary[language] || item.summary.en;
    }
    return translateLiveText(item.summary, language);
  };

  const getLocalizedTime = (item) => {
    if (item.timeHi && language === 'hi') return item.timeHi;
    if (item.timeMr && language === 'mr') return item.timeMr;
    if (item.rawDate) return getRelativeTime(item.rawDate, language);
    return item.time || 'Recently';
  };

  const filteredNews =
    activeCategory === 'ALL'
      ? newsItems
      : newsItems.filter((n) => n.severity === activeCategory);

  return (
    <div className="rounded-lg border border-[#DDE1E7] bg-white p-5 shadow-sm space-y-4 font-sans h-full flex flex-col">
      {/* Header & Live Ticker Indicator + Quick Language Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1E7] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F4F5F7] rounded-md border border-[#DDE1E7] text-[#14213D]">
            <Radio className="w-5 h-5 text-[#E8963C]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.05em] text-[#14213D]">
                {TRANSLATIONS_NEWS.ui.activeLog[language] || 'ACTIVE DISPATCH LOG'}
              </span>
              {loading && <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />}
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D]">
              {TRANSLATIONS_NEWS.ui.recentUpdates[language] || 'Recent Incident Updates'}
            </h4>
          </div>
        </div>

        {/* Controls: Language Pills & Severity Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick News Language Switcher */}
          <div className="flex items-center bg-[#F4F5F7] border border-[#DDE1E7] rounded p-0.5 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-gray-500 ml-1.5 mr-1" />
            <button
              type="button"
              onClick={() => changeLanguage('en')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                language === 'en' ? 'bg-[#14213D] text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => changeLanguage('hi')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                language === 'hi' ? 'bg-[#14213D] text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              हिं
            </button>
            <button
              type="button"
              onClick={() => changeLanguage('mr')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                language === 'mr' ? 'bg-[#14213D] text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              मरा
            </button>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.05em]">
            {['ALL', 'CRITICAL', 'HIGH', 'UPDATE', 'RESOLVED'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategory(tab)}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  activeCategory === tab
                    ? 'bg-[#14213D] text-white border-[#14213D] font-bold'
                    : 'bg-[#F4F5F7] text-gray-700 border-[#DDE1E7] hover:bg-[#e8ebf0]'
                }`}
              >
                {getLocalizedSeverity(tab)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Breaking News Ticker Strip */}
      <div className="bg-white border border-[#DDE1E7] shadow-sm rounded-md p-3 flex items-center gap-3 text-xs text-[#14213D] font-sans">
        <Radio className="w-4 h-4 flex-shrink-0 text-[#D64545] animate-pulse" />
        <p className="font-semibold flex-1 truncate">
          {newsItems.length > 0 ? getLocalizedTitle(newsItems[0]) : TRANSLATIONS_NEWS.ui.connecting[language]}
        </p>
        <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.05em] border border-[#D64545] text-[#D64545] px-2 py-0.5 rounded">
          {TRANSLATIONS_NEWS.ui.liveAlert[language]}
        </span>
      </div>

      {/* News Cards Feed */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-500 font-medium">
            {TRANSLATIONS_NEWS.ui.noUpdates[language]}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map((news) => (
              <a
                key={news.id}
                href={news.originalLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#DDE1E7] bg-white p-4 space-y-2.5 hover:border-[#C49A45] transition-all shadow-xs flex flex-col justify-between block cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.05em] text-[#14213D] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#DDE1E7] truncate max-w-[200px]">
                      {getLocalizedCategory(news.category)}
                    </span>
                    <span
                      className={`text-[10px] font-sans font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded flex-shrink-0 ${
                        news.severity === 'CRITICAL'
                          ? 'bg-[#D64545] text-white'
                          : news.severity === 'HIGH'
                          ? 'bg-[#E8963C] text-white'
                          : news.severity === 'UPDATE'
                          ? 'bg-[#1E5A99] text-white'
                          : 'bg-[#4A9B6E] text-white'
                      }`}
                    >
                      {getLocalizedSeverity(news.severity)}
                    </span>
                  </div>

                  <h5 className="text-base font-bold font-heading text-[#14213D] leading-snug group-hover:text-[#C49A45] transition-colors">
                    {getLocalizedTitle(news)}
                  </h5>

                  <p className="text-xs text-gray-700 leading-relaxed font-sans line-clamp-3">
                    {getLocalizedSummary(news)}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DDE1E7] flex items-center justify-between text-[11px] font-sans font-medium text-gray-500 uppercase tracking-wide">
                  <span>📍 {TRANSLATIONS_NEWS.ui.mumbaiRegion[language]}</span>
                  <span className="text-gray-400 font-mono">{getLocalizedTime(news)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


