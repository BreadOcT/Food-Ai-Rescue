
export type ScreenName = 
  | 'LOGIN' 
  | 'SIGNUP' 
  | 'FORGOT_PASSWORD' 
  | 'VERIFICATION' 
  | 'NEW_PASSWORD' 
  | 'HOME' 
  | 'PROFILE' 
  | 'EDIT_PROFILE'    
  | 'CHANGE_PASSWORD' 
  | 'NOTIFICATION_SETTINGS' 
  | 'CHECK_QUALITY' 
  | 'QUALITY_HISTORY'
  | 'NOTIFICATIONS'
  | 'PARTNER_DASHBOARD'
  | 'PARTNER_INVENTORY'
  | 'TRANSACTIONS'
  | 'UPLOAD_PRODUCT'
  | 'SUCCESS'
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_USERS'
  | 'ADMIN_PRODUCTS'
  | 'ADMIN_REPORTS'
  | 'ADMIN_SETTINGS'
  | 'MAP_VIEW'        
  | 'PARTNER_DETAIL'  
  | 'RESERVATION_FORM' 
  | 'RESERVATION_SUCCESS' 
  | 'IMPACT_REPORT'
  | 'HISTORY'          
  | 'ADD_ADDRESS'
  | 'EXPLORE'          
  | 'LOCATION_SELECT'
  | 'CREATE_REQUEST'
  | 'HELP_FAQ'
  | 'SAVED_ITEMS'
  | 'FAVORITES';

export interface User {
  id?: string | number;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  bio?: string;
  role?: 'USER' | 'PARTNER' | 'ADMIN';
}

export interface Partner {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  pickupTime: string;
  status: 'sharing' | 'closed';
  tags: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'promo' | 'order' | 'system' | 'event';
  read: boolean;
}
