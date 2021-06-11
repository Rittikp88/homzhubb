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
    TERMS_SERVICES_PAYMENTS: '/terms-Services&Payments',
    PRIVACY_POLICY: '/privacyPolicy',
    UPLOAD: '/upload',
    MAHARASHTRA_CONNECT: '/maharashtra_connect',
    FAQS: '/faqs',
    MEMBERSHIP_PLANS: '/membership-plans',
    ERROR404: '/*',
    ERROR504: '/gateway-timeout',
    ERROR: '/error',
  },
  protectedRoutes: {
    /* Mention protected route names here */
    DASHBOARD: '/dashboard',
    FINANCIALS: '/dashboard/financial',
    PORTFOLIO: '/dashboard/portfolio',
    ADD_PROPERTY: '/dashboard/addProperty',
    PORTFOLIO_ADD_PROPERTY: '/dashboard/portfolio/addProperty',
    ADD_LISTING: '/dashboard/addListing',
    PROPERTY_DETAIL: '/dashboard/propertyDetail',
    SEARCH_PROPERTY: '/dashboard/searchProperty',
    PROPERTY_VIEW: '/dashboard/propertyView',
    PROPERTY_SELECTED: '/dashboard/portfolio/propertySelected',
    SAVED_PROPERTIES: '/dashboard/savedProperties',
    OFFERS: '/dashboard/offers',
    // WRITE YOUR routes here accordingly
    NOTIFICATIONS: '/dashboard/notifications',
    TICKETS: '',
    KYC_DOCUMENTS: '',
    PROPERTY_VISITS: '/dashboard/propertyVisits',
    NEW_LAUNCHES: '',
    MARKET_TRENDS: '',
    SELECT_PROPERTY: '/dashboard/valueAddedService/selectProperty',
    SELECT_SERVICES: '/dashboard/valueAddedService/selectServices',
    VALUE_ADDED_SERVICES: '/dashboard/valueAddedService',
    SETTINGS: '/dashboard/settings',
    MANAGE_SUBSCRIPTION: '',
    PAYMENT_METHODS: '',
    LOGOUT: '',
    HELP_SUPPORT: '/dashboard/help&Support',
    REFER_EARN: '/dashboard/refer&Earn',
    PROFILE: '/dashboard/profile',
    PROTECTEDERROR404: '/dashboard/*',
  },
};

export enum ScreensKeys {
  Dashboard = 'Dashboard',
}
