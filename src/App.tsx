import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Driver from './Driver';

let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
// WhatsApp-Style Map Tap Engine
function TapToPinMarker({ locationCoords, setLocationCoords }: any) {
  const map = useMapEvents({
    click(e) {
      // 1. Grab the exact GPS coordinates where the finger tapped
      const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
      // 2. Save it to your App's memory
      setLocationCoords(newCoords);
      // 3. Smoothly fly the camera to center the new pin
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // If there are no coords, don't show a pin. If there are, drop the pin!
  return locationCoords === null ? null : (
    <Marker position={[locationCoords.lat, locationCoords.lng]} />
  );
}
// Auto-Pilot: Flies map to user the second it opens
 function AutoLocate({ setLocationCoords }: any) {
  const map = useMapEvents({
    locationfound(e) {
      setLocationCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.flyTo(e.latlng, 16); // 16 is a great street-level zoom
    },
  });

  React.useEffect(() => {
    map.locate(); // Triggers the phone's GPS instantly
  }, [map]);

  return null;
}
L.Marker.prototype.options.icon = DefaultIcon;

import { 
  Upload,
  PlusSquare,
  Smartphone,
  ChevronRight,
  X,
  MapPin,
  Info,
  Menu,
  User,
  Zap,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  LogOut,
  Search,
  History,
  Plus,
  Home,
  Briefcase,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  Navigation,
  Map as MapIcon,
  Crosshair,
  Globe
} from 'lucide-react';

// --- Types & Database ---

const customMarkerIcon = L.divIcon({
  className: 'custom-pin',
  html: `
    <div class="relative flex items-center justify-center w-full h-full">
      <div class="absolute w-full h-full bg-[#B5F573] rounded-full animate-ping opacity-50"></div>
      <div class="relative w-4 h-4 bg-[#B5F573] rounded-full border-[2.5px] border-white shadow-[0_0_15px_rgba(181,245,115,0.8)]"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

interface EVModel {
  name: string;
  capacities: number[];
}

const evDatabase: Record<string, EVModel[]> = {
  "Tesla": [
    { name: "Model S", capacities: [100] },
    { name: "Model 3", capacities: [57.5, 82] },
    { name: "Model X", capacities: [100] },
    { name: "Model Y", capacities: [60, 82] },
    { name: "Cybertruck", capacities: [123] },
    { name: "Roadster", capacities: [53, 200] }
  ],
  "Rivian": [
    { name: "R1T", capacities: [105, 135, 149] },
    { name: "R1S", capacities: [105, 135, 149] },
    { name: "EDV / RCV", capacities: [100, 135] },
    { name: "R2", capacities: [87.4, 95] },
    { name: "R3 / R3X", capacities: [75, 87.4] }
  ],
  "Lucid": [
    { name: "Air", capacities: [88, 118] },
    { name: "Gravity", capacities: [120] }
  ],
  "Ford": [
    { name: "Mustang Mach-E", capacities: [72, 91] },
    { name: "F-150 Lightning", capacities: [98, 131] },
    { name: "E-Transit", capacities: [68, 89] }
  ],
  "Chevrolet": [
    { name: "Bolt EV / EUV", capacities: [65] },
    { name: "Equinox EV", capacities: [85] },
    { name: "Blazer EV", capacities: [85, 102] },
    { name: "Silverado EV", capacities: [205] }
  ],
  "Cadillac": [
    { name: "Lyriq", capacities: [102] },
    { name: "Celestiq", capacities: [111] },
    { name: "Optiq", capacities: [85] },
    { name: "Escalade IQ", capacities: [200] },
    { name: "Vistiq", capacities: [102] }
  ],
  "GMC": [
    { name: "Hummer EV", capacities: [170, 212] },
    { name: "Sierra EV", capacities: [205] }
  ],
  "Dodge": [
    { name: "Charger Daytona", capacities: [94, 100.5] }
  ],
  "Jeep": [
    { name: "Wagoneer S", capacities: [100.5] },
    { name: "Recon", capacities: [100.5] }
  ],
  "Ram": [
    { name: "1500 REV", capacities: [168, 229] },
    { name: "ProMaster EV", capacities: [110] }
  ],
  "Fisker": [
    { name: "Ocean", capacities: [73, 113] }
  ],
  "Volkswagen": [
    { name: "ID.3", capacities: [58, 77, 79] },
    { name: "ID.4 / ID.5", capacities: [52, 77] },
    { name: "ID.7", capacities: [77, 86] },
    { name: "ID. Buzz", capacities: [77, 86] },
    { name: "e-Up!", capacities: [18.7, 32.3] }
  ],
  "Audi": [
    { name: "Q8 e-tron", capacities: [89, 106] },
    { name: "Q4 e-tron", capacities: [52, 77] },
    { name: "Q6 / A6 e-tron", capacities: [83, 100] },
    { name: "e-tron GT", capacities: [84, 97] }
  ],
  "Porsche": [
    { name: "Taycan", capacities: [79.2, 105] },
    { name: "Macan EV", capacities: [100] }
  ],
  "Skoda": [
    { name: "Enyaq iV", capacities: [58, 77] },
    { name: "Elroq", capacities: [52, 77] }
  ],
  "BMW": [
    { name: "i4", capacities: [67, 81] },
    { name: "i5", capacities: [81.2] },
    { name: "i7", capacities: [101.7] },
    { name: "iX", capacities: [71, 105.2] },
    { name: "iX1 / iX2", capacities: [64.7] },
    { name: "iX3", capacities: [74] }
  ],
  "Mini": [
    { name: "Cooper SE", capacities: [40.7, 54.2] },
    { name: "Countryman SE", capacities: [64.6] },
    { name: "Aceman", capacities: [42.5, 54.2] }
  ],
  "Rolls-Royce": [
    { name: "Spectre", capacities: [102] }
  ],
  "Mercedes-Benz": [
    { name: "EQA / EQB", capacities: [66.5, 70.5] },
    { name: "EQC", capacities: [80] },
    { name: "EQE", capacities: [89, 90.6] },
    { name: "EQS", capacities: [108.4, 118] },
    { name: "EQV", capacities: [60, 90] },
    { name: "G580", capacities: [116] }
  ],
  "Smart": [
    { name: "Smart #1 / #3", capacities: [49, 66] }
  ],
  "Peugeot": [
    { name: "e-208 / e-2008 / e-308", capacities: [50, 54] },
    { name: "e-3008 / e-5008", capacities: [73, 98] }
  ],
  "Fiat": [
    { name: "500e", capacities: [24, 42] },
    { name: "600e", capacities: [54] }
  ],
  "Maserati": [
    { name: "Folgore Range", capacities: [92.5, 105] }
  ],
  "Opel / Vauxhall": [
    { name: "Electric Range", capacities: [50, 54] }
  ],
  "Alfa Romeo": [
    { name: "Junior Elettrica", capacities: [54] }
  ],
  "Volvo": [
    { name: "XC40 / C40 Recharge", capacities: [69, 82] },
    { name: "EX30", capacities: [51, 69] },
    { name: "EX90", capacities: [104, 111] },
    { name: "EM90", capacities: [116] }
  ],
  "Polestar": [
    { name: "Polestar 2", capacities: [69, 82] },
    { name: "Polestar 3", capacities: [111] },
    { name: "Polestar 4", capacities: [100] },
    { name: "Polestar 5", capacities: [103, 119] }
  ],
  "Lotus": [
    { name: "Evija", capacities: [70] },
    { name: "Eletre", capacities: [112] },
    { name: "Emeya", capacities: [102] }
  ],
  "Renault": [
    { name: "Zoe", capacities: [22, 52] },
    { name: "Megane E-Tech", capacities: [40, 60] },
    { name: "Scenic E-Tech", capacities: [60, 87] },
    { name: "Renault 5 E-Tech", capacities: [40, 52] }
  ],
  "Jaguar": [
    { name: "I-Pace", capacities: [90] }
  ],
  "Hyundai": [
    { name: "Kona Electric", capacities: [39, 65.4] },
    { name: "Ioniq 5", capacities: [58, 84] },
    { name: "Ioniq 6", capacities: [53, 84] },
    { name: "Ioniq 9", capacities: [110.3] }
  ],
  "Kia": [
    { name: "Soul EV", capacities: [27, 64] },
    { name: "Niro EV", capacities: [39, 64.8] },
    { name: "EV6", capacities: [58, 84] },
    { name: "EV9", capacities: [76.1, 99.8] },
    { name: "EV3", capacities: [58.3, 81.4] }
  ],
  "Genesis": [
    { name: "GV60 / GV70", capacities: [77.4] },
    { name: "Electrified G80", capacities: [87.2] }
  ],
  "Nissan": [
    { name: "Leaf", capacities: [24, 62] },
    { name: "Ariya", capacities: [63, 87] },
    { name: "Sakura", capacities: [20] }
  ],
  "Toyota": [
    { name: "bZ4X", capacities: [71.4, 72.8] },
    { name: "Prius Prime", capacities: [13.6] }
  ],
  "Subaru": [
    { name: "Solterra", capacities: [71.4, 72.8] }
  ],
  "Lexus": [
    { name: "RZ 450e", capacities: [71.4] },
    { name: "UX 300e", capacities: [54.3, 72.8] }
  ],
  "Honda": [
    { name: "Prologue", capacities: [85] },
    { name: "e:Ny1", capacities: [68.8] }
  ],
  "Mazda": [
    { name: "MX-30", capacities: [35.5] }
  ],
  "BYD": [
    { name: "Atto 3", capacities: [49.9, 60.5] },
    { name: "Dolphin", capacities: [32, 60.5] },
    { name: "Seal", capacities: [61.4, 82.5] },
    { name: "Han", capacities: [64.8, 85.4] },
    { name: "Tang", capacities: [86.4, 108.8] },
    { name: "Song L", capacities: [71.8, 87] },
    { name: "Seagull", capacities: [30, 38.9] }
  ],
  "NIO": [
    { name: "ES Range", capacities: [75, 100, 150] },
    { name: "ET Range", capacities: [75, 100, 150] },
    { name: "EC Range", capacities: [75, 100, 150] }
  ],
  "Xpeng": [
    { name: "G3", capacities: [50.5, 66] },
    { name: "G6", capacities: [66, 87.5] },
    { name: "G9", capacities: [78.2, 98] },
    { name: "P5", capacities: [55.9, 71.4] },
    { name: "P7", capacities: [60.2, 86.2] },
    { name: "X9", capacities: [84.5, 101.5] }
  ],
  "Zeekr": [
    { name: "001", capacities: [86, 100, 140] },
    { name: "009", capacities: [116, 140] },
    { name: "X", capacities: [66] },
    { name: "007", capacities: [75, 100] }
  ],
  "MG": [
    { name: "ZS EV", capacities: [44.5, 72.6] },
    { name: "MG4 EV", capacities: [51, 77] },
    { name: "MG5 EV", capacities: [52.5, 61.1] },
    { name: "Cyberster", capacities: [64, 77] }
  ]
};

const PRICE_PER_KWH = 5; // 5 DH per kWh
const DEFAULT_BATTERY_KWH = 75;

type Language = 'en' | 'fr' | 'ar';

const translations = {
  en: {
    welcome: "Welcome,",
    letsGetCharging: "Let's get charging.",
    searchPlaceholder: "Search for your location",
    useCurrentLocation: "Use current location",
    savedAddresses: "Your saved addresses",
    addNew: "Add New",
    noSavedAddresses: "You don't have any saved addresses yet.",
    chargeHistory: "Charge History",
    noUpcomingCharges: "No upcoming charges",
    noUpcomingChargesDesc: "You don't have an upcoming charges",
    confirmLocation: "Confirm Location",
    dragMap: "Drag map to adjust pin",
    addNotes: "Add notes",
    addNotesPlaceholder: "Add landmarks to make it easier to find your address.",
    label: "Label",
    other: "Other",
    work: "Work",
    home: "Home",
    vehicle: "Vehicle",
    selectBrandModel: "Select Brand & Model",
    amount: "Amount",
    safetyLimit: "Safety limit: 85%",
    whyFst: "Why are you using FST today?",
    selectReason: "Select a reason",
    reasonConvenience: "Convenience",
    reasonEmergency: "Emergency / Low battery",
    reasonNoCharger: "No charger at home",
    reasonOther: "Other",
    deliveryNotes: "Charge delivery notes",
    deliveryNotesPlaceholder: "Gate code, parking spot #, etc.",
    selectDate: "Select a date",
    selectTime: "Select a time",
    review: "Review",
    confirmDetails: "Please confirm your details",
    location: "Location",
    charge: "Charge",
    time: "Time",
    totalEstimated: "Total Estimated",
    rate: "Rate",
    nextStep: "Next Step",
    reviewBooking: "Review Booking",
    requestCharge: "Request Charge & Send Location",
    settings: "Settings",
    guestUser: "Guest User",
    manageProfile: "Manage Profile",
    signOut: "Sign Out",
    locating: "Locating you...",
    today: "Today",
    tomorrow: "Tomorrow",
    ourTech: "Our Technology",
    whyUs: "Why FST",
    aboutUs: "About Us",
    needHelp: "Need Help?",
    contactUs: "Contact Us",
    ratePerKwh: "5 DH/kWh",
    dh: "DH",
    selectBrand: "Select Brand",
    selectModel: "Select Model",
    capacity: "Capacity",
    searchBrand: "Search Brand",
    searchModel: "Search Model",
    noBrandsFound: "No brands found",
    noModelsFound: "No models found",
    back: "Back"
  },
  fr: {
    welcome: "Bienvenue,",
    letsGetCharging: "Commençons la charge.",
    searchPlaceholder: "Rechercher votre position",
    useCurrentLocation: "Utiliser la position actuelle",
    savedAddresses: "Vos adresses enregistrées",
    addNew: "Ajouter",
    noSavedAddresses: "Vous n'avez pas encore d'adresses enregistrées.",
    chargeHistory: "Historique de charge",
    noUpcomingCharges: "Aucune charge à venir",
    noUpcomingChargesDesc: "Vous n'avez pas de charges prévues",
    confirmLocation: "Confirmer la position",
    dragMap: "Faites glisser la carte pour ajuster",
    addNotes: "Ajouter des notes",
    addNotesPlaceholder: "Ajoutez des repères pour faciliter la localisation.",
    label: "Étiquette",
    other: "Autre",
    work: "Travail",
    home: "Maison",
    vehicle: "Véhicule",
    selectBrandModel: "Sélectionner Marque & Modèle",
    amount: "Montant",
    safetyLimit: "Limite de sécurité : 85%",
    whyFst: "Pourquoi utilisez-vous FST aujourd'hui ?",
    selectReason: "Sélectionner une raison",
    reasonConvenience: "Commodité",
    reasonEmergency: "Urgence / Batterie vide",
    reasonNoCharger: "Pas de chargeur à domicile",
    reasonOther: "Autre",
    deliveryNotes: "Notes de livraison",
    deliveryNotesPlaceholder: "Code portail, n° place de parking, etc.",
    selectDate: "Sélectionner une date",
    selectTime: "Sélectionner une heure",
    review: "Récapitulatif",
    confirmDetails: "Veuillez confirmer vos détails",
    location: "Lieu",
    charge: "Charge",
    time: "Heure",
    totalEstimated: "Total Estimé",
    rate: "Tarif",
    nextStep: "Étape Suivante",
    reviewBooking: "Vérifier la réservation",
    requestCharge: "Demander la charge & Envoyer la position",
    settings: "Paramètres",
    guestUser: "Utilisateur Invité",
    manageProfile: "Gérer le profil",
    signOut: "Se déconnecter",
    locating: "Localisation...",
    today: "Aujourd'hui",
    tomorrow: "Demain",
    ourTech: "Notre Technologie",
    whyUs: "Pourquoi FST",
    aboutUs: "À propos",
    needHelp: "Besoin d'aide ?",
    contactUs: "Contactez-nous",
    ratePerKwh: "5 DH/kWh",
    dh: "DH",
    selectBrand: "Sélectionner la marque",
    selectModel: "Sélectionner le modèle",
    capacity: "Capacité",
    searchBrand: "Rechercher une marque",
    searchModel: "Rechercher un modèle",
    noBrandsFound: "Aucune marque trouvée",
    noModelsFound: "Aucun modèle trouvé",
    back: "Retour"
  },
  ar: {
    welcome: "مرحباً،",
    letsGetCharging: "لنبدأ الشحن.",
    searchPlaceholder: "ابحث عن موقعك",
    useCurrentLocation: "استخدم الموقع الحالي",
    savedAddresses: "عناوينك المحفوظة",
    addNew: "إضافة جديد",
    noSavedAddresses: "ليس لديك أي عناوين محفوظة بعد.",
    chargeHistory: "سجل الشحن",
    noUpcomingCharges: "لا توجد شحنات قادمة",
    noUpcomingChargesDesc: "ليس لديك أي شحنات مجدولة",
    confirmLocation: "تأكيد الموقع",
    dragMap: "اسحب الخريطة لضبط الدبوس",
    addNotes: "إضافة ملاحظات",
    addNotesPlaceholder: "أضف معالم لتسهيل العثور على عنوانك.",
    label: "تسمية",
    other: "آخر",
    work: "عمل",
    home: "منزل",
    vehicle: "مركبة",
    selectBrandModel: "اختر العلامة التجارية والموديل",
    amount: "الكمية",
    safetyLimit: "حد الأمان: 85%",
    whyFst: "لماذا تستخدم FST اليوم؟",
    selectReason: "اختر سبباً",
    reasonConvenience: "راحة",
    reasonEmergency: "طوارئ / بطارية فارغة",
    reasonNoCharger: "لا يوجد شاحن في المنزل",
    reasonOther: "آخر",
    deliveryNotes: "ملاحظات التسليم",
    deliveryNotesPlaceholder: "رمز البوابة، رقم موقف السيارات، إلخ.",
    selectDate: "اختر تاريخاً",
    selectTime: "اختر وقتاً",
    review: "مراجعة",
    confirmDetails: "يرجى تأكيد التفاصيل الخاصة بك",
    location: "الموقع",
    charge: "الشحن",
    time: "الوقت",
    totalEstimated: "إجمالي التقدير",
    rate: "سعر",
    nextStep: "الخطوة التالية",
    reviewBooking: "مراجعة الحجز",
    requestCharge: "طلب الشحن وإرسال الموقع",
    settings: "الإعدادات",
    guestUser: "زائر",
    manageProfile: "إدارة الملف الشخصي",
    signOut: "تسجيل الخروج",
    locating: "جارٍ تحديد الموقع...",
    today: "اليوم",
    tomorrow: "غداً",
    ourTech: "تقنيتنا",
    whyUs: "لماذا FST",
    aboutUs: "معلومات عنا",
    needHelp: "تحتاج مساعدة؟",
    contactUs: "اتصل بنا",
    ratePerKwh: "5 درهم/كيلوواط",
    dh: "درهم",
    selectBrand: "اختر العلامة التجارية",
    selectModel: "اختر الموديل",
    capacity: "السعة",
    searchBrand: "ابحث عن العلامة التجارية",
    searchModel: "ابحث عن الموديل",
    noBrandsFound: "لم يتم العثور على علامات تجارية",
    noModelsFound: "لم يتم العثور على موديلات",
    back: "رجوع"
  }
};

// --- Components ---

const FstLogo = ({ small = false }: { small?: boolean }) => {
  return (
    <div className={`flex flex-col items-start justify-center transition-all ${small ? 'scale-75' : 'scale-100'}`}>
      <div 
        className="flex items-center font-black italic tracking-tighter leading-none" 
        style={{ 
          fontSize: small ? '24px' : '34px',
          WebkitTextStroke: '1px #1C1C1E',
          color: '#B5F573',
          textShadow: small ? '1.5px 1.5px 0 #1C1C1E' : '3px 3px 0 #1C1C1E' 
        }}
      >
        <span className="pr-0.5">F</span>
        <svg width={small ? 16 : 22} height={small ? 24 : 34} viewBox="0 0 24 36" className="mx-0 overflow-visible -skew-x-12">
          <path 
            d="M14 0 L0 20 L11 20 L8 36 L24 14 L13 14 Z" 
            fill="#B5F573" 
            stroke="#1C1C1E" 
            strokeWidth="2" 
            style={{ filter: `drop-shadow(${small ? 1.5 : 3}px ${small ? 1.5 : 3}px 0px #1C1C1E)` }}
          />
        </svg>
        <span className="pl-0.5">T</span>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className={`font-black tracking-[0.15em] text-[#1C1C1E] leading-none ${small ? 'text-[10px]' : 'text-[14px]'}`}>SERVE</span>
        <div className={`${small ? 'w-6 h-1' : 'w-10 h-1.5'} bg-[#1C1C1E]`}></div>
      </div>
    </div>
  );
};

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
    <ChevronLeft size={24} className="text-[#1C1C1E]" />
  </button>
);

const userLocationIcon = L.divIcon({
  className: 'user-location-dot',
  html: `
    <div class="relative flex items-center justify-center w-full h-full">
      <div class="absolute w-full h-full bg-[#4285F4] rounded-full animate-ping opacity-30"></div>
      <div class="relative w-4 h-4 bg-[#4285F4] rounded-full border-[2.5px] border-white shadow-md"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// UPATED: Map Events Component (Now senses dragging and tapping)
const MapEvents = ({ onMoveEnd, setIsDraggingMap }: { onMoveEnd: (lat: number, lng: number) => void, setIsDraggingMap: (is: boolean) => void }) => {
  const map = useMapEvents({
    movestart: () => setIsDraggingMap(true),
    moveend: () => {
      setIsDraggingMap(false);
      const center = map.getCenter();
      onMoveEnd(center.lat, center.lng);
    },
    click: (e) => {
      // Allows user to just tap the screen to drop the pin
      map.flyTo(e.latlng, map.getZoom(), { animate: true, duration: 0.5 });
    }
  });
  return null;
};

// UPDATED: Map Controls Component (GPS Snap Button now floats intelligently)
const MapControls = ({ userLocation, isDraggingMap }: { userLocation: { lat: number, lng: number } | null, isDraggingMap: boolean }) => {
  const map = useMapEvents({});

  const handleSnap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 16, {
        animate: true,
        duration: 1.5
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 16, { animate: true, duration: 1.5 });
      });
    }
  };

  return (
    <div className={`absolute right-4 transition-all duration-300 ease-in-out z-[400] ${isDraggingMap ? 'bottom-8' : 'bottom-[48vh]'}`}>
      <button 
        onClick={handleSnap}
        className="bg-white p-3 rounded-full shadow-xl text-[#1C1C1E] active:scale-90 transition-transform border border-gray-100"
      >
        <Crosshair size={24} className="text-[#1C1C1E]" />
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  // 🚨 SECRET DRIVER TERMINAL ROUTE
if (window.location.search.includes('driver')) return <Driver />;
  const [isAppReady, setIsAppReady] = useState(false);
  
// --- PWA Install Logic ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false); // Add this!

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

 const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } else {
      // THIS IS THE CRITICAL LINE THAT TRIGGERS THE NEW MENU!
      setShowIOSPrompt(true); 
    }
  };
  // -------------------------
// --- SECURE VAULT CONNECTION ---
  const handleConfirmOrder = async () => {
    try {
      // NOTE: We will map these to your actual variables (like selectedEnergy, totalPrice) next!
      const orderData = {
        location: "Current User Location", 
        vehicle: "Selected Vehicle",   
        energy: "Requested Energy",
        price: "Total Price"      
      };

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("✅ Order Sent securely to FST Command Center!");
      } else {
        alert("❌ Error sending order. Please try again.");
      }
    } catch (error) {
      console.error("Vault Connection Error:", error);
    }
  };
  // -------------------------------
  
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  const [step, setStep] = useState<number>(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Data State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  // --- 🚨 FLEET TRACKER STATE (Supports Multiple Orders) ---
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  
  // Cancel Modal States
  const [orderToCancel, setOrderToCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [customCancelText, setCustomCancelText] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Success Screen State
  const [showApproved, setShowApproved] = useState(false);
// --- 🚨 INVISIBLE ACCOUNT: Load user profile on startup ---
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('fst_user_profile');
      if (savedProfile) {
        const { savedName, savedPhone, savedEmail } = JSON.parse(savedProfile);
        
        // Auto-fills using your exact background variable names!
        if (savedName && typeof setCustomerName === 'function') setCustomerName(savedName);
        if (savedPhone && typeof setCustomerPhone === 'function') setCustomerPhone(savedPhone);
        
        // Try setCustomerEmail (or setEmail if it fails!)
        if (savedEmail && typeof setCustomerEmail === 'function') setCustomerEmail(savedEmail);
      }
    } catch (e) {
      console.error("Profile load error", e);
    }
  }, []);
  // Checks phone memory AND Live Airtable Status for ALL trucks automatically
  useEffect(() => {
    // 1. Safe Migration: Converts old single orders to the new Fleet List
    let currentOrders: any[] = [];
    const oldSingle = localStorage.getItem('fst_active_order');
    if (oldSingle) {
      currentOrders.push(JSON.parse(oldSingle));
      localStorage.removeItem('fst_active_order'); // Clean up old system
      localStorage.setItem('fst_orders_list', JSON.stringify(currentOrders));
    } else {
      const savedList = localStorage.getItem('fst_orders_list');
      if (savedList) currentOrders = JSON.parse(savedList);
    }

    setActiveOrders(currentOrders);

    // 2. Ask Command Center for updates on EVERY active truck
    const checkLiveStatus = () => {
      if (currentOrders.length === 0) return;

      currentOrders.forEach((order, index) => {
         // Stop tracking if it is already canceled!
         if (order.id && !order.status.includes('Canceled') && !order.status.includes('Annulé')) {
            fetch(`/api/track?id=${order.id}`)
              .then(res => res.json())
              .then(data => {
                if (data.status && data.status !== currentOrders[index].status) {
                   currentOrders[index].status = data.status;
                   setActiveOrders([...currentOrders]);
                   localStorage.setItem('fst_orders_list', JSON.stringify(currentOrders));
                }
              })
              .catch(err => console.error("Tracker error", err));
         }
      });
    };

    checkLiveStatus();
    const statusTimer = setInterval(checkLiveStatus, 5000);
    return () => clearInterval(statusTimer);

  }, [step]); // Triggers when they return to the Home Screen
  // --- 🚨 FLEET LOGIC: Status Translation & Cancel Engine ---
  const translateStatus = (status: string, lang: string) => {
    if (!status) return "";
    if (lang === 'fr') {
      if (status.includes('Pending')) return '🔴 En attente';
      if (status.includes('Process')) return '🟡 En cours';
      if (status.includes('Way')) return '🟢 En route';
      if (status.includes('Canceled')) return '⚫ Annulé';
    }
    if (lang === 'ar') {
      if (status.includes('Pending')) return '🔴 قيد الانتظار';
      if (status.includes('Process')) return '🟡 قيد المعالجة';
      if (status.includes('Way')) return '🟢 في الطريق';
      if (status.includes('Canceled')) return '⚫ ملغى';
    }
    return status; // Default English
  };

const submitCancellation = async () => {
    setIsCancelling(true); // Starts the loading animation on your red button
    
    try {
      const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
      const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
      
      // Get the active order ID
      const orderId = activeOrder?.id || localStorage.getItem('fst_active_order_id');

      if (orderId) {
        // Get the exact reason they picked
        const finalReason = cancelReason === "💬 Other..." ? customCancelText : cancelReason;

        // 1. UPDATE AIRTABLE
        await fetch(`https://api.airtable.com/v0/${BASE_ID}/Orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              "Status": "Canceled", // 🚨 Change to "Cancelled" with two L's if that's how it's spelled in Airtable
              "Reason": finalReason
            }
          })
        });
      }

      // 2. CLEAR IT FROM THE APP'S ACTIVE SCREEN
      localStorage.removeItem('fst_active_order_id');
      if (typeof setActiveOrder === 'function') setActiveOrder(null);
      
      // Close the popup
      setShowCancelPopup(false);

      // 3. REFRESH TO SHOW IN HISTORY
      window.location.reload();

    } catch (error) {
      console.error("Cancellation failed:", error);
      alert("Failed to cancel. Please check your connection.");
    } finally {
      setIsCancelling(false);
    }
  };

  // 2. Helper to get 24/7 times with 30-min gaps
  const getAvailableTimes = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      const hour = h.toString().padStart(2, '0');
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    return times;
  };
// 1. Helper to get next 7 days starting from today
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    return dates;
  };

  const availableDates = getAvailableDates();
  const availableTimes = getAvailableTimes();
  
  // 3. Update these existing state lines (or add them if missing)
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(availableTimes[0]);
  const [location, setLocation] = useState<string>('');
  const [locationLabel, setLocationLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [locationNotes, setLocationNotes] = useState('');
  
  // NEW STATE: Tracks when the map is moving
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  
  // Location Coordinates State
  const [locationMode, setLocationMode] = useState<'gps' | 'map'>('gps');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null); 
  const [userGPSLocation, setUserGPSLocation] = useState<{ lat: number; lng: number } | null>(null); 
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  
  const [energyMode, setEnergyMode] = useState<'percent' | 'kwh'>('percent');
  const [energyValue, setEnergyValue] = useState<number>(50);
  const [chargeReason, setChargeReason] = useState('');
  const [chargeNotes, setChargeNotes] = useState('');

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetStep, setSheetStep] = useState<'brand' | 'model' | 'capacity'>('brand');
  const [searchTerm, setSearchTerm] = useState('');
  // CRM State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
// The Nuclear Wiper: Hard resets the entire app instantly
  const resetOrder = () => {
    window.location.reload(); 
  };
  const scrollRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  
  const headerBackground = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.8)"]);
  const headerShadow = useTransform(scrollY, [0, 50], ["none", "0 4px 30px rgba(0,0,0,0.03)"]);
  const headerPadding = useTransform(scrollY, [0, 50], ["3rem", "1rem"]); 
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.7]);
  const logoX = useTransform(scrollY, [0, 50], ["0%", "-35%"]);

  const maxSliderValue = energyMode === 'percent' ? 85 : 150;
  const minSliderValue = 10;
  const batteryCapacity = selectedCapacity || DEFAULT_BATTERY_KWH;
  const estimatedPrice = energyMode === 'kwh' 
    ? energyValue * PRICE_PER_KWH 
    : Math.round((energyValue / 100) * batteryCapacity * PRICE_PER_KWH);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (step === 2) {
      setIsLocating(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const coords = { lat: latitude, lng: longitude };
            setUserGPSLocation(coords);
            if (!locationCoords) {
              setLocationCoords(coords);
            }
            setIsLocating(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            setIsLocating(false);
          }
        );

        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setUserGPSLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => console.error("Watch position error:", error),
          { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
      }
    }
  }, [step]);

const handleConfirm = async () => {
    // 1. ANTI-SPAM LOCK
    if (isSubmitting) return; 
    setIsSubmitting(true); 

    // 2. Calculations (Keeping your exact logic)
    const brand = selectedBrand || '[Brand]';
    const model = selectedModel || '[Model]';
    const capacity = selectedCapacity || DEFAULT_BATTERY_KWH;
    
    const energyInKwh = energyMode === 'percent' 
      ? Math.round((energyValue / 100) * capacity) 
      : energyValue;
      
    const energyDisplay = energyMode === 'percent' 
      ? `${energyValue}% (${energyInKwh} kWh)` 
      : `${energyValue} kWh`;

    const mapsLink = locationCoords 
      ? `https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}`
      : 'Location not provided';

    // 3. Your Premium WhatsApp Message Template
    const whatsappMessage = `New FST Charge Request ⚡

📍 Location: ${locationMode === 'gps' ? 'GPS Location' : 'Pinned Location'} ${mapsLink}
📝 Loc Notes: ${locationNotes || " "}

🚗 Vehicle: ${brand} ${model} (${capacity} kWh)
🔋 Energy: ${energyDisplay}
💰 Est. Price: ${estimatedPrice} DH + delivery fees

📅 Time: ${selectedDate} @ ${selectedTime}
📝 Notes: ${chargeNotes || " "}
❓ Reason: ${chargeReason || "Convenience"}`;
if (!customerName || !customerPhone) {
      alert("🚨 Please enter your Name and WhatsApp Number so we can dispatch the truck!");
      setIsSubmitting(false);
      return;
    }
    try {
      // 1. The Date Translator: Converts friendly text into strict YYYY-MM-DD for Airtable Robot
      const dayIndex = availableDates.indexOf(selectedDate);
      const targetDate = new Date();
      if (dayIndex > 0) {
        targetDate.setDate(targetDate.getDate() + dayIndex);
      }
      const strictDate = targetDate.toISOString().split('T')[0];

      // 2. Data Payload
      const orderData = {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        status: "🔴 Pending",
        date: strictDate,     // <--- Uses the strictDate calculated above!
        time_only: selectedTime,
        location: mapsLink,
        location_notes: locationNotes || "None",
        vehicle: `${brand} ${model} (${capacity} kWh)`,
        energy: energyDisplay,
        price: `${estimatedPrice} DH + delivery fees`,
        time: `${selectedDate} @ ${selectedTime}`,
        notes: chargeNotes || "None",
        reason: chargeReason || "Convenience"
      };

      // --- 3. Direct Airtable Connection (Vite-Ready) ---
    const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY; 
    const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: {
            "Name": orderData.name,
            "Phone": orderData.phone,
            "Email": orderData.email,
            "Status": orderData.status,
            "Date": orderData.date,
            "Time": orderData.time_only,
            "Vehicle": orderData.vehicle,
            "Location": orderData.location,
            "Loc Notes": orderData.location_notes,
            "Energy": orderData.energy,
            "Price": orderData.price,
            "Notes": orderData.notes,
            "Reason": orderData.reason, // 🚨 ADD THIS COMMA AT THE END!
            "Plate": plateNumber || "NOT PROVIDED" 
          }
        }],
        typecast: true 
      })
    });

    if (response.ok) {
      const airtableResult = await response.json();
      const responseData = { recordId: airtableResult.records[0].id };

      // --- 4. Success UI Actions ---
      setShowApproved(true);

      setTimeout(() => {
        setShowApproved(false);
        setStep(1); 
        const encodedMsg = encodeURIComponent(whatsappMessage);
        window.location.href = `https://wa.me/212666126924?text=${encodedMsg}`;
        
        setTimeout(() => window.location.reload(), 1000);
      }, 1000);

    } else {
      const errorText = await response.text();
      console.error("Airtable Rejection:", errorText);
      alert("❌ Error connecting to Command Center. Airtable rejected the data.");
    }
  } catch (error) {
    console.error("Vault Error:", error);
    alert("❌ Connection failed.");
  } finally {
    setIsSubmitting(false);
  }
};

  const openVehicleSheet = () => {
    setSheetStep('brand');
    setSearchTerm('');
    setIsSheetOpen(true);
  };
  return (
    <div className="min-h-screen w-full bg-[#f0f0f0] flex justify-center font-sans selection:bg-[#B5F573] selection:text-[#1C1C1E]">
      {/* UPDATED: Removed max-w-[430px] to allow full-screen on Z-Fold */}
      <div className="flex flex-col h-[100dvh] w-full bg-[#FFFFFF] text-[#1C1C1E] relative shadow-2xl overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* NEW UNIFIED SPLASH SCREEN (SIGNATURE BRAND COLOR) */}
        <AnimatePresence>
          {!isAppReady && (
            <motion.div 
              key="splash"
              // Uses signature FST Lime Green: #B5F573
              className="fixed inset-0 z-[9999] bg-[#B5F573] flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* The Bold Black Lightning Bolt */}
              <svg 
                width="140" 
                height="140" 
                viewBox="0 0 24 24" 
                fill="black" 
                xmlns="http://www.w3.org/2000/svg"
                className="animate-pulse"
              >
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
        {/* SUCCESS / APPROVED OVERLAY */}
        <AnimatePresence>
          {showApproved && (
            <motion.div 
              key="approved"
              // Heavy glass blur behind the popup remains!
              className="fixed inset-0 z-[9999] bg-white/30 backdrop-blur-xl flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Box is now TRANSPARENT, no green background, no shadow */}
              <div className="bg-transparent p-10 flex flex-col items-center text-center max-w-sm mx-4 transform transition-all scale-100">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-6">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="7 12 10.5 15.5 17.5 8.5"></polyline>
                </svg>
                {/* Changed text to Successfully */}
                <h2 className="text-4xl font-black text-black mb-2 uppercase tracking-tighter">Successfully</h2>
                <p className="text-black/80 font-bold text-lg leading-tight">Redirecting to WhatsApp...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* CANCELLATION REASON MODAL */}
        <AnimatePresence>
          {orderToCancel && (
            <motion.div 
              key="cancel-modal"
              className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white w-full md:max-w-md rounded-t-[40px] p-6 pb-12 md:rounded-[40px] md:mb-10 shadow-2xl"
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0" />
                <h3 className="text-2xl font-black text-[#1C1C1E] mb-2 uppercase tracking-tight">Cancel Dispatch</h3>
                <p className="text-gray-500 font-medium mb-6">Please tell us why you are cancelling:</p>
                
                <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto px-1 pb-2">
                  {[
                    "⏱️ The wait time is too long",
                    "🔌 I found another charging station",
                    "🚗 My plans changed",
                    "❌ I ordered by mistake",
                    "💬 Other..."
                  ].map((reason, idx) => (
                    <div key={idx}>
                      <button
                        onClick={() => setCancelReason(reason)}
                        className={`w-full text-left p-4 rounded-2xl border-2 font-bold transition-all ${cancelReason === reason ? 'border-[#1C1C1E] bg-gray-50 text-[#1C1C1E]' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                      >
                        {reason}
                      </button>
                      
                      {/* 🚨 NEW: The hidden text box that appears for "Other..." */}
                      {reason === "💬 Other..." && cancelReason === "💬 Other..." && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          className="mt-3"
                        >
                          <textarea
                            value={customCancelText}
                            onChange={(e) => setCustomCancelText(e.target.value)}
                            placeholder="Please explain the reason..."
                            className="w-full p-4 rounded-2xl border-2 border-[#1C1C1E] bg-gray-50 text-[#1C1C1E] font-medium focus:outline-none focus:ring-2 focus:ring-[#B5F573] resize-none h-24"
                          />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setOrderToCancel(null); setCancelReason(""); setCustomCancelText(""); }}
                    className="flex-1 py-4 rounded-2xl bg-gray-100 text-[#1C1C1E] font-bold active:bg-gray-200"
                  >
                    Back
                  </button>
                  <button 
                    onClick={submitCancellation}
                    // 🚨 NEW: Disables the button if they chose "Other" but haven't typed anything yet!
                    disabled={!cancelReason || (cancelReason === "💬 Other..." && customCancelText.trim() === "") || isCancelling}
                    className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold disabled:opacity-50 disabled:bg-red-300 active:bg-red-600 flex justify-center items-center"
                  >
                    {isCancelling ? (
                      <span className="animate-pulse">Cancelling...</span>
                    ) : (
                      "Confirm Cancel"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Sticky Header */}
        {step !== 2 && (
          <motion.header 
            style={{ 
              backgroundColor: headerBackground, 
              boxShadow: headerShadow,
              paddingTop: step === 1 ? headerPadding : '1rem',
              paddingBottom: '0.75rem'
            }}
            className="sticky top-0 left-0 w-full px-6 flex justify-between items-center z-40 backdrop-blur-xl transition-all"
          >
            {step > 1 ? (
              <div className="flex items-center gap-2">
                <BackButton onClick={() => setStep(step - 1)} />
                <FstLogo small />
              </div>
            ) : (
              <motion.div 
                className="w-full flex justify-center relative"
                style={{ x: logoX, scale: logoScale, originX: 0.5 }}
              >
                <FstLogo />
              </motion.div>
            )}
            
            <div className="absolute right-6 flex items-center gap-3">
              <motion.button 
                onClick={() => setLanguage(l => l === 'en' ? 'fr' : l === 'fr' ? 'ar' : 'en')}
                className="bg-[#F5F5F7]/80 backdrop-blur-md p-2.5 rounded-full ios-shadow border border-white/50 flex items-center justify-center w-10 h-10"
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xs font-bold uppercase">{language}</span>
              </motion.button>
              
              <motion.button 
                onClick={() => setIsSettingsOpen(true)}
                className="bg-[#F5F5F7]/80 backdrop-blur-md p-2.5 rounded-full ios-shadow border border-white/50"
                whileTap={{ scale: 0.9 }}
              >
                <Menu size={20} className="text-[#1C1C1E]" />
              </motion.button>
            </div>
          </motion.header>
        )}

        <main ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-48 pt-4 scroll-smooth scrollbar-hide">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: HOME */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 pt-4 md:max-w-2xl md:mx-auto"
              >
                {/* 🔴 LIVE ORDER TRACKER CARDS (Swipeable Fleet List) */}
          {activeOrders.length > 0 && (
            <div className="w-full flex overflow-x-auto gap-4 pb-6 mb-2 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {activeOrders.slice(0, 3).map((order, index) => (
                <div key={index} className="min-w-[90%] md:min-w-[320px] bg-[#1C1C1E] text-white rounded-3xl p-5 shadow-2xl border border-gray-800 snap-center shrink-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg text-[#B5F573]">
                        {language === 'fr' ? 'Ma Commande FST' : language === 'ar' ? 'طلبي من FST' : 'My FST Dispatch'}
                      </h3>
                      <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold truncate max-w-[120px]">
                        {translateStatus(order.status, language)}
                      </span>
                    </div>
                    <p className="text-gray-400 font-medium mb-1">{order.vehicle}</p>
                    <p className="text-white font-bold mb-4">{order.date} • {order.energy}</p>
                  </div>
                  
                  {/* Cancel Button - Only shows if the order is still active! */}
                  {!order.status.includes('Canceled') && !order.status.includes('Annulé') && (
                    <button 
                      onClick={() => setOrderToCancel(order)}
                      className="w-full py-3 mt-auto rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 active:bg-red-500/20 transition-colors text-sm uppercase tracking-wide"
                    >
                      {language === 'fr' ? 'Annuler la commande' : language === 'ar' ? 'إلغاء الطلب' : 'Cancel Dispatch'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
                <div>
                  <h1 className="text-3xl font-black text-[#1C1C1E] tracking-tight">{t.welcome}</h1>
                  <p className="text-lg text-[#8E8E93] font-medium">{t.letsGetCharging}</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] group-focus-within:text-[#B5F573] transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-[#F5F5F7] rounded-2xl py-4 pl-12 pr-4 font-medium text-[#1C1C1E] placeholder:text-[#8E8E93] outline-none focus:ring-2 focus:ring-[#B5F573]/50 transition-all shadow-sm focus:shadow-md"
                      onFocus={() => setStep(2)}
                    />
                  </div>
                  
                  <button 
                    onClick={() => { setLocation('Current Location'); setStep(2); }}
                    className="flex items-center gap-3 text-[#1C1C1E] font-bold px-2 hover:opacity-70 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#B5F573]/20 flex items-center justify-center">
                      <MapPin size={16} className="text-[#1C1C1E]" />
                    </div>
                    {t.useCurrentLocation}
                  </button>
                </div>
{/* 📲 Download App Banner */}
        <button
          onClick={handleInstallClick}
          className="pwa-hide w-full bg-[#1C1C1E] rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-transform border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B5F573]/20 flex items-center justify-center">
              <Smartphone size={20} className="text-[#B5F573]" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-sm">Download FST SERVE</h3>
              <p className="text-[#8E8E93] text-xs">Add to your home screen</p>
            </div>
          </div>
          <div className="bg-[#B5F573] text-[#1C1C1E] text-xs font-black px-4 py-2 rounded-full shadow-sm">
            INSTALL
          </div>
        </button>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[#1C1C1E]">{t.savedAddresses}</h3>
                    <button className="text-[#00C853] font-bold text-sm flex items-center gap-1 hover:opacity-70 transition-opacity">
                      {t.addNew} <Plus size={14} />
                    </button>
                  </div>
                  <div className="py-8 text-center text-[#8E8E93] text-sm bg-[#F5F5F7]/50 rounded-2xl border border-dashed border-[#8E8E93]/20">
                    {t.noSavedAddresses}
                  </div>
                </div>

                <div className="bg-[#1C1C1E] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-[#B5F573]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
<div onClick={() => setShowHistoryModal(true)} className="flex justify-between items-center mb-4 relative z-10 cursor-pointer">
  <div className="flex items-center gap-2">
    <History size={18} className="text-[#B5F573]" />
                      <span className="font-bold">{t.chargeHistory}</span>
                    </div>
                    <ChevronRight size={18} className="text-[#8E8E93]" />
                  </div>
                  <div className="bg-[#B5F573] rounded-xl p-4 text-[#1C1C1E] relative z-10 shadow-sm">
                    <h4 className="font-bold text-sm">{t.noUpcomingCharges}</h4>
                    <p className="text-xs opacity-80">{t.noUpcomingChargesDesc}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: LOCATION DETAILS */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col"
              >
                {/* Top Map Area */}
                <div className="relative w-full h-full z-0">
                  <div className="absolute top-6 left-6 z-[500] bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm flex items-center gap-3">
                    <BackButton onClick={() => setStep(1)} />
                    <FstLogo small />
                  </div>

                  <MapContainer 
                    center={locationCoords ? [locationCoords.lat, locationCoords.lng] : [33.5731, -7.5898]} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='© <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <TapToPinMarker locationCoords={locationCoords} setLocationCoords={setLocationCoords} />
                    <AutoLocate setLocationCoords={setLocationCoords} />
                    {userGPSLocation && (
                      <Marker position={[userGPSLocation.lat, userGPSLocation.lng]} icon={userLocationIcon} />
                    )}

                    {/* UPDATED: Pass dragging state */}
                    <MapEvents 
                      onMoveEnd={(lat, lng) => setLocationCoords({ lat, lng })} 
                      setIsDraggingMap={setIsDraggingMap} 
                    />
                    
                    {/* UPDATED: Smart Floating Map Controls */}
                    <MapControls userLocation={userGPSLocation} isDraggingMap={isDraggingMap} />
                  </MapContainer>
                  
                  {isLocating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[600] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-[#B5F573] border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold text-[#1C1C1E] text-sm">{t.locating}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* UPDATED: Smart Sliding Bottom Sheet */}
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: isDraggingMap ? '100%' : '0%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute bottom-0 w-full h-[45vh] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[500] flex flex-col overflow-hidden md:max-w-2xl md:left-1/2 md:-translate-x-1/2"
                >
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-2 shrink-0" />
                  
                  <div className="flex-1 overflow-y-auto px-6 pb-24 pt-2 space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-[#1C1C1E]">{t.confirmLocation}</h2>
                      <p className="text-sm text-[#8E8E93]">{t.dragMap}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-[#1C1C1E]">{t.addNotes}</h3>
                      <textarea 
                        placeholder={t.addNotesPlaceholder}
                        className="w-full bg-[#F5F5F7] rounded-2xl p-4 h-24 resize-none font-medium text-[#1C1C1E] placeholder:text-[#8E8E93] outline-none focus:ring-2 focus:ring-[#B5F573]/50"
                        value={locationNotes}
                        onChange={(e) => setLocationNotes(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-[#1C1C1E]">{t.label}</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: t.other, icon: MoreHorizontal, value: 'Other' },
                          { label: t.work, icon: Briefcase, value: 'Work' },
                          { label: t.home, icon: Home, value: 'Home' }
                        ].map((item) => (
                          <button
                            key={item.value}
                            onClick={() => setLocationLabel(item.value as any)}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all ${
                              locationLabel === item.value 
                                ? 'bg-[#B5F573] text-[#1C1C1E] shadow-md' 
                                : 'bg-[#F5F5F7] text-[#8E8E93]'
                            }`}
                          >
                            <item.icon size={20} />
                            <span className="font-bold text-xs">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-6 bg-white/90 backdrop-blur border-t border-gray-100">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setStep(3)}
                      disabled={!locationCoords}
                      className={`w-full font-bold text-[17px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all ${
                        locationCoords ? 'bg-[#1C1C1E] text-white' : 'bg-[#F5F5F7] text-[#8E8E93]'
                      }`}
                    >
                      {t.confirmLocation}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* STEP 3: ENERGY & VEHICLE */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 md:max-w-2xl md:mx-auto"
              >
                <section className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#8E8E93] ml-1">{t.vehicle}</h2>
                  <button 
                    onClick={openVehicleSheet}
                    className="w-full bg-[#F5F5F7] rounded-2xl p-4 flex justify-between items-center active:scale-[0.98] transition-transform"
                  >
                    <div className="flex flex-col items-start">
                      {selectedBrand && selectedModel ? (
                        <>
                          <span className="text-lg font-bold text-[#1C1C1E]">{selectedModel}</span>
                          <span className="text-xs font-medium text-[#8E8E93]">
                            {selectedBrand} {selectedCapacity ? `• ${selectedCapacity} kWh` : ''}
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-semibold text-[#8E8E93]">{t.selectBrandModel}</span>
                      )}
                    </div>
                    <ChevronRight className="text-[#8E8E93]" size={20} />
                  </button>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-between items-center ml-1">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#8E8E93]">{t.amount}</h2>
                    <div className="flex bg-[#F5F5F7] rounded-full p-1 shadow-inner">
                      <button 
                        onClick={() => setEnergyMode('percent')}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                          energyMode === 'percent' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#8E8E93]'
                        }`}
                      >
                        %
                      </button>
                      <button 
                        onClick={() => setEnergyMode('kwh')}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                          energyMode === 'kwh' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#8E8E93]'
                        }`}
                      >
                        kWh
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#F5F5F7] rounded-3xl p-8 flex flex-col items-center gap-8 relative overflow-hidden border border-white/50 shadow-sm">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#B5F573]/20 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="flex items-baseline gap-1 relative z-10">
                      <span className="text-7xl font-black text-[#1C1C1E] tracking-tighter tabular-nums drop-shadow-sm">{energyValue}</span>
                      <span className="text-2xl font-bold text-[#8E8E93]">
                        {energyMode === 'percent' ? '%' : 'kWh'}
                      </span>
                    </div>

                    <div className="w-full relative px-2 py-4">
                      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 h-full pointer-events-none flex justify-between items-center z-0 px-1">
                        {Array.from({ length: Math.floor((maxSliderValue - minSliderValue) / 5) + 1 }).map((_, i) => {
                          const val = minSliderValue + (i * 5);
                          const isMajor = val % 10 === 0;
                          return (
                            <div 
                              key={i} 
                              className={`w-[1px] rounded-full transition-colors ${isMajor ? 'h-4 bg-[#1C1C1E]/30' : 'h-2 bg-[#1C1C1E]/10'}`} 
                              style={{ 
                                left: `${((val - minSliderValue) / (maxSliderValue - minSliderValue)) * 100}%`,
                                position: 'absolute'
                              }}
                            />
                          );
                        })}
                      </div>

                      <div 
                        className="absolute top-1/2 -translate-y-1/2 left-2 h-[16px] bg-[#B5F573] rounded-full pointer-events-none z-0 transition-all duration-75 ease-out shadow-[0_0_15px_rgba(181,245,115,0.5)]"
                        style={{ width: `calc(${((energyValue - minSliderValue) / (maxSliderValue - minSliderValue)) * 100}% - 16px)` }}
                      />
                      
                      <input 
                        type="range" 
                        min={minSliderValue} 
                        max={maxSliderValue} 
                        step={1}
                        value={energyValue}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEnergyValue(val);
                          if (val % 5 === 0 && navigator.vibrate) navigator.vibrate(10);
                        }}
                        className="ios-slider relative z-10 h-12"
                      />
                    </div>
                    {energyMode === 'percent' && (
                      <p className="text-[10px] text-[#8E8E93] text-center max-w-[200px] font-medium bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        {t.safetyLimit}
                      </p>
                    )}
                  </div>
                </section>

                <div className="space-y-2">
                  <h3 className="font-bold text-[#1C1C1E] text-sm ml-1">{t.whyFst}</h3>
                  <div className="relative group">
                    <select 
                      className="w-full bg-[#F5F5F7] rounded-2xl p-4 font-medium text-[#1C1C1E] outline-none appearance-none focus:ring-2 focus:ring-[#B5F573]/50 transition-all"
                      value={chargeReason}
                      onChange={(e) => setChargeReason(e.target.value)}
                    >
                      <option value="" disabled>{t.selectReason}</option>
                      <option value="No charger at home">{t.reasonNoCharger}</option>
                      <option value="Emergency/Empty battery">{t.reasonEmergency}</option>
                      <option value="Convenience">{t.reasonConvenience}</option>
                      <option value="Other">{t.reasonOther}</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#8E8E93] group-focus-within:text-[#B5F573] transition-colors" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-[#1C1C1E] text-sm ml-1">{t.deliveryNotes}</h3>
                  <input 
                    type="text"
                    placeholder={t.deliveryNotesPlaceholder}
                    className="w-full bg-[#F5F5F7] rounded-2xl p-4 font-medium text-[#1C1C1E] placeholder:text-[#8E8E93] outline-none focus:ring-2 focus:ring-[#B5F573]/50 transition-all"
                    value={chargeNotes}
                    onChange={(e) => setChargeNotes(e.target.value)}
                  />
                </div>
              </motion.div>
            )}

           {/* STEP 4: SCHEDULE */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 md:max-w-2xl md:mx-auto"
              >
                {/* 🚨 URGENT DISPATCH BUTTON */}
<button
  onClick={() => {
    setSelectedDate('Today');
    setSelectedTime('ASAP (Urgent Dispatch)');
    setStep(5); // Skips immediately to the final review screen!
  }}
  className="w-full bg-[#FF3B30] text-white font-bold py-5 rounded-2xl mb-8 shadow-[0_4px_20px_rgba(255,59,48,0.4)] flex justify-center items-center gap-2 transition-all active:scale-95"
>
  <span className="text-2xl animate-pulse">🚨</span>
  <span>URGENT - SEND TRUCK NOW</span>
</button>

<div className="w-full h-[1px] bg-gray-200 mb-8 relative">
  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F5F7] px-4 text-xs font-bold text-gray-400">OR SCHEDULE FOR LATER</span>
</div>
                <div className="space-y-4">
                  <h3 className="font-bold text-[#1C1C1E]">{t.selectDate}</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all ${
                          selectedDate === date 
                            ? 'border-[#B5F573] bg-[#B5F573]/10 text-[#1C1C1E] font-bold' 
                            : 'border-transparent bg-[#F5F5F7] text-[#8E8E93]'
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-[#1C1C1E]">{t.selectTime}</h3>
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {availableTimes.filter(time => {
                      if (selectedDate !== availableDates[0]) return true;
                      const now = new Date();
                      const timeInMins = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                      const nowInMins = now.getHours() * 60 + now.getMinutes();
                      return timeInMins > (nowInMins + 30);
                    }).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl border-2 text-[14px] font-medium transition-all ${
                          selectedTime === time
                            ? 'border-[#B5F573] bg-[#1C1C1E] text-white'
                            : 'border-transparent bg-[#F5F5F7] text-[#8E8E93]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVIEW */}
            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 md:max-w-2xl md:mx-auto pb-32"
              >
                <div className="bg-[#F5F5F7] rounded-3xl p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#B5F573]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  
                  <div>
                    <h2 className="text-2xl font-black text-[#1C1C1E] mb-1">{t.review}</h2>
                    <p className="text-[#8E8E93] text-sm">{t.confirmDetails}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                        <MapPin size={16} className="text-[#1C1C1E]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#8E8E93] uppercase">{t.location}</p>
                        <p className="font-bold text-[#1C1C1E]">{location}</p>
                        <p className="text-xs text-[#8E8E93]">{locationLabel} • {locationNotes}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                        <Zap size={16} className="text-[#1C1C1E]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#8E8E93] uppercase">{t.charge}</p>
                        <p className="font-bold text-[#1C1C1E]">{energyValue}{energyMode === 'percent' ? '%' : ' kWh'}</p>
                        <p className="text-xs text-[#8E8E93]">{selectedBrand} {selectedModel} {selectedCapacity ? `(${selectedCapacity} kWh)` : ''}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                        <Clock size={16} className="text-[#1C1C1E]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#8E8E93] uppercase">{t.time}</p>
                        <p className="font-bold text-[#1C1C1E]">{selectedDate}</p>
                        <p className="text-xs text-[#8E8E93]">{selectedTime || 'ASAP'}</p>
                      </div>
                    </div>
                    {/* 🚨 NEW: Plate Number in Review */}
<div className="flex items-start gap-3 mt-4">
  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
  </div>
  <div>
    <p className="text-xs font-bold text-[#8E8E93] uppercase">Plate Number</p>
    <p className="font-bold text-[#1C1C1E]">{plateNumber || 'Not Provided'}</p>
  </div>
</div>
                  </div>
                  {/* CRM CAPTURE FORM */}
            <div className="space-y-3 mt-6 mb-6 bg-[#F5F5F7] p-5 rounded-2xl border border-gray-200">
              <h3 className="font-bold text-[#1C1C1E] mb-2">Contact Details</h3>
              <input
                type="text"
                placeholder="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-transparent focus:border-[#B5F573] focus:bg-white bg-white outline-none transition-all font-medium text-[#1C1C1E]"
              />
              <input
                type="tel"
                placeholder="WhatsApp Number *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-transparent focus:border-[#B5F573] focus:bg-white bg-white outline-none transition-all font-medium text-[#1C1C1E]"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-transparent focus:border-[#B5F573] focus:bg-white bg-white outline-none transition-all font-medium text-[#1C1C1E]"
              />
              <input 
  type="text"
  placeholder="Plate Number (Optional)"
  value={plateNumber}
  onChange={(e) => setPlateNumber(e.target.value)}
  className="w-full p-4 rounded-xl border-2 border-transparent focus:border-[#B5F573] focus:bg-white bg-white outline-none transition-all font-medium text-[#1C1C1E] mt-3"
/>
            </div>

                  <div className="pt-6 border-t border-[#1C1C1E]/5 flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-[#8E8E93] uppercase">{t.totalEstimated}</p>
                      <p className="text-3xl font-black text-[#1C1C1E]">{estimatedPrice} <span className="text-sm font-bold text-[#8E8E93]">{t.dh}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#8E8E93]">{t.rate}</p>
                      <p className="font-bold text-[#1C1C1E]">{t.ratePerKwh}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          {/* 🚨 This invisible spacer creates the white gap you want */}
  <div className="h-40 w-full shrink-0"></div>
        </main>

        {/* Bottom Action Button - FIXED VERSION */}
{step !== 2 && (
  <footer className="fixed bottom-0 left-0 w-full px-6 pb-10 pt-4 bg-white/90 backdrop-blur-xl border-t border-[#F5F5F7] z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
    {step === 3 && (
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          if (!selectedBrand) {
            openVehicleSheet();
            return;
          }
          setStep(4);
        }}
        className="w-full md:max-w-2xl md:mx-auto bg-[#1C1C1E] text-white font-bold text-[17px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
      >
        {t.nextStep}
      </motion.button>
    )}

    {step === 4 && (
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setStep(5)}
        disabled={!selectedTime}
        className={`w-full md:max-w-2xl md:mx-auto font-bold text-[17px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all ${
          selectedTime ? 'bg-[#1C1C1E] text-white' : 'bg-[#F5F5F7] text-[#8E8E93]'
        }`}
      >
        {t.reviewBooking}
      </motion.button>
    )}

    {step === 5 && (
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleConfirm}
        disabled={!locationCoords || isSubmitting}
        className={`w-full md:max-w-2xl md:mx-auto font-bold text-[17px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(181,245,115,0.4)] transition-all ${
          locationCoords ? 'bg-[#B5F573] text-[#1C1C1E]' : 'bg-[#F5F5F7] text-[#8E8E93]'
        }`}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-[#1C1C1E] border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <CheckCircle2 size={20} />
        )}
        {isSubmitting ? "Processing..." : t.requestCharge}
      </motion.button>
    )}
  </footer>
)}

        {/* Vehicle Bottom Sheet */}
        <AnimatePresence>
          {isSheetOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSheetOpen(false)}
                className="absolute inset-0 bg-black/40 z-50"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 w-full md:max-w-2xl md:left-1/2 md:-translate-x-1/2 h-[80%] bg-white rounded-t-3xl z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
              >
                <div className="flex justify-between items-center p-6 border-b border-[#F5F5F7]">
                  {sheetStep !== 'brand' ? (
                    <button onClick={() => {
                      setSheetStep(sheetStep === 'capacity' ? 'model' : 'brand');
                      setSearchTerm('');
                    }} className="text-[#8E8E93] font-medium flex items-center">
                      <ChevronLeft size={20} /> {t.back}
                    </button>
                  ) : <div className="w-16" />}
                  <h3 className="text-lg font-bold text-[#1C1C1E]">
                    {sheetStep === 'brand' ? t.selectBrand : sheetStep === 'model' ? selectedBrand : t.capacity}
                  </h3>
                  <button onClick={() => setIsSheetOpen(false)} className="w-16 flex justify-end">
                    <div className="bg-[#F5F5F7] rounded-full p-1.5">
                      <X size={20} className="text-[#8E8E93]" />
                    </div>
                  </button>
                </div>

                {(sheetStep === 'brand' || sheetStep === 'model') && (
                  <div className="px-6 pt-4 pb-2">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93] group-focus-within:text-[#B5F573] transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder={sheetStep === 'brand' ? t.searchBrand : t.searchModel}
                        className="w-full bg-[#F5F5F7] rounded-xl py-3 pl-11 pr-4 font-medium text-[#1C1C1E] placeholder:text-[#8E8E93] outline-none focus:ring-2 focus:ring-[#B5F573]/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4">
                  {sheetStep === 'brand' && (
                    <div className="grid grid-cols-1 gap-2">
                      {Object.keys(evDatabase)
                        .filter(brand => brand.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((brand) => (
                        <button
                          key={brand}
                          onClick={() => { setSelectedBrand(brand); setSheetStep('model'); setSearchTerm(''); }}
                          className="w-full text-left p-4 rounded-xl hover:bg-[#F5F5F7] transition-colors font-semibold text-[17px] text-[#1C1C1E] flex justify-between items-center"
                        >
                          {brand}
                          <ChevronRight size={20} className="text-[#8E8E93]" />
                        </button>
                      ))}
                      {Object.keys(evDatabase).filter(brand => brand.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div className="text-center py-8 text-[#8E8E93]">{t.noBrandsFound}</div>
                      )}
                    </div>
                  )}
                  {sheetStep === 'model' && selectedBrand && (
                    <div className="grid grid-cols-1 gap-2">
                      {evDatabase[selectedBrand]
                        .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((model) => (
                        <button
                          key={model.name}
                          onClick={() => {
                            setSelectedModel(model.name);
                            if (model.capacities.length > 1) {
                              setSheetStep('capacity');
                            } else {
                              setSelectedCapacity(model.capacities[0]);
                              setIsSheetOpen(false);
                            }
                            setSearchTerm('');
                          }}
                          className="w-full text-left p-4 rounded-xl hover:bg-[#F5F5F7] transition-colors font-semibold text-[17px] text-[#1C1C1E] flex justify-between items-center"
                        >
                          <span>{model.name}</span>
                          <ChevronRight size={20} className="text-[#8E8E93]" />
                        </button>
                      ))}
                      {evDatabase[selectedBrand].filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div className="text-center py-8 text-[#8E8E93]">{t.noModelsFound}</div>
                      )}
                    </div>
                  )}
                  {sheetStep === 'capacity' && selectedBrand && selectedModel && (
                    <div className="grid grid-cols-1 gap-2">
                      {evDatabase[selectedBrand].find(m => m.name === selectedModel)?.capacities.map((cap) => (
                        <button
                          key={cap}
                          onClick={() => { setSelectedCapacity(cap); setIsSheetOpen(false); }}
                          className="w-full text-left p-4 rounded-xl hover:bg-[#F5F5F7] transition-colors font-semibold text-[17px] text-[#1C1C1E] flex justify-between items-center"
                        >
                          <span>{cap} kWh</span>
                          <CheckCircle2 size={20} className="text-[#B5F573] opacity-0 hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Settings Menu Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSettingsOpen(false)}
                className="absolute inset-0 bg-[#1C1C1E]/20 backdrop-blur-sm z-50"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 w-[85%] md:w-[400px] h-full bg-[#F5F5F7]/95 backdrop-blur-3xl z-50 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.1)] border-l border-white/50"
              >
                <div className="pt-14 pb-6 px-6 flex justify-between items-center border-b border-[#1C1C1E]/5">
                  <h2 className="text-xl font-black tracking-tight text-[#1C1C1E]">{t.settings}</h2>
                  <button onClick={() => setIsSettingsOpen(false)} className="bg-white p-2 rounded-full ios-shadow">
                    <X size={20} className="text-[#1C1C1E]" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                  <div className="bg-white rounded-2xl p-4 flex items-center gap-4 ios-shadow border border-white/60">
                    <div className="w-12 h-12 rounded-full bg-[#B5F573]/20 flex items-center justify-center">
                      <User size={24} className="text-[#1C1C1E]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1C1C1E]">{t.guestUser}</h3>
                      <p className="text-xs text-[#8E8E93] font-medium">{t.manageProfile}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl ios-shadow border border-white/60 overflow-hidden">
                    {[
                      { icon: Zap, label: t.ourTech },
                      { icon: ShieldCheck, label: t.whyUs },
                      { icon: Info, label: t.aboutUs },
                    ].map((item, i) => (
                      <button key={i} className="w-full p-4 flex items-center justify-between border-b border-[#F5F5F7] last:border-0 hover:bg-[#F5F5F7]/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className="text-[#B5F573]" />
                          <span className="font-semibold text-[#1C1C1E] text-[15px]">{item.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-[#8E8E93]" />
                      </button>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl ios-shadow border border-white/60 overflow-hidden">
                    {[
                      { icon: HelpCircle, label: t.needHelp },
                      { icon: MessageSquare, label: t.contactUs },
                    ].map((item, i) => (
                      <button key={i} className="w-full p-4 flex items-center justify-between border-b border-[#F5F5F7] last:border-0 hover:bg-[#F5F5F7]/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className="text-[#8E8E93]" />
                          <span className="font-semibold text-[#1C1C1E] text-[15px]">{item.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-[#8E8E93]" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 pb-12">
                  <button className="w-full py-4 rounded-xl bg-white text-red-500 font-bold text-[15px] ios-shadow border border-white/60 flex items-center justify-center gap-2">
                    <LogOut size={18} />
                    {t.signOut}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
{/* Premium Install Instructions (For iOS & Android Fallback) */}
        <AnimatePresence>
          {showIOSPrompt && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowIOSPrompt(false)}
                className="absolute inset-0 bg-black/60 z-[600] backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] z-[601] p-6 pb-12 flex flex-col items-center text-center shadow-2xl md:max-w-2xl md:left-1/2 md:-translate-x-1/2"
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6 shrink-0" />
                <img src="/logo.png" alt="FST SERVE" className="w-16 h-16 bg-[#1C1C1E] rounded-2xl shadow-lg mb-4 object-contain p-2" />
                <h3 className="text-xl font-black text-[#1C1C1E] mb-2">Install FST SERVE</h3>
                <p className="text-[#8E8E93] text-sm mb-6 px-4">Add this app to your home screen for quick access and a full-screen experience.</p>
                
                <div className="w-full bg-[#F5F5F7] rounded-2xl p-4 flex items-center gap-4 mb-3 border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Upload size={20} className="text-blue-500" />
                  </div>
                  <p className="text-sm text-left text-[#1C1C1E] font-medium">1. Tap the <strong className="text-blue-500">Share</strong> or <strong className="text-[#1C1C1E]">Menu</strong> icon.</p>
                </div>

                <div className="w-full bg-[#F5F5F7] rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <PlusSquare size={20} className="text-[#1C1C1E]" />
                  </div>
                  <p className="text-sm text-left text-[#1C1C1E] font-medium">2. Tap <strong className="text-[#1C1C1E]">Add to Home Screen</strong> or <strong className="text-[#1C1C1E]">Install App</strong>.</p>
                </div>
                
                <button 
                  onClick={() => setShowIOSPrompt(false)}
                  className="mt-6 font-bold text-[#1C1C1E] bg-[#F5F5F7] px-8 py-3 rounded-full active:scale-95 transition-transform"
                >
                  Got it
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* 🚨 FULL CHARGE HISTORY MODAL */}
        <AnimatePresence>
          {showHistoryModal && (
            <motion.div 
              key="history-modal"
              className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-[#F5F5F7] w-full h-[85vh] md:max-w-md rounded-t-[40px] p-6 pb-12 flex flex-col shadow-2xl"
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 shrink-0" />
                
                <div className="flex justify-between items-center mb-6 px-2">
                  <h3 className="text-2xl font-black text-[#1C1C1E] uppercase tracking-tight">All Charges</h3>
                  <button 
                    onClick={() => setShowHistoryModal(false)}
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-gray-600 active:bg-gray-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 px-2 pb-4">
                  {activeOrders.length === 0 ? (
                    <div className="text-center mt-10">
                      <p className="text-gray-500 font-medium">No past charges found.</p>
                    </div>
                  ) : (
                    activeOrders.map((order, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-[24px] flex flex-col gap-3 shadow-sm border border-gray-100">
                         <div className="flex justify-between items-start">
                            <span className="font-bold text-[#1C1C1E] text-lg">{order.vehicle}</span>
                            <span className="text-xs font-bold px-3 py-1.5 bg-gray-100 text-[#1C1C1E] rounded-xl">
                              {order.status}
                            </span>
                         </div>
                         <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                            <span className="flex items-center gap-1">⏱️ {order.date}</span>
                            <span className="flex items-center gap-1">⚡ {order.energy}</span>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
