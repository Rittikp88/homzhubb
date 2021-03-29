export const RouteNames = {
  publicRoutes: {
    APP_BASE: '/',
    ABOUT: '/about',
    FEATURED: '/featured',
    PRICING: '/pricing',
    LOGIN: '/login',
    SIGNUP: '/signup',
    OTP_VERIFICATION: '/otp',
    MOBILE_VERIFICATION: '/mobileVerification',
    TERMS_CONDITION: '/terms&Condition',
    PRIVACY_POLICY: '/privacyPolicy',
    UPLOAD: '/upload',
    MAHARASHTRA_CONNECT: '/maharashtra_connect',
    FAQS: '/faqs',
  },
  protectedRoutes: {
    /* Mention protected route names here */
    DASHBOARD: '/dashboard',
    FINANCIALS: '/dashboard/financial',
    PORTFOLIO: '/dashboard/portfolio',
    ADD_PROPERTY: '/dashboard/addProperty',
    ADD_LISTING: '/dashboard/addListing',
    PROPERTY_DETAIL: '/dashboard/propertyDetail',
    SEARCH_PROPERTY: '/dashboard/searchProperty',
    PROPERTY_VIEW: '/dashboard/propertyView',
    PROPERTY_SELECTED: '/dashboard/portfolio/propertySelected',
    // WRITE YOUR routes here accordingly
    NOTIFICATIONS: '',
    TICKETS: '',
    KYC_DOCUMENTS: '',
    SAVED_PROPERTIES: '',
    PROPERTY_VISITS: '',
    OFFERS: '',
    NEW_LAUNCHES: '',
    MARKET_TRENDS: '',
    VALUE_ADDED_SERVICES: '',
    SETTINGS: '',
    MANAGE_SUBSCRIPTION: '',
    PAYMENT_METHODS: '',
    LOGOUT: '',
    HELP_SUPPORT: '/dashboard/help&Support',
    REFER_EARN: '/dashboard/refer&Earn',
  },
};

export enum ScreensKeys {
  Dashboard = 'Dashboard',
}
