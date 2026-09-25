"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "mr";

export interface Translations {
  // Common / Navigation
  brand: string;
  careTeamPortal: string;
  home: string;
  chat: string;
  voice: string;
  breathe: string;
  ground: string;
  more: string;
  legalAid: string;
  witnessProtection: string;
  myProgress: string;
  privacy: string;
  exit: string;
  emergencyHotline: string;
  dashboard: string;
  cases: string;
  sessions: string;
  signout: string;
  backHome: string;

  // Modals
  exitModalTitle: string;
  exitModalDesc: string;
  stay: string;
  confirmExit: string;

  homeModalTitle: string;
  homeModalDesc: string;
  cancel: string;
  goHome: string;

  sosModalTitle: string;
  sosModalDesc: string;
  callNow: string;

  // Landing Page
  landingHeroBadge: string;
  landingHeroTitle1: string;
  landingHeroTitle2: string;
  landingHeroSub: string;
  survivorCardTitle: string;
  survivorCardDesc: string;
  survivorCardTag: string;
  careCardTitle: string;
  careCardDesc: string;
  careCardTag: string;
  emergencyHelplines: string;

  // Survivor Home
  safeSpaceBadge: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  greetingNight: string;
  greetingSub: string;
  voiceCtaTitle: string;
  voiceCtaDesc: string;
  chatCtaTitle: string;
  whatDoYouNeed: string;
  quickChatTitle: string;
  quickChatDesc: string;
  quickBreatheTitle: string;
  quickBreatheDesc: string;
  quickGroundTitle: string;
  quickGroundDesc: string;
  quickLegalTitle: string;
  quickLegalDesc: string;
  privacyNote: string;
  moreSupportTitle: string;
  helplinesTitle: string;

  // Buddy Voice
  buddyVoiceTitle: string;
  statusIdle: string;
  statusListening: string;
  statusThinking: string;
  statusSpeaking: string;
  statusError: string;
  btnIdle: string;
  btnListening: string;
  btnThinking: string;
  btnSpeaking: string;
  buddyInitialGreeting: string;
  buddySecureDisclaimer: string;
  preferText: string;
  needToBreathe: string;
  voiceResponses: string[];
}

const DICTIONARY: Record<Language, Translations> = {
  en: {
    brand: "TRAC-Mind",
    careTeamPortal: "Care Team Portal",
    home: "Home",
    chat: "Chat",
    voice: "Voice",
    breathe: "Breathe",
    ground: "Ground",
    more: "More",
    legalAid: "Legal Aid & Rights",
    witnessProtection: "Witness Protection",
    myProgress: "My Wellbeing Trend",
    privacy: "Privacy Settings",
    exit: "✕ Exit",
    emergencyHotline: "🆘 14566",
    dashboard: "Dashboard",
    cases: "Cases",
    sessions: "Sessions",
    signout: "Sign out",
    backHome: "← Back to Home",

    exitModalTitle: "Leave TRAC-Mind?",
    exitModalDesc: "Are you sure you want to leave TRAC-Mind? Your session will be safely closed.",
    stay: "Stay",
    confirmExit: "Exit",

    homeModalTitle: "Return to Home?",
    homeModalDesc: "Are you sure you want to go to your Home page?",
    cancel: "Cancel",
    goHome: "Go to Home",

    sosModalTitle: "Emergency SOS — Call 14566?",
    sosModalDesc: "This will directly initiate a phone call to the National Helpline for Atrocity Affected (14566), toll-free 24/7.",
    callNow: "Call 14566 Now",

    landingHeroBadge: "Powered by AI · Trauma-informed care",
    landingHeroTitle1: "You deserve",
    landingHeroTitle2: "safe support.",
    landingHeroSub: "A confidential space for survivors of atrocities to get mental health support, legal aid, and human care — on any device, in any language.",
    survivorCardTitle: "I need support",
    survivorCardDesc: "Talk to Buddy, access breathing exercises, legal aid and counselling — privately and safely.",
    survivorCardTag: "Anonymous · Free · Confidential",
    careCardTitle: "I'm on the care team",
    careCardDesc: "Counselors, admins, and legal responders — sign in to triage your caseload.",
    careCardTag: "MFA secured · Role-based access",
    emergencyHelplines: "Emergency helplines:",

    safeSpaceBadge: "💜 Your safe space",
    greetingMorning: "Good morning.",
    greetingAfternoon: "Good afternoon.",
    greetingEvening: "Good evening.",
    greetingNight: "You're not alone tonight.",
    greetingSub: "Take it one breath at a time. Buddy is here whenever you need.",
    voiceCtaTitle: "Talk with Buddy",
    voiceCtaDesc: "Real-time voice check-in — tap and speak",
    chatCtaTitle: "Chat instead",
    whatDoYouNeed: "What do you need?",
    quickChatTitle: "Chat with Buddy",
    quickChatDesc: "Text check-in, anytime",
    quickBreatheTitle: "4-7-8 Breathing",
    quickBreatheDesc: "Calming nervous pacer",
    quickGroundTitle: "5-4-3-2-1 Grounding",
    quickGroundDesc: "Sensory & mood check",
    quickLegalTitle: "Legal Aid & Rights",
    quickLegalDesc: "Protections under PoA Act",
    privacyNote: "Your conversation is handled securely within this prototype. Only your assigned counselor can view your case with your consent.",
    moreSupportTitle: "More support",
    helplinesTitle: "Helplines",

    buddyVoiceTitle: "Buddy — Voice Mode",
    statusIdle: "Ready to listen",
    statusListening: "Listening…",
    statusThinking: "Processing…",
    statusSpeaking: "Buddy responding…",
    statusError: "Microphone error",
    btnIdle: "Tap to speak",
    btnListening: "Listening… tap to stop",
    btnThinking: "Buddy is processing…",
    btnSpeaking: "Tap to interrupt",
    buddyInitialGreeting: "Hello. I'm Buddy — I'm here to listen. Tap the button below and speak freely. Your conversation is handled securely within this prototype.",
    buddySecureDisclaimer: "🔒 Your conversation is handled securely within this prototype. Speech is transcribed locally in your browser.",
    preferText: "💬 Prefer text",
    needToBreathe: "🌬️ Need to breathe first",
    voiceResponses: [
      "I hear you. Thank you for speaking with me. Take your time — I'm right here.",
      "That sounds very difficult. You're showing real courage by reaching out today.",
      "I understand. You don't have to face this alone. Can you tell me a bit more about how you're feeling right now?",
      "You are safe here. Let's breathe together for a moment before we continue.",
      "I'm listening closely. Would you like me to connect you with a counselor, or would you prefer to keep talking?",
      "Your feelings are completely valid. Take all the time you need.",
    ],
  },

  hi: {
    brand: "TRAC-Mind",
    careTeamPortal: "देखभाल टीम पोर्टल",
    home: "होम",
    chat: "चैट",
    voice: "आवाज़",
    breathe: "सांस",
    ground: "ग्राउंडिंग",
    more: "अधिक",
    legalAid: "कानूनी सहायता व अधिकार",
    witnessProtection: "गवाह संरक्षण",
    myProgress: "मेरी स्वास्थ्य प्रगति",
    privacy: "गोपनीयता सेटिंग्स",
    exit: "✕ बाहर निकलें",
    emergencyHotline: "🆘 14566",
    dashboard: "डैशबोर्ड",
    cases: "मामले",
    sessions: "सत्र",
    signout: "साइन आउट",
    backHome: "← होम पर वापस जाएं",

    exitModalTitle: "क्या आप TRAC-Mind छोड़ना चाहते हैं?",
    exitModalDesc: "क्या आप निश्चित रूप से सत्र समाप्त करना चाहते हैं? आपका सत्र सुरक्षित रूप से बंद हो जाएगा।",
    stay: "रहें",
    confirmExit: "बाहर निकलें",

    homeModalTitle: "होम पर वापस जाएं?",
    homeModalDesc: "क्या आप अपने होम पेज पर वापस जाना चाहते हैं?",
    cancel: "रद्द करें",
    goHome: "होम पर जाएं",

    sosModalTitle: "आपातकालीन SOS — 14566 पर कॉल करें?",
    sosModalDesc: "यह राष्ट्रीय अत्याचार हेल्पलाइन (14566) पर सीधा कॉल करेगा, जो 24/7 निःशुल्क उपलब्ध है।",
    callNow: "अभी 14566 पर कॉल करें",

    landingHeroBadge: "एआई-संचालित · संवेदनशील देखभाल",
    landingHeroTitle1: "आप हकदार हैं",
    landingHeroTitle2: "सुरक्षित सहायता के।",
    landingHeroSub: "अत्याचार प्रभावित व्यक्तियों के लिए मानसिक स्वास्थ्य, कानूनी सुरक्षा और मानवीय देखभाल का सुरक्षित और गोपनीय मंच — हर भाषा में।",
    survivorCardTitle: "मुझे सहायता चाहिए",
    survivorCardDesc: "बडी से बात करें, सांस के व्यायाम करें, कानूनी मदद और परामर्श पाएं — पूर्णतः सुरक्षित रूप से।",
    survivorCardTag: "अनाम · निःशुल्क · गोपनीय",
    careCardTitle: "मैं देखभाल टीम में हूँ",
    careCardDesc: "काउंसलर, प्रशासक और कानूनी सहायता दल — मामलों की समीक्षा के लिए साइन इन करें।",
    careCardTag: "MFA सुरक्षित · भूमिका-आधारित पहुंच",
    emergencyHelplines: "आपातकालीन हेल्पलाइन नंबर:",

    safeSpaceBadge: "💜 आपका सुरक्षित स्थान",
    greetingMorning: "सुप्रभात।",
    greetingAfternoon: "शुभ दोपहर।",
    greetingEvening: "शुभ संध्या।",
    greetingNight: "आज रात आप अकेले नहीं हैं।",
    greetingSub: "एक-एक सांस के साथ आगे बढ़ें। जब भी आपको ज़रूरत हो, बडी आपके साथ है।",
    voiceCtaTitle: "बडी से बोलें",
    voiceCtaDesc: "आवाज़ में बातचीत — टैप करें और बोलें",
    chatCtaTitle: "चैट करें",
    whatDoYouNeed: "आपको किस चीज़ की ज़रूरत है?",
    quickChatTitle: "बडी से चैट करें",
    quickChatDesc: "टेक्स्ट चेक-इन, कभी भी",
    quickBreatheTitle: "4-7-8 श्वास व्यायाम",
    quickBreatheDesc: "मन को शांत करने वाला व्यायाम",
    quickGroundTitle: "5-4-3-2-1 ग्राउंडिंग",
    quickGroundDesc: "इंद्रिय व मनस्थिति चेक",
    quickLegalTitle: "कानूनी सहायता व अधिकार",
    quickLegalDesc: "अत्याचार निवारण अधिनियम के तहत सुरक्षा",
    privacyNote: "इस प्रोटोटाइप में आपकी बातचीत सुरक्षित रखी जाती है। केवल आपके नियुक्त काउंसलर ही आपकी सहमति से आपका मामला देख सकते हैं।",
    moreSupportTitle: "अन्य सहायता",
    helplinesTitle: "हेल्पलाइन नंबर",

    buddyVoiceTitle: "बडी — वॉइस मोड",
    statusIdle: "सुनने के लिए तैयार",
    statusListening: "सुन रहा है…",
    statusThinking: "विचार कर रहा है…",
    statusSpeaking: "बडी बोल रहा है…",
    statusError: "माइक्रोफ़ोन त्रुटि",
    btnIdle: "बोलने के लिए टैप करें",
    btnListening: "सुन रहा है… रोकने के लिए टैप करें",
    btnThinking: "बडी विचार कर रहा है…",
    btnSpeaking: "रोकने के लिए टैप करें",
    buddyInitialGreeting: "नमस्ते। मैं बडी हूँ — मैं आपकी बात सुनने के लिए यहाँ हूँ। नीचे दिए गए बटन पर टैप करें और बोलें। आपकी बातचीत यहाँ सुरक्षित है।",
    buddySecureDisclaimer: "🔒 इस प्रोटोटाइप में आपकी बातचीत सुरक्षित रखी जाती है। आपकी आवाज़ आपके ब्राउज़र में ही प्रोसेस होती है।",
    preferText: "💬 टेक्स्ट में बात करें",
    needToBreathe: "🌬️ पहले सांस का व्यायाम करें",
    voiceResponses: [
      "मैं आपकी बात सुन रहा हूँ। मुझसे बात करने के लिए धन्यवाद। पूरा समय लें — मैं यहीं हूँ।",
      "यह वाकई कठिन लगता है। आज सहायता मांगकर आपने बहुत साहस दिखाया है।",
      "मैं समझ सकता हूँ। आपको अकेले इसका सामना नहीं करना पड़ेगा। क्या आप थोड़ा और बता सकते हैं कि अभी आपको कैसा लग रहा है?",
      "आप यहाँ सुरक्षित हैं। आगे बात करने से पहले आइए एक गहरी सांस लें।",
      "मैं ध्यान से सुन रहा हूँ। क्या आप किसी काउंसलर से बात करना चाहेंगे, या मुझसे बातचीत जारी रखना चाहेंगे?",
      "आपकी भावनाएँ पूरी तरह स्वाभाविक हैं। आप जितना समय चाहें ले सकते हैं।",
    ],
  },

  mr: {
    brand: "TRAC-Mind",
    careTeamPortal: "केअर टीम पोर्टल",
    home: "मुख्यपृष्ठ",
    chat: "संवाद",
    voice: "ध्वनी",
    breathe: "श्वास",
    ground: "शांत व्हा",
    more: "अधिक",
    legalAid: "कायदेशीर मदत आणि हक्क",
    witnessProtection: "साक्षीदार संरक्षण",
    myProgress: "माझी प्रगती",
    privacy: "गोपनीयता पर्याय",
    exit: "✕ बाहेर पडा",
    emergencyHotline: "🆘 14566",
    dashboard: "डॅशबोर्ड",
    cases: "प्रकरणे",
    sessions: "सत्र",
    signout: "साइन आउट",
    backHome: "← मुख्यपृष्ठावर परत जा",

    exitModalTitle: "तुम्हाला TRAC-Mind सोडायचे आहे का?",
    exitModalDesc: "तुम्ही नक्की सत्र संपवू इच्छिता? तुमचे सत्र सुरक्षितपणे बंद केले जाईल.",
    stay: "थांबा",
    confirmExit: "बाहेर पडा",

    homeModalTitle: "मुख्यपृष्ठावर परत जावे?",
    homeModalDesc: "तुम्हाला तुमच्या मुख्यपृष्ठावर परत जायचे आहे का?",
    cancel: "रद्द करा",
    goHome: "मुख्यपृष्ठावर जा",

    sosModalTitle: "आपत्कालीन SOS — 14566 वर कॉल करा?",
    sosModalDesc: "हे राष्ट्रीय अत्याचार हेल्पलाइन (14566) वर थेट कॉल करेल, जे २४/७ विनामूल्य उपलब्ध आहे.",
    callNow: "आता 14566 वर कॉल करा",

    landingHeroBadge: "एआय-सक्षम · संवेदनशील काळजी",
    landingHeroTitle1: "तुम्हाला अधिकार आहे",
    landingHeroTitle2: "सुरक्षित मदतीचा.",
    landingHeroSub: "अत्याचारग्रस्तांसाठी मानसिक आरोग्य, कायदेशीर मदत आणि मानवीय काळजीचे सुरक्षित व गोपनीय व्यासपीठ — कोणत्याही भाषेत.",
    survivorCardTitle: "मला मदत हवी आहे",
    survivorCardDesc: "बडीशी बोला, श्वासोच्छ्वास व्यायाम करा, कायदेशीर मदत आणि समुपदेशन मिळवा — सुरक्षितपणे.",
    survivorCardTag: "निनावी · विनामूल्य · गोपनीय",
    careCardTitle: "मी केअर टीममध्ये आहे",
    careCardDesc: "समुपदेशक, प्रशासक आणि कायदेशीर मदतनीस — प्रकरणे तपासण्यासाठी साइन इन करा.",
    careCardTag: "MFA सुरक्षित · भूमिका-आधारित प्रवेश",
    emergencyHelplines: "आपत्कालीन हेल्पलाइन क्रमांक:",

    safeSpaceBadge: "💜 तुमची सुरक्षित जागा",
    greetingMorning: "शुभ प्रभात.",
    greetingAfternoon: "शुभ दुपार.",
    greetingEvening: "शुभ संध्याकाळ.",
    greetingNight: "आज रात्री तुम्ही एकटे नाही आहात.",
    greetingSub: "प्रत्येक श्वासासोबत धीर धरा. तुम्हाला जेव्हा गरज असेल तेव्हा बडी तुमच्यासोबत आहे.",
    voiceCtaTitle: "बडीशी बोला",
    voiceCtaDesc: "आवाजात संवाद — टॅप करा आणि बोला",
    chatCtaTitle: "चॅट करा",
    whatDoYouNeed: "तुम्हाला काय हवे आहे?",
    quickChatTitle: "बडीशी चॅट करा",
    quickChatDesc: "कधीही मजकूर चेक-इन",
    quickBreatheTitle: "4-7-8 श्वास व्यायाम",
    quickBreatheDesc: "मन शांत करणारा व्यायाम",
    quickGroundTitle: "5-4-3-2-1 शांत व्हा",
    quickGroundDesc: "इंद्रिय आणि मनस्थिती तपासणी",
    quickLegalTitle: "कायदेशीर मदत आणि हक्क",
    quickLegalDesc: "अत्याचार प्रतिबंधक कायद्यानुसार संरक्षण",
    privacyNote: "या प्रोटोटाइपमध्ये तुमचे संभाषण सुरक्षित ठेवले जाते. केवळ नियुक्त समुपदेशक तुमच्या संमतीने पाहू शकतात.",
    moreSupportTitle: "अधिक मदत",
    helplinesTitle: "हेल्पलाइन क्रमांक",

    buddyVoiceTitle: "बडी — व्हॉइस मोड",
    statusIdle: "ऐकण्यासाठी तयार",
    statusListening: "ऐकत आहे…",
    statusThinking: "प्रक्रिया सुरू आहे…",
    statusSpeaking: "बडी बोलत आहे…",
    statusError: "मायक्रोफोन त्रुटी",
    btnIdle: "बोलण्यासाठी टॅप करा",
    btnListening: "ऐकत आहे… थांबवण्यासाठी टॅप करा",
    btnThinking: "बडी विचार करत आहे…",
    btnSpeaking: "थांबवण्यासाठी टॅप करा",
    buddyInitialGreeting: "नमस्कार. मी बडी आहे — मी तुमचे ऐकण्यासाठी येथे आहे. खालील बटणावर टॅप करा आणि मोकळेपणाने बोला. तुमचे संभाषण सुरक्षित आहे.",
    buddySecureDisclaimer: "🔒 या प्रोटोटाइपमध्ये तुमचे संभाषण सुरक्षित ठेवले जाते. तुमचा आवाज ब्राऊझरमध्येच तपासला जातो.",
    preferText: "💬 मजकुरात संवाद साधा",
    needToBreathe: "🌬️ आधी श्वासाचा व्यायाम करा",
    voiceResponses: [
      "मी तुमचे ऐकत आहे. माझ्याशी बोलल्याबद्दल धन्यवाद. शांत राहा — मी इथेच आहे.",
      "हे खूप कठीण आहे. आज मदत मागून तुम्ही मोठे धैर्य दाखवले आहे.",
      "मी समजू शकतो. तुम्हाला एकट्याने याचा सामना करण्याची गरज नाही. सध्या तुम्हाला कसे वाटत आहे ते सांगू शकाल का?",
      "तुम्ही इथे सुरक्षित आहात. पुढे बोलण्यापूर्वी आपण एक दीर्घ श्वास घेऊया.",
      "मी लक्षपूर्वक ऐकत आहे. तुम्हाला समुपदेशकाशी बोलायचे आहे की माझ्याशी बोलणे चालू ठेवायचे आहे?",
      "तुमच्या भावना पूर्णपणे स्वाभाविक आहेत. तुम्हाला हवा तितका वेळ घ्या.",
    ],
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: DICTIONARY.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("trac_lang") as Language;
      if (saved && (saved === "en" || saved === "hi" || saved === "mr")) {
        setLangState(saved);
      }
    } catch {
      // Ignore localStorage access issues
    }
  }, []);

  function setLang(newL: Language) {
    setLangState(newL);
    try {
      localStorage.setItem("trac_lang", newL);
    } catch {
      // Ignore
    }
  }

  const t = DICTIONARY[lang] || DICTIONARY.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
