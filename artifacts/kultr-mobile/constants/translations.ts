export type Language = "en" | "fr" | "sw" | "ar";

export interface Translations {
  // Navigation
  nav: {
    home: string;
    discover: string;
    tickets: string;
    profile: string;
  };
  // Common actions
  actions: {
    search: string;
    save: string;
    share: string;
    buy: string;
    getTickets: string;
    viewTicket: string;
    browseEvents: string;
    createEvent: string;
    cancel: string;
    confirm: string;
    back: string;
    change: string;
    submit: string;
    loading: string;
  };
  // Event categories
  categories: {
    forYou: string;
    music: string;
    art: string;
    food: string;
    heritage: string;
    comedy: string;
    sports: string;
    nightlife: string;
  };
  // Event detail
  event: {
    from: string;
    soldOut: string;
    available: string;
    date: string;
    time: string;
    venue: string;
    about: string;
    lineup: string;
    tickets: string;
    relatedEvents: string;
    featuring: string;
    headliner: string;
  };
  // Checkout
  checkout: {
    title: string;
    ticketDetails: string;
    paymentMethod: string;
    orderSummary: string;
    serviceFee: string;
    total: string;
    processing: string;
    pay: string;
    securePayment: string;
    convertedNote: string;
    enterPhone: string;
  };
  // Ticket view
  ticket: {
    myTickets: string;
    noTickets: string;
    noTicketsSub: string;
    upcoming: string;
    past: string;
    bookingConfirmed: string;
    paymentSuccessful: string;
    presentQR: string;
    authentic: string;
    saveToPhone: string;
    getDirections: string;
    discoverMore: string;
  };
  // Profile
  profile: {
    title: string;
    savedEvents: string;
    myTickets: string;
    createEvent: string;
    notifications: string;
    settings: string;
    creator: string;
    member: string;
    totalRevenue: string;
    ticketsSold: string;
    liveEvents: string;
    edit: string;
  };
  // Discover
  discover: {
    title: string;
    searchPlaceholder: string;
    byCity: string;
    allEvents: string;
    resultsFor: string;
    noEvents: string;
    noEventsSub: string;
    paymentMethods: string;
    pricesIn: string;
    checkoutConverts: string;
  };
  // Empty states
  empty: {
    nothingSaved: string;
    nothingSavedSub: string;
    noTickets: string;
    noTicketsSub: string;
  };
  // Payment methods
  payments: {
    mobileMoney: string;
    bankTransfer: string;
    ussd: string;
    card: string;
    redirectSecure: string;
    bankDetails: string;
  };
  // Sign in / sign up
  auth: {
    signIn: string;
    createAccount: string;
    yourNumber: string;
    createYourAccount: string;
    welcomeBack: string;
    smsCodeSub: string;
    signupEmailSub: string;
    loginEmailSub: string;
    phoneTab: string;
    emailTab: string;
    phoneNumberPlaceholder: string;
    emailAddressPlaceholder: string;
    passwordPlaceholder: string;
    yourNamePlaceholder: string;
    sendCode: string;
    noAccountQuestion: string;
    signUp: string;
    alreadyHaveAccountQuestion: string;
    verification: string;
    checkYourPhone: string;
    enterCodeSentTo: string;
    yourNameOptionalPlaceholder: string;
    verify: string;
    didntReceiveQuestion: string;
    resend: string;
    legalIntro: string;
    termsOfService: string;
    and: string;
    privacyPolicy: string;
  };
  // First-run onboarding
  onboarding: {
    skip: string;
    startJourney: string;
    alreadyMember: string;
    signIn: string;
    welcomeTagline: string;
    welcomeSub: string;
    proofCountries: string;
    proofMembers: string;
    proofMpesa: string;
    featuresEyebrow: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Sub: string;
    feature2Title: string;
    feature2Sub: string;
    feature3Title: string;
    feature3Sub: string;
    next: string;
    continue: string;
    interestsEyebrow: string;
    interestsTitle: string;
    interestsSub: string;
    noPressure: string;
    skipForNow: string;
    locationEyebrow: string;
    locationTitle: string;
    locationSub: string;
    comingSoon: string;
    startExploring: string;
    legalNoteIntro: string;
    dance: string;
    film: string;
    fashion: string;
    tech: string;
  };
}

const en: Translations = {
  nav: {
    home: "Home",
    discover: "Discover",
    tickets: "Tickets",
    profile: "Profile",
  },
  actions: {
    search: "Search",
    save: "Save",
    share: "Share",
    buy: "Buy",
    getTickets: "Get Tickets",
    viewTicket: "View Ticket",
    browseEvents: "Browse Events",
    createEvent: "Create Event",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    change: "Change",
    submit: "Submit",
    loading: "Loading...",
  },
  categories: {
    forYou: "For You",
    music: "Music",
    art: "Art",
    food: "Food",
    heritage: "Heritage",
    comedy: "Comedy",
    sports: "Sports",
    nightlife: "Nightlife",
  },
  event: {
    from: "From",
    soldOut: "Sold out",
    available: "left",
    date: "Date",
    time: "Time",
    venue: "Venue",
    about: "About this Event",
    lineup: "Lineup",
    tickets: "Tickets",
    relatedEvents: "You Might Also Like",
    featuring: "Featuring",
    headliner: "Headliner",
  },
  checkout: {
    title: "Checkout",
    ticketDetails: "Ticket Details",
    paymentMethod: "Payment Method",
    orderSummary: "Order Summary",
    serviceFee: "Service fee (5%)",
    total: "Total",
    processing: "Processing payment...",
    pay: "Pay",
    securePayment: "Your payment is secured with 256-bit encryption",
    convertedNote: "Converted · indicative rate",
    enterPhone: "Enter your mobile number",
  },
  ticket: {
    myTickets: "My Tickets",
    noTickets: "No tickets yet",
    noTicketsSub: "Discover and book events to see your tickets here",
    upcoming: "Upcoming",
    past: "Past",
    bookingConfirmed: "Booking Confirmed!",
    paymentSuccessful: "Payment successful! Your ticket is ready.",
    presentQR: "Present this QR code at the venue entrance",
    authentic: "AUTHENTIC TICKET · Do not share this ticket",
    saveToPhone: "Save to Phone",
    getDirections: "Get Directions",
    discoverMore: "Discover More Events",
  },
  profile: {
    title: "Profile",
    savedEvents: "Saved Events",
    myTickets: "My Tickets",
    createEvent: "Create Event",
    notifications: "Notifications",
    settings: "Settings",
    creator: "Kultr Creator",
    member: "Kultr Member",
    totalRevenue: "Revenue",
    ticketsSold: "Tickets Sold",
    liveEvents: "Live Events",
    edit: "Edit",
  },
  discover: {
    title: "Culture Compass",
    searchPlaceholder: "Search events, artists, cities...",
    byCity: "Browse by City",
    allEvents: "All Events",
    resultsFor: 'Results for',
    noEvents: "No events found",
    noEventsSub: "Try a different search or category",
    paymentMethods: "Payment Methods",
    pricesIn: "Viewing prices in event local currency · Checkout converts to",
    checkoutConverts: "Checkout converts to",
  },
  empty: {
    nothingSaved: "Nothing saved yet",
    nothingSavedSub: "Tap the heart on any event to save it for later",
    noTickets: "No tickets yet",
    noTicketsSub: "Discover and book events to see your tickets here",
  },
  payments: {
    mobileMoney: "Mobile Money",
    bankTransfer: "Bank Transfer",
    ussd: "USSD Code",
    card: "Card",
    redirectSecure: "You will be redirected to a secure 3D-secured payment page",
    bankDetails: "Bank account details will be sent to your email after confirming",
  },
  auth: {
    signIn: "Sign In",
    createAccount: "Create Account",
    yourNumber: "Your number",
    createYourAccount: "Create your account",
    welcomeBack: "Welcome back",
    smsCodeSub: "We'll send a verification code via SMS.",
    signupEmailSub: "Sign up with your email and a password.",
    loginEmailSub: "Sign in with your email and password.",
    phoneTab: "Phone",
    emailTab: "Email",
    phoneNumberPlaceholder: "Phone number",
    emailAddressPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    yourNamePlaceholder: "Your name",
    sendCode: "Send Code",
    noAccountQuestion: "Don't have an account? ",
    signUp: "Sign up",
    alreadyHaveAccountQuestion: "Already have an account? ",
    verification: "Verification",
    checkYourPhone: "Check your phone",
    enterCodeSentTo: "Enter the 6-digit code sent to",
    yourNameOptionalPlaceholder: "Your name (optional)",
    verify: "Verify",
    didntReceiveQuestion: "Didn't receive it? ",
    resend: "Resend",
    legalIntro: "By continuing you agree to our",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
  },
  onboarding: {
    skip: "Skip",
    startJourney: "Start Your Journey",
    alreadyMember: "Already a member?",
    signIn: "Sign in",
    welcomeTagline: "Your Culture.\nYour Tribe.\nYour Story.",
    welcomeSub: "The boldest events across Africa —\nmade for people who truly feel it.",
    proofCountries: "7 Countries",
    proofMembers: "24K Members",
    proofMpesa: "M-Pesa Ready",
    featuresEyebrow: "What you get",
    featuresTitle: "Everything\nyou need.",
    feature1Title: "Discover Events",
    feature1Sub: "From Afrobeats concerts to art exhibitions — curated for you.",
    feature2Title: "Find Your Tribe",
    feature2Sub: "Connect with people who share your culture and your vibe.",
    feature3Title: "Earn as You Go",
    feature3Sub: "Check in, complete quests, level up. Culture pays back.",
    next: "Next",
    continue: "Continue",
    interestsEyebrow: "Personalise your feed",
    interestsTitle: "What moves\nyou?",
    interestsSub: "Select all that call to you.",
    noPressure: "No pressure.",
    skipForNow: "Skip for now",
    locationEyebrow: "Your scene",
    locationTitle: "Where are\nyou based?",
    locationSub: "Sets your currency and surfaces nearby events first.",
    comingSoon: "Coming soon",
    startExploring: "Start Exploring",
    legalNoteIntro: "By continuing you agree to our",
    dance: "Dance",
    film: "Film",
    fashion: "Fashion",
    tech: "Tech",
  },
};

const fr: Translations = {
  nav: {
    home: "Accueil",
    discover: "Découvrir",
    tickets: "Billets",
    profile: "Profil",
  },
  actions: {
    search: "Rechercher",
    save: "Sauvegarder",
    share: "Partager",
    buy: "Acheter",
    getTickets: "Obtenir des billets",
    viewTicket: "Voir le billet",
    browseEvents: "Parcourir les événements",
    createEvent: "Créer un événement",
    cancel: "Annuler",
    confirm: "Confirmer",
    back: "Retour",
    change: "Modifier",
    submit: "Soumettre",
    loading: "Chargement...",
  },
  categories: {
    forYou: "Pour vous",
    music: "Musique",
    art: "Art",
    food: "Gastronomie",
    heritage: "Patrimoine",
    comedy: "Comédie",
    sports: "Sports",
    nightlife: "Vie nocturne",
  },
  event: {
    from: "À partir de",
    soldOut: "Épuisé",
    available: "restants",
    date: "Date",
    time: "Heure",
    venue: "Lieu",
    about: "À propos de cet événement",
    lineup: "Programme",
    tickets: "Billets",
    relatedEvents: "Vous pourriez aussi aimer",
    featuring: "En vedette",
    headliner: "Tête d'affiche",
  },
  checkout: {
    title: "Paiement",
    ticketDetails: "Détails du billet",
    paymentMethod: "Mode de paiement",
    orderSummary: "Récapitulatif de la commande",
    serviceFee: "Frais de service (5%)",
    total: "Total",
    processing: "Traitement du paiement...",
    pay: "Payer",
    securePayment: "Votre paiement est sécurisé avec un chiffrement 256 bits",
    convertedNote: "Converti · taux indicatif",
    enterPhone: "Entrez votre numéro de téléphone",
  },
  ticket: {
    myTickets: "Mes billets",
    noTickets: "Pas encore de billets",
    noTicketsSub: "Découvrez et réservez des événements pour voir vos billets ici",
    upcoming: "À venir",
    past: "Passé",
    bookingConfirmed: "Réservation confirmée !",
    paymentSuccessful: "Paiement réussi ! Votre billet est prêt.",
    presentQR: "Présentez ce code QR à l'entrée du lieu",
    authentic: "BILLET AUTHENTIQUE · Ne partagez pas ce billet",
    saveToPhone: "Sauvegarder sur le téléphone",
    getDirections: "Obtenir l'itinéraire",
    discoverMore: "Découvrir plus d'événements",
  },
  profile: {
    title: "Profil",
    savedEvents: "Événements sauvegardés",
    myTickets: "Mes billets",
    createEvent: "Créer un événement",
    notifications: "Notifications",
    settings: "Paramètres",
    creator: "Créateur Kultr",
    member: "Membre Kultr",
    totalRevenue: "Revenus",
    ticketsSold: "Billets vendus",
    liveEvents: "Événements en cours",
    edit: "Modifier",
  },
  discover: {
    title: "Boussole Culturelle",
    searchPlaceholder: "Rechercher événements, artistes, villes...",
    byCity: "Parcourir par ville",
    allEvents: "Tous les événements",
    resultsFor: "Résultats pour",
    noEvents: "Aucun événement trouvé",
    noEventsSub: "Essayez une autre recherche ou catégorie",
    paymentMethods: "Modes de paiement",
    pricesIn: "Prix affichés en devise locale · Le paiement est converti en",
    checkoutConverts: "Le paiement est converti en",
  },
  empty: {
    nothingSaved: "Rien de sauvegardé",
    nothingSavedSub: "Appuyez sur le cœur d'un événement pour le sauvegarder",
    noTickets: "Pas encore de billets",
    noTicketsSub: "Découvrez et réservez des événements pour voir vos billets ici",
  },
  payments: {
    mobileMoney: "Mobile Money",
    bankTransfer: "Virement bancaire",
    ussd: "Code USSD",
    card: "Carte",
    redirectSecure: "Vous serez redirigé vers une page de paiement sécurisée 3D",
    bankDetails: "Les coordonnées bancaires vous seront envoyées par e-mail après confirmation",
  },
  auth: {
    signIn: "Se connecter",
    createAccount: "Créer un compte",
    yourNumber: "Votre numéro",
    createYourAccount: "Créez votre compte",
    welcomeBack: "Content de vous revoir",
    smsCodeSub: "Nous vous enverrons un code de vérification par SMS.",
    signupEmailSub: "Inscrivez-vous avec votre e-mail et un mot de passe.",
    loginEmailSub: "Connectez-vous avec votre e-mail et votre mot de passe.",
    phoneTab: "Téléphone",
    emailTab: "E-mail",
    phoneNumberPlaceholder: "Numéro de téléphone",
    emailAddressPlaceholder: "Adresse e-mail",
    passwordPlaceholder: "Mot de passe",
    yourNamePlaceholder: "Votre nom",
    sendCode: "Envoyer le code",
    noAccountQuestion: "Pas encore de compte ? ",
    signUp: "S'inscrire",
    alreadyHaveAccountQuestion: "Déjà un compte ? ",
    verification: "Vérification",
    checkYourPhone: "Vérifiez votre téléphone",
    enterCodeSentTo: "Entrez le code à 6 chiffres envoyé au",
    yourNameOptionalPlaceholder: "Votre nom (facultatif)",
    verify: "Vérifier",
    didntReceiveQuestion: "Vous ne l'avez pas reçu ? ",
    resend: "Renvoyer",
    legalIntro: "En continuant, vous acceptez nos",
    termsOfService: "Conditions d'utilisation",
    and: "et notre",
    privacyPolicy: "Politique de confidentialité",
  },
  onboarding: {
    skip: "Passer",
    startJourney: "Commencer l'aventure",
    alreadyMember: "Déjà membre ?",
    signIn: "Se connecter",
    welcomeTagline: "Votre culture.\nVotre tribu.\nVotre histoire.",
    welcomeSub: "Les événements les plus audacieux d'Afrique —\nconçus pour ceux qui les vivent pleinement.",
    proofCountries: "7 pays",
    proofMembers: "24K membres",
    proofMpesa: "M-Pesa disponible",
    featuresEyebrow: "Ce que vous obtenez",
    featuresTitle: "Tout ce dont\nvous avez besoin.",
    feature1Title: "Découvrez des événements",
    feature1Sub: "Des concerts afrobeats aux expositions d'art — sélectionnés pour vous.",
    feature2Title: "Trouvez votre tribu",
    feature2Sub: "Connectez-vous avec des personnes qui partagent votre culture et votre énergie.",
    feature3Title: "Gagnez en participant",
    feature3Sub: "Enregistrez-vous, complétez des quêtes, progressez. La culture, ça rapporte.",
    next: "Suivant",
    continue: "Continuer",
    interestsEyebrow: "Personnalisez votre fil",
    interestsTitle: "Qu'est-ce qui\nvous anime ?",
    interestsSub: "Sélectionnez tout ce qui vous inspire.",
    noPressure: "Sans pression.",
    skipForNow: "Passer pour l'instant",
    locationEyebrow: "Votre scène",
    locationTitle: "Où êtes-vous\nbasé ?",
    locationSub: "Définit votre devise et affiche d'abord les événements à proximité.",
    comingSoon: "Bientôt disponible",
    startExploring: "Commencer à explorer",
    legalNoteIntro: "En continuant, vous acceptez nos",
    dance: "Danse",
    film: "Cinéma",
    fashion: "Mode",
    tech: "Tech",
  },
};

const sw: Translations = {
  nav: {
    home: "Nyumbani",
    discover: "Gundua",
    tickets: "Tikiti",
    profile: "Wasifu",
  },
  actions: {
    search: "Tafuta",
    save: "Hifadhi",
    share: "Shiriki",
    buy: "Nunua",
    getTickets: "Pata Tikiti",
    viewTicket: "Angalia Tikiti",
    browseEvents: "Angalia Matukio",
    createEvent: "Unda Tukio",
    cancel: "Ghairi",
    confirm: "Thibitisha",
    back: "Rudi",
    change: "Badilisha",
    submit: "Wasilisha",
    loading: "Inapakia...",
  },
  categories: {
    forYou: "Kwako",
    music: "Muziki",
    art: "Sanaa",
    food: "Chakula",
    heritage: "Urithi",
    comedy: "Vichekesho",
    sports: "Michezo",
    nightlife: "Usiku",
  },
  event: {
    from: "Kuanzia",
    soldOut: "Imeisha",
    available: "zilizobaki",
    date: "Tarehe",
    time: "Saa",
    venue: "Mahali",
    about: "Kuhusu Tukio hili",
    lineup: "Wasanii",
    tickets: "Tikiti",
    relatedEvents: "Unaweza Kupenda Pia",
    featuring: "Likiwa na",
    headliner: "Msanii Mkuu",
  },
  checkout: {
    title: "Malipo",
    ticketDetails: "Maelezo ya Tikiti",
    paymentMethod: "Njia ya Malipo",
    orderSummary: "Muhtasari wa Agizo",
    serviceFee: "Ada ya huduma (5%)",
    total: "Jumla",
    processing: "Inachakata malipo...",
    pay: "Lipa",
    securePayment: "Malipo yako yanalindwa kwa usimbaji fiche wa biti 256",
    convertedNote: "Imebadilishwa · kiwango cha dalili",
    enterPhone: "Ingiza nambari yako ya simu",
  },
  ticket: {
    myTickets: "Tikiti Zangu",
    noTickets: "Bado hakuna tikiti",
    noTicketsSub: "Gundua na uhifadhi matukio ili uone tikiti zako hapa",
    upcoming: "Inakuja",
    past: "Imepita",
    bookingConfirmed: "Uhifadhi Umethibitishwa!",
    paymentSuccessful: "Malipo yamefanikiwa! Tikiti yako iko tayari.",
    presentQR: "Onyesha msimbo huu wa QR kwenye mlango wa ukumbi",
    authentic: "TIKITI HALISI · Usishiriki tikiti hii",
    saveToPhone: "Hifadhi kwenye Simu",
    getDirections: "Pata Mwelekeo",
    discoverMore: "Gundua Matukio Zaidi",
  },
  profile: {
    title: "Wasifu",
    savedEvents: "Matukio Yaliyohifadhiwa",
    myTickets: "Tikiti Zangu",
    createEvent: "Unda Tukio",
    notifications: "Arifa",
    settings: "Mipangilio",
    creator: "Muunda wa Kultr",
    member: "Mwanachama wa Kultr",
    totalRevenue: "Mapato",
    ticketsSold: "Tikiti Zilizouzwa",
    liveEvents: "Matukio Yanayoendelea",
    edit: "Hariri",
  },
  discover: {
    title: "Dira ya Utamaduni",
    searchPlaceholder: "Tafuta matukio, wasanii, miji...",
    byCity: "Vinjari kwa Mji",
    allEvents: "Matukio Yote",
    resultsFor: "Matokeo ya",
    noEvents: "Hakuna matukio yaliyopatikana",
    noEventsSub: "Jaribu utafutaji mwingine au aina tofauti",
    paymentMethods: "Njia za Malipo",
    pricesIn: "Bei zinaonyeshwa kwa sarafu ya tukio · Malipo yanabadilishwa hadi",
    checkoutConverts: "Malipo yanabadilishwa hadi",
  },
  empty: {
    nothingSaved: "Hakuna kilichohifadhiwa",
    nothingSavedSub: "Gonga moyo kwenye tukio lolote kulihifadhi kwa baadaye",
    noTickets: "Bado hakuna tikiti",
    noTicketsSub: "Gundua na uhifadhi matukio ili uone tikiti zako hapa",
  },
  payments: {
    mobileMoney: "Pesa ya Simu",
    bankTransfer: "Uhamisho wa Benki",
    ussd: "Nambari ya USSD",
    card: "Kadi",
    redirectSecure: "Utaelekezwa kwenye ukurasa salama wa malipo wa 3D",
    bankDetails: "Maelezo ya akaunti ya benki yatatumwa kwa barua pepe yako baada ya kuthibitisha",
  },
  auth: {
    signIn: "Ingia",
    createAccount: "Fungua Akaunti",
    yourNumber: "Nambari yako",
    createYourAccount: "Fungua akaunti yako",
    welcomeBack: "Karibu tena",
    smsCodeSub: "Tutakutumia msimbo wa uthibitisho kupitia SMS.",
    signupEmailSub: "Jisajili kwa barua pepe yako na nenosiri.",
    loginEmailSub: "Ingia kwa barua pepe yako na nenosiri.",
    phoneTab: "Simu",
    emailTab: "Barua Pepe",
    phoneNumberPlaceholder: "Nambari ya simu",
    emailAddressPlaceholder: "Anwani ya barua pepe",
    passwordPlaceholder: "Nenosiri",
    yourNamePlaceholder: "Jina lako",
    sendCode: "Tuma Msimbo",
    noAccountQuestion: "Huna akaunti bado? ",
    signUp: "Jisajili",
    alreadyHaveAccountQuestion: "Una akaunti tayari? ",
    verification: "Uthibitisho",
    checkYourPhone: "Angalia simu yako",
    enterCodeSentTo: "Ingiza msimbo wa tarakimu 6 uliotumwa kwa",
    yourNameOptionalPlaceholder: "Jina lako (si lazima)",
    verify: "Thibitisha",
    didntReceiveQuestion: "Hukupokea? ",
    resend: "Tuma tena",
    legalIntro: "Kwa kuendelea unakubali",
    termsOfService: "Masharti ya Huduma",
    and: "na",
    privacyPolicy: "Sera ya Faragha",
  },
  onboarding: {
    skip: "Ruka",
    startJourney: "Anza Safari Yako",
    alreadyMember: "Tayari ni mwanachama?",
    signIn: "Ingia",
    welcomeTagline: "Utamaduni Wako.\nKabila Lako.\nHadithi Yako.",
    welcomeSub: "Matukio makubwa zaidi kote Afrika —\nyaliyotengenezwa kwa watu wanaoyahisi kikamilifu.",
    proofCountries: "Nchi 7",
    proofMembers: "Wanachama 24K",
    proofMpesa: "M-Pesa Iko Tayari",
    featuresEyebrow: "Unachopata",
    featuresTitle: "Kila kitu\nunachohitaji.",
    feature1Title: "Gundua Matukio",
    feature1Sub: "Kutoka matamasha ya Afrobeats hadi maonyesho ya sanaa — yamechaguliwa kwa ajili yako.",
    feature2Title: "Pata Kabila Lako",
    feature2Sub: "Ungana na watu wanaoshiriki utamaduni na hali yako.",
    feature3Title: "Pata Faida Unavyoendelea",
    feature3Sub: "Ingia, kamilisha misheni, panda ngazi. Utamaduni hulipa.",
    next: "Ifuatayo",
    continue: "Endelea",
    interestsEyebrow: "Binafsisha mtiririko wako",
    interestsTitle: "Ni nini\nkinachokusisimua?",
    interestsSub: "Chagua vyote vinavyokuvutia.",
    noPressure: "Hakuna shinikizo.",
    skipForNow: "Ruka kwa sasa",
    locationEyebrow: "Eneo lako",
    locationTitle: "Uko wapi?",
    locationSub: "Huweka sarafu yako na kuonyesha matukio ya karibu kwanza.",
    comingSoon: "Inakuja hivi karibuni",
    startExploring: "Anza Kuchunguza",
    legalNoteIntro: "Kwa kuendelea unakubali",
    dance: "Dansi",
    film: "Filamu",
    fashion: "Mitindo",
    tech: "Teknolojia",
  },
};

const ar: Translations = {
  nav: {
    home: "الرئيسية",
    discover: "اكتشف",
    tickets: "التذاكر",
    profile: "الملف الشخصي",
  },
  actions: {
    search: "بحث",
    save: "حفظ",
    share: "مشاركة",
    buy: "شراء",
    getTickets: "احصل على التذاكر",
    viewTicket: "عرض التذكرة",
    browseEvents: "تصفح الفعاليات",
    createEvent: "إنشاء فعالية",
    cancel: "إلغاء",
    confirm: "تأكيد",
    back: "رجوع",
    change: "تغيير",
    submit: "إرسال",
    loading: "جار التحميل...",
  },
  categories: {
    forYou: "لك",
    music: "موسيقى",
    art: "فن",
    food: "طعام",
    heritage: "تراث",
    comedy: "كوميديا",
    sports: "رياضة",
    nightlife: "حياة ليلية",
  },
  event: {
    from: "من",
    soldOut: "نفدت التذاكر",
    available: "متبقية",
    date: "التاريخ",
    time: "الوقت",
    venue: "المكان",
    about: "عن هذه الفعالية",
    lineup: "قائمة الفنانين",
    tickets: "التذاكر",
    relatedEvents: "قد يعجبك أيضاً",
    featuring: "يضم",
    headliner: "النجم الرئيسي",
  },
  checkout: {
    title: "الدفع",
    ticketDetails: "تفاصيل التذكرة",
    paymentMethod: "طريقة الدفع",
    orderSummary: "ملخص الطلب",
    serviceFee: "رسوم الخدمة (٥٪)",
    total: "الإجمالي",
    processing: "جار معالجة الدفع...",
    pay: "ادفع",
    securePayment: "دفعك محمي بتشفير ٢٥٦ بت",
    convertedNote: "محوّل · سعر استرشادي",
    enterPhone: "أدخل رقم هاتفك المحمول",
  },
  ticket: {
    myTickets: "تذاكري",
    noTickets: "لا توجد تذاكر بعد",
    noTicketsSub: "اكتشف الفعاليات واحجزها لترى تذاكرك هنا",
    upcoming: "القادمة",
    past: "السابقة",
    bookingConfirmed: "تم تأكيد الحجز!",
    paymentSuccessful: "تمت عملية الدفع! تذكرتك جاهزة.",
    presentQR: "اعرض رمز الاستجابة السريعة عند مدخل المكان",
    authentic: "تذكرة أصلية · لا تشارك هذه التذكرة",
    saveToPhone: "حفظ في الهاتف",
    getDirections: "الحصول على الاتجاهات",
    discoverMore: "اكتشف المزيد من الفعاليات",
  },
  profile: {
    title: "الملف الشخصي",
    savedEvents: "الفعاليات المحفوظة",
    myTickets: "تذاكري",
    createEvent: "إنشاء فعالية",
    notifications: "الإشعارات",
    settings: "الإعدادات",
    creator: "منشئ كلتر",
    member: "عضو كلتر",
    totalRevenue: "الإيرادات",
    ticketsSold: "التذاكر المباعة",
    liveEvents: "الفعاليات الحية",
    edit: "تعديل",
  },
  discover: {
    title: "بوصلة الثقافة",
    searchPlaceholder: "ابحث عن فعاليات، فنانين، مدن...",
    byCity: "تصفح حسب المدينة",
    allEvents: "جميع الفعاليات",
    resultsFor: "نتائج لـ",
    noEvents: "لم يتم العثور على فعاليات",
    noEventsSub: "جرب بحثاً مختلفاً أو فئة أخرى",
    paymentMethods: "طرق الدفع",
    pricesIn: "عرض الأسعار بالعملة المحلية للفعالية · الدفع يُحوّل إلى",
    checkoutConverts: "الدفع يُحوّل إلى",
  },
  empty: {
    nothingSaved: "لم يتم حفظ أي شيء بعد",
    nothingSavedSub: "انقر على القلب في أي فعالية لحفظها لاحقاً",
    noTickets: "لا توجد تذاكر بعد",
    noTicketsSub: "اكتشف الفعاليات واحجزها لترى تذاكرك هنا",
  },
  payments: {
    mobileMoney: "المال المحمول",
    bankTransfer: "تحويل بنكي",
    ussd: "رمز USSD",
    card: "بطاقة",
    redirectSecure: "ستتم إعادة توجيهك إلى صفحة دفع آمنة ثلاثية الأبعاد",
    bankDetails: "سيتم إرسال تفاصيل الحساب البنكي إلى بريدك الإلكتروني بعد التأكيد",
  },
  auth: {
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",
    yourNumber: "رقمك",
    createYourAccount: "أنشئ حسابك",
    welcomeBack: "مرحباً بعودتك",
    smsCodeSub: "سنرسل لك رمز تحقق عبر رسالة نصية.",
    signupEmailSub: "أنشئ حسابك ببريدك الإلكتروني وكلمة مرور.",
    loginEmailSub: "سجّل الدخول ببريدك الإلكتروني وكلمة المرور.",
    phoneTab: "الهاتف",
    emailTab: "البريد الإلكتروني",
    phoneNumberPlaceholder: "رقم الهاتف",
    emailAddressPlaceholder: "البريد الإلكتروني",
    passwordPlaceholder: "كلمة المرور",
    yourNamePlaceholder: "اسمك",
    sendCode: "إرسال الرمز",
    noAccountQuestion: "ليس لديك حساب؟ ",
    signUp: "إنشاء حساب",
    alreadyHaveAccountQuestion: "لديك حساب بالفعل؟ ",
    verification: "التحقق",
    checkYourPhone: "تحقق من هاتفك",
    enterCodeSentTo: "أدخل الرمز المكون من ٦ أرقام المرسل إلى",
    yourNameOptionalPlaceholder: "اسمك (اختياري)",
    verify: "تحقق",
    didntReceiveQuestion: "لم تستلمه؟ ",
    resend: "إعادة الإرسال",
    legalIntro: "بالمتابعة، فإنك توافق على",
    termsOfService: "شروط الخدمة",
    and: "و",
    privacyPolicy: "سياسة الخصوصية",
  },
  onboarding: {
    skip: "تخطي",
    startJourney: "ابدأ رحلتك",
    alreadyMember: "عضو بالفعل؟",
    signIn: "تسجيل الدخول",
    welcomeTagline: "ثقافتك.\nقبيلتك.\nقصتك.",
    welcomeSub: "أجرأ الفعاليات في جميع أنحاء أفريقيا —\nصُنعت لمن يعيشها بصدق.",
    proofCountries: "٧ دول",
    proofMembers: "٢٤ ألف عضو",
    proofMpesa: "M-Pesa جاهز",
    featuresEyebrow: "ما ستحصل عليه",
    featuresTitle: "كل ما\nتحتاجه.",
    feature1Title: "اكتشف الفعاليات",
    feature1Sub: "من حفلات الأفروبيت إلى معارض الفن — مُنتقاة خصيصاً لك.",
    feature2Title: "اعثر على قبيلتك",
    feature2Sub: "تواصل مع أشخاص يشاركونك ثقافتك وأسلوبك.",
    feature3Title: "اكسب أثناء المشاركة",
    feature3Sub: "سجّل حضورك، أكمل المهام، ارتقِ بمستواك. الثقافة تكافئك.",
    next: "التالي",
    continue: "متابعة",
    interestsEyebrow: "خصص واجهتك",
    interestsTitle: "ما الذي\nيثير شغفك؟",
    interestsSub: "اختر كل ما يستهويك.",
    noPressure: "بلا ضغط.",
    skipForNow: "تخطي الآن",
    locationEyebrow: "مشهدك",
    locationTitle: "أين تقيم؟",
    locationSub: "يحدد عملتك ويعرض الفعاليات القريبة أولاً.",
    comingSoon: "قريباً",
    startExploring: "ابدأ الاستكشاف",
    legalNoteIntro: "بالمتابعة، فإنك توافق على",
    dance: "رقص",
    film: "أفلام",
    fashion: "أزياء",
    tech: "تقنية",
  },
};

export const TRANSLATIONS: Record<Language, Translations> = { en, fr, sw, ar };

// Maps a canonical English category value (see CATEGORIES in constants/data.ts,
// also used as the filter/comparison key and the API's event.category value)
// to its translated display label. The canonical value itself is never
// translated — only what's shown for it.
const CATEGORY_KEYS: Record<string, keyof Translations["categories"]> = {
  "For You": "forYou",
  Music: "music",
  Art: "art",
  Food: "food",
  Heritage: "heritage",
  Comedy: "comedy",
  Sports: "sports",
  Nightlife: "nightlife",
};

export function getCategoryLabel(category: string, t: Translations): string {
  const key = CATEGORY_KEYS[category];
  return key ? t.categories[key] : category;
}
