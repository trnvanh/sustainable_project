export type ProductRequest = {
}

export type ProductResponse = {
    id: number,
    name: string,
    price: number,
    pickupTime: string,
    distance: number,
    portionsLeft: number,
    rating: number,
    image: string,
    location: {
        restaurant: string,
        address: string
    },
    description: string
}