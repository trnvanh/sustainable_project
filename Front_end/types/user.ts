export type UserProfile = {
    id: string;
    email: string;
    name: string;
    phone: string;
    credits: number;
    rescuedMeals: number;
    co2SavedKg: number;
    moneySavedEur: number;
    historyOrderIds: string[];
    preferences: {
      theme: 'light' | 'dark';
      language: 'en' | 'fi' | 'vi';
      notifications: boolean;
    };
    favorites: {
      items: string[];  
      stores: string[]; 
    };
  };
  