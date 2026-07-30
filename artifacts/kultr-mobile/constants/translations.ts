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
    ok: string;
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
  // Settings screen
  settings: {
    language: string;
    rtlNote: string;
    programs: string;
    tribeLeaders: string;
    tribeLeadersSub: string;
    connectivity: string;
    dataSaver: string;
    dataSaverSub: string;
    privacy: string;
    analyticsTracking: string;
    analyticsTrackingSub: string;
    marketingMessages: string;
    marketingMessagesSub: string;
  };
  // Notifications screen
  notifications: {
    markAllRead: string;
    signInForNotifications: string;
    signInSub: string;
    couldntLoad: string;
    retry: string;
    retrying: string;
    allCaughtUp: string;
    emptySub: string;
    newLabel: string;
    earlierLabel: string;
    settingsHint: string;
  };
  // Quests screen
  quests: {
    title: string;
    subtitle: string;
    signInTitle: string;
    signInSub: string;
    couldntLoad: string;
    checkConnection: string;
    legendTitle: string;
    journeyTitle: string;
    allCompletedSub: string;
    allQuestsTab: string;
    inProgressTab: string;
    completedTab: string;
    noCompletedYet: string;
    nothingHere: string;
    done: string;
    checkInToEarn: string;
    checkIn: string;
    culturalLegacy: string;
    noCollectiblesYet: string;
    spendRewards: string;
  };
  // Rewards screen
  rewards: {
    title: string;
    signInTitle: string;
    signInSub: string;
    couldntLoad: string;
    checkConnection: string;
    balanceLabel: string;
    lifetimeEarned: string;
    getPass: string;
    unlockMore: string;
    noPerks: string;
    unlock: string;
    locked: string;
    backToQuests: string;
  };
  // Gamification (Streaks & Badges) screen
  gamification: {
    title: string;
    signInTitle: string;
    couldntLoad: string;
    tryAgain: string;
    level: string;
    viewProfile: string;
    levelJourney: string;
    youAreHere: string;
    start: string;
    kultrStreaks: string;
    streakDays: string;
    startYourStreak: string;
    startStreakSub: string;
    keepCheckingIn: string;
    keepStreakSub: string;
    dayEvent: string;
    streakBang: string;
    keptItGoingSub: string;
    currentStreak: string;
    bestStreak: string;
    daysLabel: string;
    badges: string;
    levelNewcomer: string;
    levelExplorer: string;
    levelWanderer: string;
    levelTrailblazer: string;
    levelCultureBearer: string;
    levelLegend: string;
    visitsSuffix: string;
    journeyNewbie: string;
    journeyExplorer: string;
    journeyCulturalist: string;
    journeyGlobalIcon: string;
    badgeWeekWarrior: string;
    badgeWeekWarriorDesc: string;
    badgeConsistent: string;
    badgeConsistentDesc: string;
    badgeEventKing: string;
    badgeEventKingDesc: string;
    badgeCommunityBuilder: string;
    badgeCommunityBuilderDesc: string;
  };
  // Creator Studio dashboard
  creatorStudio: {
    title: string;
    welcomeBack: string;
    welcomeSub: string;
    payouts: string;
    payoutsSub: string;
    overview: string;
    last8Weeks: string;
    activeEvents: string;
    avgTicketPrice: string;
    ticketSalesOverTime: string;
    salesByCity: string;
    ticketsSoldPerCity: string;
    revenueByEvent: string;
    ticketsSoldPerEvent: string;
    recentEvents: string;
    noEventsYet: string;
    noEventsYetSub: string;
    statusDraft: string;
    statusInReview: string;
    statusLive: string;
    statusEnded: string;
    statusCancelled: string;
  };
  // Create Event form
  createEvent: {
    listingIn: string;
    creatorChip: string;
    categoryLabel: string;
    titleLabel: string;
    titlePlaceholder: string;
    dateLabel: string;
    datePlaceholder: string;
    timeLabel: string;
    venueLabel: string;
    venuePlaceholder: string;
    cityLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    ticketPricingLabel: string;
    pricingHintPrefix: string;
    pricingHintSuffix: string;
    tierEarlyBird: string;
    tierRegular: string;
    tierVip: string;
    addPhotoTitle: string;
    addPhotoSub: string;
    changePhoto: string;
    platformFeeNote: string;
    publishing: string;
    publishEvent: string;
    invalidDateTitle: string;
    invalidDateMsg: string;
    invalidPriceTitle: string;
    invalidPriceMsg: string;
    publishFailedTitle: string;
    publishFailedMsg: string;
    savedAsDraftTitle: string;
    savedAsDraftMsg: string;
    submittedForReviewTitle: string;
    submittedForReviewSub: string;
    publishedTitle: string;
    publishedSub: string;
    shareEvent: string;
    goToDashboard: string;
  };
  // Creator payouts screen
  payoutsScreen: {
    signInTitle: string;
    signInSub: string;
    availableBalance: string;
    couldntLoadBalance: string;
    noBalanceYet: string;
    available: string;
    request: string;
    alreadyRequested: string;
    requestAnyway: string;
    requestPayout: string;
    closeForm: string;
    amountLabel: string;
    currencyLabel: string;
    destinationLabel: string;
    destinationPlaceholder: string;
    submitRequest: string;
    payoutHistory: string;
    couldntLoadHistory: string;
    noPayoutsYet: string;
    toDestination: string;
    requested: string;
    statusPending: string;
    statusPaid: string;
    statusFailed: string;
    invalidAmountTitle: string;
    invalidAmountMsg: string;
    currencyRequiredTitle: string;
    currencyRequiredMsg: string;
    destinationRequiredTitle: string;
    destinationRequiredMsg: string;
    payoutRequestedTitle: string;
    payoutRequestedMsg: string;
    requestFailedTitle: string;
    requestFailedFallback: string;
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
    ok: "OK",
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
  settings: {
    language: "Language",
    rtlNote: "Arabic uses a right-to-left layout. Changing the language requires restarting the app for the layout to fully apply.",
    programs: "Programs",
    tribeLeaders: "Kultr Tribe Leaders",
    tribeLeadersSub: "Ambassador program — lead & earn",
    connectivity: "Connectivity",
    dataSaver: "Data Saver Mode",
    dataSaverSub: "Loads fewer events for slow connections",
    privacy: "Privacy",
    analyticsTracking: "Analytics & Tracking",
    analyticsTrackingSub: "Off by default. Helps us understand how the app is used — never sold or shared for advertising.",
    marketingMessages: "Marketing Messages",
    marketingMessagesSub: "Off by default. Separate from your login code texts, which always send regardless of this setting.",
  },
  notifications: {
    markAllRead: "Mark all read",
    signInForNotifications: "Sign in for notifications",
    signInSub: "Real updates about your tickets, events and payouts show up here.",
    couldntLoad: "Couldn't load notifications",
    retry: "Retry",
    retrying: "Retrying…",
    allCaughtUp: "You're all caught up!",
    emptySub: "Real activity — ticket confirmations, event approvals, payout updates — will show up here.",
    newLabel: "New",
    earlierLabel: "Earlier",
    settingsHint: "Manage notification preferences in Settings",
  },
  quests: {
    title: "Cultural Quests",
    subtitle: "Explore. Experience. Earn rewards.",
    signInTitle: "Sign in to start questing",
    signInSub: "Track your cultural journey and earn collectibles.",
    couldntLoad: "Couldn't load quests",
    checkConnection: "Check your connection and try again.",
    legendTitle: "🏆 Kultr Legend",
    journeyTitle: "Your Quest Journey",
    allCompletedSub: "All quests completed — you've built your cultural legacy.",
    allQuestsTab: "All Quests",
    inProgressTab: "In Progress",
    completedTab: "Completed",
    noCompletedYet: "No completed quests yet.",
    nothingHere: "Nothing here right now.",
    done: "Done",
    checkInToEarn: "Check in to earn",
    checkIn: "Check in",
    culturalLegacy: "Cultural Legacy",
    noCollectiblesYet: "Complete quests to earn collectible badges.",
    spendRewards: "Spend your KULTROINS in Rewards",
  },
  rewards: {
    title: "Rewards",
    signInTitle: "Sign in to view rewards",
    signInSub: "Earn KULTROINS from quests, then unlock experiences.",
    couldntLoad: "Couldn't load rewards",
    checkConnection: "Check your connection and try again.",
    balanceLabel: "KULTROIN Balance",
    lifetimeEarned: "Lifetime earned",
    getPass: "Get KULTR PASS",
    unlockMore: "Unlock More Experiences",
    noPerks: "No perks available right now.",
    unlock: "Unlock",
    locked: "Locked",
    backToQuests: "Back to Cultural Quests",
  },
  gamification: {
    title: "Streaks & Badges",
    signInTitle: "Sign in to track your streaks",
    couldntLoad: "Couldn't load your profile",
    tryAgain: "Try Again",
    level: "Level",
    viewProfile: "View Profile",
    levelJourney: "Level Journey",
    youAreHere: "You are here",
    start: "Start",
    kultrStreaks: "Kultr Streaks",
    streakDays: "Day",
    startYourStreak: "Start Your",
    startStreakSub: "Check in to your next event to begin.",
    keepCheckingIn: "Streak",
    keepStreakSub: "Keep checking in to build your streak!",
    dayEvent: "Day Event",
    streakBang: "Streak!",
    keptItGoingSub: "You showed up and showed out. Keep it going!",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    daysLabel: "Days",
    badges: "Badges",
    levelNewcomer: "Newcomer",
    levelExplorer: "Explorer",
    levelWanderer: "Wanderer",
    levelTrailblazer: "Trailblazer",
    levelCultureBearer: "Culture Bearer",
    levelLegend: "Legend",
    visitsSuffix: "visits",
    journeyNewbie: "Newbie",
    journeyExplorer: "Explorer",
    journeyCulturalist: "Culturalist",
    journeyGlobalIcon: "Global Icon",
    badgeWeekWarrior: "Week Warrior",
    badgeWeekWarriorDesc: "7-day check-in streak",
    badgeConsistent: "Consistent",
    badgeConsistentDesc: "2 events in a row",
    badgeEventKing: "Event King",
    badgeEventKingDesc: "Attended 10+ events",
    badgeCommunityBuilder: "Community Builder",
    badgeCommunityBuilderDesc: "Attended 5+ events",
  },
  creatorStudio: {
    title: "Creator Studio",
    welcomeBack: "Welcome back,",
    welcomeSub: "Here's what's happening with your events",
    payouts: "Payouts",
    payoutsSub: "View your balance and request a payout",
    overview: "Overview",
    last8Weeks: "Last 8 weeks",
    activeEvents: "Active Events",
    avgTicketPrice: "Avg. Ticket Price",
    ticketSalesOverTime: "Ticket Sales Over Time",
    salesByCity: "Sales by City",
    ticketsSoldPerCity: "Tickets sold per city",
    revenueByEvent: "Revenue by Event",
    ticketsSoldPerEvent: "Tickets sold per event",
    recentEvents: "Recent Events",
    noEventsYet: "No events yet",
    noEventsYetSub: "Create your first event to see it and its sales here.",
    statusDraft: "Draft",
    statusInReview: "In Review",
    statusLive: "Live",
    statusEnded: "Ended",
    statusCancelled: "Cancelled",
  },
  createEvent: {
    listingIn: "Listing in",
    creatorChip: "Creator",
    categoryLabel: "Category",
    titleLabel: "Event Title",
    titlePlaceholder: "e.g. Nairobi Jazz Collective",
    dateLabel: "Date",
    datePlaceholder: "YYYY-MM-DD",
    timeLabel: "Time",
    venueLabel: "Venue",
    venuePlaceholder: "Venue name",
    cityLabel: "City",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Tell attendees what makes this event special...",
    ticketPricingLabel: "Ticket Pricing",
    pricingHintPrefix: "Set prices in",
    pricingHintSuffix: "Leave blank to skip a tier",
    tierEarlyBird: "Early Bird",
    tierRegular: "Regular",
    tierVip: "VIP",
    addPhotoTitle: "Add Event Photo",
    addPhotoSub: "Tap to upload a cover image or video teaser",
    changePhoto: "Change Photo",
    platformFeeNote: "Platform fee: 5% per ticket sold",
    publishing: "Publishing...",
    publishEvent: "Publish Event",
    invalidDateTitle: "Invalid Date",
    invalidDateMsg: "Event date must be in the future (YYYY-MM-DD).",
    invalidPriceTitle: "Invalid Price",
    invalidPriceMsg: "All prices must be valid numbers.",
    publishFailedTitle: "Publish failed",
    publishFailedMsg: "Couldn't reach the server. Please check your connection and try again.",
    savedAsDraftTitle: "Saved as draft",
    savedAsDraftMsg: "Your event was created but couldn't be submitted for review yet. Try submitting it again from your event list.",
    submittedForReviewTitle: "Submitted for Review",
    submittedForReviewSub: "We'll review your event shortly. You'll be able to share it once it's approved and live.",
    publishedTitle: "Event Published!",
    publishedSub: "Your event is now live. Share it with the world.",
    shareEvent: "Share Event",
    goToDashboard: "Go to Dashboard",
  },
  payoutsScreen: {
    signInTitle: "Sign in to view payouts",
    signInSub: "See your balance and request a payout for your event revenue.",
    availableBalance: "Available Balance",
    couldntLoadBalance: "Couldn't load your balance. Pull to retry.",
    noBalanceYet: "No confirmed ticket revenue yet — your balance will appear here once tickets sell.",
    available: "Available",
    request: "Request",
    alreadyRequested: "Already requested",
    requestAnyway: "Request a payout anyway",
    requestPayout: "Request Payout",
    closeForm: "Close form",
    amountLabel: "Amount",
    currencyLabel: "Currency",
    destinationLabel: "Destination (phone or bank reference)",
    destinationPlaceholder: "e.g. 0712 345 678",
    submitRequest: "Submit Request",
    payoutHistory: "Payout History",
    couldntLoadHistory: "Couldn't load payout history.",
    noPayoutsYet: "No payout requests yet.",
    toDestination: "To",
    requested: "Requested",
    statusPending: "Pending",
    statusPaid: "Paid",
    statusFailed: "Failed",
    invalidAmountTitle: "Invalid amount",
    invalidAmountMsg: "Enter a positive amount to request.",
    currencyRequiredTitle: "Currency required",
    currencyRequiredMsg: "Enter a currency, e.g. KES.",
    destinationRequiredTitle: "Destination required",
    destinationRequiredMsg: "Enter a phone number or bank reference to pay out to.",
    payoutRequestedTitle: "Payout requested",
    payoutRequestedMsg: "Your request is pending review.",
    requestFailedTitle: "Request failed",
    requestFailedFallback: "Please try again.",
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
    ok: "OK",
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
  settings: {
    language: "Langue",
    rtlNote: "L'arabe utilise une mise en page de droite à gauche. Changer de langue nécessite de redémarrer l'application pour que la mise en page s'applique entièrement.",
    programs: "Programmes",
    tribeLeaders: "Kultr Tribe Leaders",
    tribeLeadersSub: "Programme d'ambassadeurs — dirigez et gagnez",
    connectivity: "Connectivité",
    dataSaver: "Mode économie de données",
    dataSaverSub: "Charge moins d'événements pour les connexions lentes",
    privacy: "Confidentialité",
    analyticsTracking: "Analyses et suivi",
    analyticsTrackingSub: "Désactivé par défaut. Nous aide à comprendre l'utilisation de l'application — jamais vendu ni partagé à des fins publicitaires.",
    marketingMessages: "Messages marketing",
    marketingMessagesSub: "Désactivé par défaut. Distinct de vos codes de connexion par SMS, qui sont toujours envoyés quel que soit ce réglage.",
  },
  notifications: {
    markAllRead: "Tout marquer comme lu",
    signInForNotifications: "Connectez-vous pour les notifications",
    signInSub: "Les mises à jour réelles sur vos billets, événements et paiements s'affichent ici.",
    couldntLoad: "Impossible de charger les notifications",
    retry: "Réessayer",
    retrying: "Nouvelle tentative…",
    allCaughtUp: "Vous êtes à jour !",
    emptySub: "L'activité réelle — confirmations de billets, approbations d'événements, mises à jour de paiements — s'affichera ici.",
    newLabel: "Nouveau",
    earlierLabel: "Plus tôt",
    settingsHint: "Gérez vos préférences de notification dans les Paramètres",
  },
  quests: {
    title: "Quêtes Culturelles",
    subtitle: "Explorez. Vivez. Gagnez des récompenses.",
    signInTitle: "Connectez-vous pour commencer",
    signInSub: "Suivez votre parcours culturel et gagnez des objets de collection.",
    couldntLoad: "Impossible de charger les quêtes",
    checkConnection: "Vérifiez votre connexion et réessayez.",
    legendTitle: "🏆 Légende Kultr",
    journeyTitle: "Votre parcours de quêtes",
    allCompletedSub: "Toutes les quêtes terminées — vous avez construit votre héritage culturel.",
    allQuestsTab: "Toutes",
    inProgressTab: "En cours",
    completedTab: "Terminées",
    noCompletedYet: "Aucune quête terminée pour l'instant.",
    nothingHere: "Rien ici pour le moment.",
    done: "Terminé",
    checkInToEarn: "Enregistrez-vous pour gagner",
    checkIn: "S'enregistrer",
    culturalLegacy: "Héritage Culturel",
    noCollectiblesYet: "Complétez des quêtes pour gagner des badges à collectionner.",
    spendRewards: "Dépensez vos KULTROINS dans Récompenses",
  },
  rewards: {
    title: "Récompenses",
    signInTitle: "Connectez-vous pour voir vos récompenses",
    signInSub: "Gagnez des KULTROINS grâce aux quêtes, puis débloquez des expériences.",
    couldntLoad: "Impossible de charger les récompenses",
    checkConnection: "Vérifiez votre connexion et réessayez.",
    balanceLabel: "Solde KULTROIN",
    lifetimeEarned: "Total gagné",
    getPass: "Obtenir le KULTR PASS",
    unlockMore: "Débloquez plus d'expériences",
    noPerks: "Aucun avantage disponible pour le moment.",
    unlock: "Débloquer",
    locked: "Verrouillé",
    backToQuests: "Retour aux Quêtes Culturelles",
  },
  gamification: {
    title: "Séries et Badges",
    signInTitle: "Connectez-vous pour suivre vos séries",
    couldntLoad: "Impossible de charger votre profil",
    tryAgain: "Réessayer",
    level: "Niveau",
    viewProfile: "Voir le profil",
    levelJourney: "Parcours de niveaux",
    youAreHere: "Vous êtes ici",
    start: "Début",
    kultrStreaks: "Séries Kultr",
    streakDays: "Jour",
    startYourStreak: "Commencez votre",
    startStreakSub: "Enregistrez-vous à votre prochain événement pour commencer.",
    keepCheckingIn: "Série",
    keepStreakSub: "Continuez à vous enregistrer pour construire votre série !",
    dayEvent: "jours d'événements",
    streakBang: "Série !",
    keptItGoingSub: "Vous vous êtes montré à la hauteur. Continuez ainsi !",
    currentStreak: "Série actuelle",
    bestStreak: "Meilleure série",
    daysLabel: "Jours",
    badges: "Badges",
    levelNewcomer: "Nouveau venu",
    levelExplorer: "Explorateur",
    levelWanderer: "Vagabond",
    levelTrailblazer: "Pionnier",
    levelCultureBearer: "Porteur de culture",
    levelLegend: "Légende",
    visitsSuffix: "visites",
    journeyNewbie: "Débutant",
    journeyExplorer: "Explorateur",
    journeyCulturalist: "Culturaliste",
    journeyGlobalIcon: "Icône mondiale",
    badgeWeekWarrior: "Guerrier de la semaine",
    badgeWeekWarriorDesc: "Série de 7 jours d'enregistrement",
    badgeConsistent: "Assidu",
    badgeConsistentDesc: "2 événements consécutifs",
    badgeEventKing: "Roi des événements",
    badgeEventKingDesc: "10+ événements suivis",
    badgeCommunityBuilder: "Bâtisseur de communauté",
    badgeCommunityBuilderDesc: "5+ événements suivis",
  },
  creatorStudio: {
    title: "Espace Créateur",
    welcomeBack: "Content de vous revoir,",
    welcomeSub: "Voici ce qui se passe avec vos événements",
    payouts: "Paiements",
    payoutsSub: "Consultez votre solde et demandez un paiement",
    overview: "Aperçu",
    last8Weeks: "8 dernières semaines",
    activeEvents: "Événements actifs",
    avgTicketPrice: "Prix moyen du billet",
    ticketSalesOverTime: "Ventes de billets dans le temps",
    salesByCity: "Ventes par ville",
    ticketsSoldPerCity: "Billets vendus par ville",
    revenueByEvent: "Revenus par événement",
    ticketsSoldPerEvent: "Billets vendus par événement",
    recentEvents: "Événements récents",
    noEventsYet: "Aucun événement pour l'instant",
    noEventsYetSub: "Créez votre premier événement pour le voir ainsi que ses ventes ici.",
    statusDraft: "Brouillon",
    statusInReview: "En révision",
    statusLive: "En direct",
    statusEnded: "Terminé",
    statusCancelled: "Annulé",
  },
  createEvent: {
    listingIn: "Publié en",
    creatorChip: "Créateur",
    categoryLabel: "Catégorie",
    titleLabel: "Titre de l'événement",
    titlePlaceholder: "ex. Nairobi Jazz Collective",
    dateLabel: "Date",
    datePlaceholder: "YYYY-MM-DD",
    timeLabel: "Heure",
    venueLabel: "Lieu",
    venuePlaceholder: "Nom du lieu",
    cityLabel: "Ville",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Décrivez ce qui rend cet événement spécial...",
    ticketPricingLabel: "Tarification des billets",
    pricingHintPrefix: "Définissez les prix en",
    pricingHintSuffix: "Laissez vide pour ignorer un niveau",
    tierEarlyBird: "Prévente",
    tierRegular: "Standard",
    tierVip: "VIP",
    addPhotoTitle: "Ajouter une photo",
    addPhotoSub: "Appuyez pour ajouter une image ou une vidéo de couverture",
    changePhoto: "Changer la photo",
    platformFeeNote: "Frais de plateforme : 5 % par billet vendu",
    publishing: "Publication...",
    publishEvent: "Publier l'événement",
    invalidDateTitle: "Date invalide",
    invalidDateMsg: "La date de l'événement doit être dans le futur (YYYY-MM-DD).",
    invalidPriceTitle: "Prix invalide",
    invalidPriceMsg: "Tous les prix doivent être des nombres valides.",
    publishFailedTitle: "Échec de la publication",
    publishFailedMsg: "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
    savedAsDraftTitle: "Enregistré comme brouillon",
    savedAsDraftMsg: "Votre événement a été créé mais n'a pas pu être soumis pour révision. Réessayez depuis votre liste d'événements.",
    submittedForReviewTitle: "Soumis pour révision",
    submittedForReviewSub: "Nous examinerons votre événement sous peu. Vous pourrez le partager une fois approuvé et en ligne.",
    publishedTitle: "Événement publié !",
    publishedSub: "Votre événement est maintenant en ligne. Partagez-le avec le monde.",
    shareEvent: "Partager l'événement",
    goToDashboard: "Aller au tableau de bord",
  },
  payoutsScreen: {
    signInTitle: "Connectez-vous pour voir les paiements",
    signInSub: "Consultez votre solde et demandez un paiement pour vos revenus d'événements.",
    availableBalance: "Solde disponible",
    couldntLoadBalance: "Impossible de charger votre solde. Tirez pour réessayer.",
    noBalanceYet: "Aucun revenu de billet confirmé pour l'instant — votre solde apparaîtra ici une fois les billets vendus.",
    available: "Disponible",
    request: "Demander",
    alreadyRequested: "Déjà demandé",
    requestAnyway: "Demander un paiement quand même",
    requestPayout: "Demander un paiement",
    closeForm: "Fermer le formulaire",
    amountLabel: "Montant",
    currencyLabel: "Devise",
    destinationLabel: "Destination (téléphone ou référence bancaire)",
    destinationPlaceholder: "ex. 0712 345 678",
    submitRequest: "Envoyer la demande",
    payoutHistory: "Historique des paiements",
    couldntLoadHistory: "Impossible de charger l'historique des paiements.",
    noPayoutsYet: "Aucune demande de paiement pour l'instant.",
    toDestination: "Vers",
    requested: "Demandé",
    statusPending: "En attente",
    statusPaid: "Payé",
    statusFailed: "Échoué",
    invalidAmountTitle: "Montant invalide",
    invalidAmountMsg: "Saisissez un montant positif à demander.",
    currencyRequiredTitle: "Devise requise",
    currencyRequiredMsg: "Saisissez une devise, ex. KES.",
    destinationRequiredTitle: "Destination requise",
    destinationRequiredMsg: "Saisissez un numéro de téléphone ou une référence bancaire pour le paiement.",
    payoutRequestedTitle: "Paiement demandé",
    payoutRequestedMsg: "Votre demande est en attente de révision.",
    requestFailedTitle: "Échec de la demande",
    requestFailedFallback: "Veuillez réessayer.",
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
    ok: "Sawa",
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
  settings: {
    language: "Lugha",
    rtlNote: "Kiarabu hutumia mpangilio wa kulia kwenda kushoto. Kubadilisha lugha kunahitaji kuanzisha upya programu ili mpangilio utumike kikamilifu.",
    programs: "Programu",
    tribeLeaders: "Kultr Tribe Leaders",
    tribeLeadersSub: "Programu ya ubalozi — ongoza na upate",
    connectivity: "Muunganisho",
    dataSaver: "Hali ya Kuhifadhi Data",
    dataSaverSub: "Hupakia matukio machache kwa miunganisho ya polepole",
    privacy: "Faragha",
    analyticsTracking: "Uchambuzi na Ufuatiliaji",
    analyticsTrackingSub: "Imezimwa kwa chaguo-msingi. Hutusaidia kuelewa jinsi programu inavyotumika — haiuzwi wala kushirikiwa kwa matangazo.",
    marketingMessages: "Ujumbe wa Masoko",
    marketingMessagesSub: "Imezimwa kwa chaguo-msingi. Tofauti na misimbo yako ya kuingia kwa SMS, ambayo hutumwa kila wakati bila kujali mpangilio huu.",
  },
  notifications: {
    markAllRead: "Weka zote kama zimesomwa",
    signInForNotifications: "Ingia ili upate arifa",
    signInSub: "Taarifa halisi kuhusu tikiti zako, matukio na malipo zitaonekana hapa.",
    couldntLoad: "Imeshindwa kupakia arifa",
    retry: "Jaribu tena",
    retrying: "Inajaribu tena…",
    allCaughtUp: "Umepata yote!",
    emptySub: "Shughuli halisi — uthibitisho wa tikiti, idhini za matukio, masasisho ya malipo — zitaonekana hapa.",
    newLabel: "Mpya",
    earlierLabel: "Awali",
    settingsHint: "Simamia mapendeleo ya arifa kwenye Mipangilio",
  },
  quests: {
    title: "Misheni za Kiutamaduni",
    subtitle: "Gundua. Pitia. Pata zawadi.",
    signInTitle: "Ingia ili uanze misheni",
    signInSub: "Fuatilia safari yako ya kiutamaduni na upate vitu vya kukusanya.",
    couldntLoad: "Imeshindwa kupakia misheni",
    checkConnection: "Angalia muunganisho wako na ujaribu tena.",
    legendTitle: "🏆 Hadithi ya Kultr",
    journeyTitle: "Safari Yako ya Misheni",
    allCompletedSub: "Misheni zote zimekamilika — umejenga urithi wako wa kiutamaduni.",
    allQuestsTab: "Zote",
    inProgressTab: "Zinaendelea",
    completedTab: "Zilizokamilika",
    noCompletedYet: "Hakuna misheni iliyokamilika bado.",
    nothingHere: "Hakuna kitu hapa kwa sasa.",
    done: "Imekamilika",
    checkInToEarn: "Ingia ili upate",
    checkIn: "Ingia",
    culturalLegacy: "Urithi wa Kiutamaduni",
    noCollectiblesYet: "Kamilisha misheni ili upate beji za kukusanya.",
    spendRewards: "Tumia KULTROINS zako kwenye Zawadi",
  },
  rewards: {
    title: "Zawadi",
    signInTitle: "Ingia ili uone zawadi zako",
    signInSub: "Pata KULTROINS kutoka misheni, kisha ufungue uzoefu.",
    couldntLoad: "Imeshindwa kupakia zawadi",
    checkConnection: "Angalia muunganisho wako na ujaribu tena.",
    balanceLabel: "Salio la KULTROIN",
    lifetimeEarned: "Jumla iliyopatikana",
    getPass: "Pata KULTR PASS",
    unlockMore: "Fungua Uzoefu Zaidi",
    noPerks: "Hakuna manufaa yanayopatikana kwa sasa.",
    unlock: "Fungua",
    locked: "Imefungwa",
    backToQuests: "Rudi kwenye Misheni za Kiutamaduni",
  },
  gamification: {
    title: "Mfululizo na Beji",
    signInTitle: "Ingia ili ufuatilie mfululizo wako",
    couldntLoad: "Imeshindwa kupakia wasifu wako",
    tryAgain: "Jaribu Tena",
    level: "Ngazi",
    viewProfile: "Angalia Wasifu",
    levelJourney: "Safari ya Ngazi",
    youAreHere: "Uko hapa",
    start: "Anza",
    kultrStreaks: "Mfululizo wa Kultr",
    streakDays: "Siku",
    startYourStreak: "Anzisha",
    startStreakSub: "Ingia kwenye tukio lako lijalo ili kuanza.",
    keepCheckingIn: "Mfululizo",
    keepStreakSub: "Endelea kuingia ili kujenga mfululizo wako!",
    dayEvent: "Siku za Matukio",
    streakBang: "Mfululizo!",
    keptItGoingSub: "Umejitokeza na kuonyesha uwezo. Endelea hivyo!",
    currentStreak: "Mfululizo wa Sasa",
    bestStreak: "Mfululizo Bora",
    daysLabel: "Siku",
    badges: "Beji",
    levelNewcomer: "Mgeni",
    levelExplorer: "Mgunduzi",
    levelWanderer: "Mzururaji",
    levelTrailblazer: "Kiongozi",
    levelCultureBearer: "Mbeba Utamaduni",
    levelLegend: "Hadithi",
    visitsSuffix: "ziara",
    journeyNewbie: "Mgeni",
    journeyExplorer: "Mgunduzi",
    journeyCulturalist: "Mtaalamu wa Utamaduni",
    journeyGlobalIcon: "Ikoni ya Kimataifa",
    badgeWeekWarrior: "Shujaa wa Wiki",
    badgeWeekWarriorDesc: "Mfuatano wa siku 7 wa kujiandikisha",
    badgeConsistent: "Mwenye Uthabiti",
    badgeConsistentDesc: "Matukio 2 mfululizo",
    badgeEventKing: "Mfalme wa Matukio",
    badgeEventKingDesc: "Umehudhuria matukio 10+",
    badgeCommunityBuilder: "Mjenzi wa Jamii",
    badgeCommunityBuilderDesc: "Umehudhuria matukio 5+",
  },
  creatorStudio: {
    title: "Studio ya Muundaji",
    welcomeBack: "Karibu tena,",
    welcomeSub: "Haya ndiyo yanayoendelea na matukio yako",
    payouts: "Malipo",
    payoutsSub: "Angalia salio lako na uombe malipo",
    overview: "Muhtasari",
    last8Weeks: "Wiki 8 zilizopita",
    activeEvents: "Matukio Yanayoendelea",
    avgTicketPrice: "Wastani wa Bei ya Tikiti",
    ticketSalesOverTime: "Mauzo ya Tikiti kwa Muda",
    salesByCity: "Mauzo kwa Mji",
    ticketsSoldPerCity: "Tikiti zilizouzwa kwa mji",
    revenueByEvent: "Mapato kwa Tukio",
    ticketsSoldPerEvent: "Tikiti zilizouzwa kwa tukio",
    recentEvents: "Matukio ya Hivi Karibuni",
    noEventsYet: "Bado hakuna matukio",
    noEventsYetSub: "Unda tukio lako la kwanza ili kuliona pamoja na mauzo yake hapa.",
    statusDraft: "Rasimu",
    statusInReview: "Inakaguliwa",
    statusLive: "Inaendelea",
    statusEnded: "Imeisha",
    statusCancelled: "Imeghairiwa",
  },
  createEvent: {
    listingIn: "Inaorodheshwa kwa",
    creatorChip: "Muundaji",
    categoryLabel: "Jamii",
    titleLabel: "Jina la Tukio",
    titlePlaceholder: "mfano: Nairobi Jazz Collective",
    dateLabel: "Tarehe",
    datePlaceholder: "YYYY-MM-DD",
    timeLabel: "Saa",
    venueLabel: "Mahali",
    venuePlaceholder: "Jina la mahali",
    cityLabel: "Mji",
    descriptionLabel: "Maelezo",
    descriptionPlaceholder: "Waeleze wahudhuriaji nini kinachofanya tukio hili kuwa la kipekee...",
    ticketPricingLabel: "Bei za Tikiti",
    pricingHintPrefix: "Weka bei kwa",
    pricingHintSuffix: "Acha wazi ili kuruka daraja",
    tierEarlyBird: "Ununuzi wa Mapema",
    tierRegular: "Kawaida",
    tierVip: "VIP",
    addPhotoTitle: "Ongeza Picha ya Tukio",
    addPhotoSub: "Gonga ili kupakia picha ya jalada au klipu ya video",
    changePhoto: "Badilisha Picha",
    platformFeeNote: "Ada ya jukwaa: 5% kwa kila tikiti iliyouzwa",
    publishing: "Inachapisha...",
    publishEvent: "Chapisha Tukio",
    invalidDateTitle: "Tarehe Batili",
    invalidDateMsg: "Tarehe ya tukio lazima iwe siku zijazo (YYYY-MM-DD).",
    invalidPriceTitle: "Bei Batili",
    invalidPriceMsg: "Bei zote lazima ziwe nambari halali.",
    publishFailedTitle: "Uchapishaji umeshindwa",
    publishFailedMsg: "Imeshindwa kufikia seva. Tafadhali angalia muunganisho wako na ujaribu tena.",
    savedAsDraftTitle: "Imehifadhiwa kama rasimu",
    savedAsDraftMsg: "Tukio lako liliundwa lakini halikuweza kuwasilishwa kwa ukaguzi bado. Jaribu kuliwasilisha tena kutoka kwenye orodha yako ya matukio.",
    submittedForReviewTitle: "Limewasilishwa kwa Ukaguzi",
    submittedForReviewSub: "Tutakagua tukio lako hivi karibuni. Utaweza kulishiriki mara litakapoidhinishwa na kuwa hai.",
    publishedTitle: "Tukio Limechapishwa!",
    publishedSub: "Tukio lako sasa liko hai. Lishiriki na ulimwengu.",
    shareEvent: "Shiriki Tukio",
    goToDashboard: "Nenda kwenye Dashibodi",
  },
  payoutsScreen: {
    signInTitle: "Ingia ili uone malipo",
    signInSub: "Angalia salio lako na uombe malipo ya mapato ya matukio yako.",
    availableBalance: "Salio Linalopatikana",
    couldntLoadBalance: "Imeshindwa kupakia salio lako. Vuta ili ujaribu tena.",
    noBalanceYet: "Bado hakuna mapato ya tikiti yaliyothibitishwa — salio lako litaonekana hapa mara tikiti zitakapouzwa.",
    available: "Linalopatikana",
    request: "Omba",
    alreadyRequested: "Tayari imeombwa",
    requestAnyway: "Omba malipo hata hivyo",
    requestPayout: "Omba Malipo",
    closeForm: "Funga fomu",
    amountLabel: "Kiasi",
    currencyLabel: "Sarafu",
    destinationLabel: "Mahali pa Kutuma (simu au marejeleo ya benki)",
    destinationPlaceholder: "mfano: 0712 345 678",
    submitRequest: "Wasilisha Ombi",
    payoutHistory: "Historia ya Malipo",
    couldntLoadHistory: "Imeshindwa kupakia historia ya malipo.",
    noPayoutsYet: "Bado hakuna maombi ya malipo.",
    toDestination: "Kwenda",
    requested: "Imeombwa",
    statusPending: "Inasubiri",
    statusPaid: "Imelipwa",
    statusFailed: "Imeshindwa",
    invalidAmountTitle: "Kiasi Batili",
    invalidAmountMsg: "Ingiza kiasi chanya cha kuomba.",
    currencyRequiredTitle: "Sarafu Inahitajika",
    currencyRequiredMsg: "Ingiza sarafu, mfano: KES.",
    destinationRequiredTitle: "Mahali pa Kutuma Panahitajika",
    destinationRequiredMsg: "Ingiza nambari ya simu au marejeleo ya benki ya kutuma malipo.",
    payoutRequestedTitle: "Malipo Yameombwa",
    payoutRequestedMsg: "Ombi lako liko katika ukaguzi.",
    requestFailedTitle: "Ombi Limeshindwa",
    requestFailedFallback: "Tafadhali jaribu tena.",
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
    ok: "حسناً",
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
  settings: {
    language: "اللغة",
    rtlNote: "تستخدم اللغة العربية تخطيطاً من اليمين إلى اليسار. يتطلب تغيير اللغة إعادة تشغيل التطبيق لتطبيق التخطيط بالكامل.",
    programs: "البرامج",
    tribeLeaders: "قادة قبيلة كلتر",
    tribeLeadersSub: "برنامج السفراء — قُد واكسب",
    connectivity: "الاتصال",
    dataSaver: "وضع توفير البيانات",
    dataSaverSub: "يحمّل عدداً أقل من الفعاليات للاتصالات البطيئة",
    privacy: "الخصوصية",
    analyticsTracking: "التحليلات والتتبع",
    analyticsTrackingSub: "معطّل افتراضياً. يساعدنا على فهم كيفية استخدام التطبيق — لا يُباع أو يُشارك أبداً لأغراض إعلانية.",
    marketingMessages: "الرسائل التسويقية",
    marketingMessagesSub: "معطّل افتراضياً. منفصل عن رسائل رمز الدخول التي تُرسل دائماً بغض النظر عن هذا الإعداد.",
  },
  notifications: {
    markAllRead: "تحديد الكل كمقروء",
    signInForNotifications: "سجّل الدخول لتلقي الإشعارات",
    signInSub: "تظهر هنا التحديثات الفعلية حول تذاكرك وفعالياتك ومدفوعاتك.",
    couldntLoad: "تعذّر تحميل الإشعارات",
    retry: "إعادة المحاولة",
    retrying: "جارٍ إعادة المحاولة…",
    allCaughtUp: "لقد اطلعت على كل شيء!",
    emptySub: "ستظهر هنا الأنشطة الفعلية — تأكيدات التذاكر، موافقات الفعاليات، تحديثات المدفوعات.",
    newLabel: "جديد",
    earlierLabel: "سابقاً",
    settingsHint: "أدر تفضيلات الإشعارات من الإعدادات",
  },
  quests: {
    title: "المهام الثقافية",
    subtitle: "استكشف. عِش التجربة. اكسب المكافآت.",
    signInTitle: "سجّل الدخول لبدء المهام",
    signInSub: "تابع رحلتك الثقافية واجمع القطع التذكارية.",
    couldntLoad: "تعذّر تحميل المهام",
    checkConnection: "تحقق من اتصالك وحاول مرة أخرى.",
    legendTitle: "🏆 أسطورة كلتر",
    journeyTitle: "رحلة مهامك",
    allCompletedSub: "اكتملت جميع المهام — لقد بنيت إرثك الثقافي.",
    allQuestsTab: "الكل",
    inProgressTab: "قيد التنفيذ",
    completedTab: "مكتملة",
    noCompletedYet: "لا توجد مهام مكتملة بعد.",
    nothingHere: "لا يوجد شيء هنا الآن.",
    done: "منجزة",
    checkInToEarn: "سجّل حضورك لتكسب",
    checkIn: "تسجيل الحضور",
    culturalLegacy: "الإرث الثقافي",
    noCollectiblesYet: "أكمل المهام لتكسب شارات تذكارية.",
    spendRewards: "أنفق KULTROINS في المكافآت",
  },
  rewards: {
    title: "المكافآت",
    signInTitle: "سجّل الدخول لعرض مكافآتك",
    signInSub: "اكسب KULTROINS من المهام، ثم افتح التجارب.",
    couldntLoad: "تعذّر تحميل المكافآت",
    checkConnection: "تحقق من اتصالك وحاول مرة أخرى.",
    balanceLabel: "رصيد KULTROIN",
    lifetimeEarned: "إجمالي المكتسب",
    getPass: "احصل على KULTR PASS",
    unlockMore: "افتح المزيد من التجارب",
    noPerks: "لا توجد مزايا متاحة حالياً.",
    unlock: "فتح",
    locked: "مغلق",
    backToQuests: "العودة إلى المهام الثقافية",
  },
  gamification: {
    title: "السلاسل والشارات",
    signInTitle: "سجّل الدخول لتتبع سلاسلك",
    couldntLoad: "تعذّر تحميل ملفك الشخصي",
    tryAgain: "حاول مرة أخرى",
    level: "المستوى",
    viewProfile: "عرض الملف الشخصي",
    levelJourney: "رحلة المستويات",
    youAreHere: "أنت هنا",
    start: "البداية",
    kultrStreaks: "سلاسل كلتر",
    streakDays: "يوم",
    startYourStreak: "ابدأ",
    startStreakSub: "سجّل حضورك في فعاليتك القادمة للبدء.",
    keepCheckingIn: "سلسلة",
    keepStreakSub: "استمر في تسجيل الحضور لبناء سلسلتك!",
    dayEvent: "أيام من الفعاليات",
    streakBang: "سلسلة!",
    keptItGoingSub: "لقد حضرت وأبليت حسناً. استمر!",
    currentStreak: "السلسلة الحالية",
    bestStreak: "أفضل سلسلة",
    daysLabel: "أيام",
    badges: "الشارات",
    levelNewcomer: "قادم جديد",
    levelExplorer: "مستكشف",
    levelWanderer: "متجوّل",
    levelTrailblazer: "رائد",
    levelCultureBearer: "حامل الثقافة",
    levelLegend: "أسطورة",
    visitsSuffix: "زيارات",
    journeyNewbie: "مبتدئ",
    journeyExplorer: "مستكشف",
    journeyCulturalist: "خبير ثقافي",
    journeyGlobalIcon: "أيقونة عالمية",
    badgeWeekWarrior: "محارب الأسبوع",
    badgeWeekWarriorDesc: "سلسلة تسجيل حضور لمدة 7 أيام",
    badgeConsistent: "مواظب",
    badgeConsistentDesc: "حضور فعاليتين متتاليتين",
    badgeEventKing: "ملك الفعاليات",
    badgeEventKingDesc: "حضور أكثر من 10 فعاليات",
    badgeCommunityBuilder: "باني المجتمع",
    badgeCommunityBuilderDesc: "حضور أكثر من 5 فعاليات",
  },
  creatorStudio: {
    title: "استوديو المنشئ",
    welcomeBack: "مرحباً بعودتك،",
    welcomeSub: "إليك آخر مستجدات فعالياتك",
    payouts: "المدفوعات",
    payoutsSub: "اطّلع على رصيدك واطلب دفعة",
    overview: "نظرة عامة",
    last8Weeks: "آخر 8 أسابيع",
    activeEvents: "الفعاليات النشطة",
    avgTicketPrice: "متوسط سعر التذكرة",
    ticketSalesOverTime: "مبيعات التذاكر عبر الزمن",
    salesByCity: "المبيعات حسب المدينة",
    ticketsSoldPerCity: "التذاكر المباعة لكل مدينة",
    revenueByEvent: "الإيرادات حسب الفعالية",
    ticketsSoldPerEvent: "التذاكر المباعة لكل فعالية",
    recentEvents: "الفعاليات الأخيرة",
    noEventsYet: "لا توجد فعاليات بعد",
    noEventsYetSub: "أنشئ فعاليتك الأولى لتراها مع مبيعاتها هنا.",
    statusDraft: "مسودة",
    statusInReview: "قيد المراجعة",
    statusLive: "مباشر",
    statusEnded: "منتهية",
    statusCancelled: "ملغاة",
  },
  createEvent: {
    listingIn: "الإدراج بعملة",
    creatorChip: "منشئ",
    categoryLabel: "الفئة",
    titleLabel: "عنوان الفعالية",
    titlePlaceholder: "مثال: Nairobi Jazz Collective",
    dateLabel: "التاريخ",
    datePlaceholder: "YYYY-MM-DD",
    timeLabel: "الوقت",
    venueLabel: "المكان",
    venuePlaceholder: "اسم المكان",
    cityLabel: "المدينة",
    descriptionLabel: "الوصف",
    descriptionPlaceholder: "أخبر الحضور بما يجعل هذه الفعالية مميزة...",
    ticketPricingLabel: "أسعار التذاكر",
    pricingHintPrefix: "حدد الأسعار بعملة",
    pricingHintSuffix: "اترك الحقل فارغاً لتخطي فئة",
    tierEarlyBird: "الحجز المبكر",
    tierRegular: "عادي",
    tierVip: "VIP",
    addPhotoTitle: "أضف صورة للفعالية",
    addPhotoSub: "اضغط لتحميل صورة غلاف أو مقطع فيديو ترويجي",
    changePhoto: "تغيير الصورة",
    platformFeeNote: "رسوم المنصة: ٥٪ لكل تذكرة مباعة",
    publishing: "جار النشر...",
    publishEvent: "نشر الفعالية",
    invalidDateTitle: "تاريخ غير صالح",
    invalidDateMsg: "يجب أن يكون تاريخ الفعالية في المستقبل (YYYY-MM-DD).",
    invalidPriceTitle: "سعر غير صالح",
    invalidPriceMsg: "يجب أن تكون جميع الأسعار أرقاماً صالحة.",
    publishFailedTitle: "فشل النشر",
    publishFailedMsg: "تعذّر الوصول إلى الخادم. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
    savedAsDraftTitle: "تم الحفظ كمسودة",
    savedAsDraftMsg: "تم إنشاء فعاليتك لكن تعذّر إرسالها للمراجعة بعد. حاول إرسالها مرة أخرى من قائمة فعالياتك.",
    submittedForReviewTitle: "تم الإرسال للمراجعة",
    submittedForReviewSub: "سنراجع فعاليتك قريباً. ستتمكن من مشاركتها بمجرد الموافقة عليها وتفعيلها.",
    publishedTitle: "تم نشر الفعالية!",
    publishedSub: "فعاليتك الآن مباشرة. شاركها مع العالم.",
    shareEvent: "شارك الفعالية",
    goToDashboard: "الذهاب إلى لوحة التحكم",
  },
  payoutsScreen: {
    signInTitle: "سجّل الدخول لعرض المدفوعات",
    signInSub: "اطّلع على رصيدك واطلب دفعة من إيرادات فعالياتك.",
    availableBalance: "الرصيد المتاح",
    couldntLoadBalance: "تعذّر تحميل رصيدك. اسحب لإعادة المحاولة.",
    noBalanceYet: "لا توجد إيرادات تذاكر مؤكدة بعد — سيظهر رصيدك هنا بمجرد بيع التذاكر.",
    available: "متاح",
    request: "طلب",
    alreadyRequested: "تم طلبه بالفعل",
    requestAnyway: "اطلب دفعة على أي حال",
    requestPayout: "طلب دفعة",
    closeForm: "إغلاق النموذج",
    amountLabel: "المبلغ",
    currencyLabel: "العملة",
    destinationLabel: "الوجهة (رقم هاتف أو مرجع بنكي)",
    destinationPlaceholder: "مثال: 0712 345 678",
    submitRequest: "إرسال الطلب",
    payoutHistory: "سجل المدفوعات",
    couldntLoadHistory: "تعذّر تحميل سجل المدفوعات.",
    noPayoutsYet: "لا توجد طلبات دفع بعد.",
    toDestination: "إلى",
    requested: "طُلب في",
    statusPending: "قيد الانتظار",
    statusPaid: "مدفوع",
    statusFailed: "فشل",
    invalidAmountTitle: "مبلغ غير صالح",
    invalidAmountMsg: "أدخل مبلغاً موجباً للطلب.",
    currencyRequiredTitle: "العملة مطلوبة",
    currencyRequiredMsg: "أدخل عملة، مثل KES.",
    destinationRequiredTitle: "الوجهة مطلوبة",
    destinationRequiredMsg: "أدخل رقم هاتف أو مرجعاً بنكياً لصرف الدفعة إليه.",
    payoutRequestedTitle: "تم طلب الدفعة",
    payoutRequestedMsg: "طلبك قيد المراجعة.",
    requestFailedTitle: "فشل الطلب",
    requestFailedFallback: "يرجى المحاولة مرة أخرى.",
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
