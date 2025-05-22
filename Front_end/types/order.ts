export type OrderItem = {
    id: string;
    name: string;
    price: string;
    pickupTime?: string;
    distance?: string;
    portionsLeft: number;
    rating: number;
    image?: any; // or ImageSourcePropType if typed strictly
    location?: {
      restaurant: string;
      address: string;
    };
    description: string;
  };
  