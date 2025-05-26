export type FavoriteRequest = {
}

export type FavoriteResponse = {
    id: number;
    name: string;
    description: string;
    image: string | null;
    price: number;
    pickupTime: string;
    portionsLeft: number;
    rating: number;
    expiringDate: string;
    status: boolean;
    favourite: number;
    categories: {
        id: number;
        name: string;
        description: string;
        image: string | null;
    }[];
    storeId: number;
    createdDate: string;
    modifiedDate: string;
    createdBy: number;
    modifiedBy: number;
};

export type StoreResponse = {
    id: number;
    name: string;
    description: string;
    address: string;
    phoneNumber: string;
    email: string;
    website: string;
    image: string;
    rating: number;
    openingHours: string;
    ownerId: number;
};