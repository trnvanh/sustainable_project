const sushiSet = require('@/assets/images/products/sushi_set.jpg');
const veggieBox = require('@/assets/images/products/veggie_box.jpg');
const pastaSalad = require('@/assets/images/products/pasta_salad.jpg');
const fruitBasket = require('@/assets/images/products/fruit_basket.jpg');
const tofuBowl = require('@/assets/images/products/tofu_bowl.jpg');
const quinoaSalad = require('@/assets/images/products/quinoa_salad.jpg');
const veganBurger = require('@/assets/images/products/vegan_burger.jpg');
const chickpeaCurry = require('@/assets/images/products/chickpea_curry.jpg');
const falafelWrap = require('@/assets/images/products/falafel_wrap.jpg');
const smoothieCombo = require('@/assets/images/products/smoothie_combo.jpg');
const juice = require('@/assets/images/products/juice.jpg');
const saladBowl = require('@/assets/images/products/salad_bowl.jpg');
const pasta = require('@/assets/images/products/pasta.jpg');
const pizzaSlice = require('@/assets/images/products/pizza_slice.jpg');

export const mockHistoryOrders = [
  {
    id: '101',
    name: 'Sushi Set',
    price: '5 €',
    pickupTime: '12:00 - 14:00',
    distance: '1.5 km',
    portionsLeft: 0,
    rating: 4.5,
    image: sushiSet,
    location: { restaurant: 'C Sushi Restaurant', address: 'Opiskelijankatu 1, 33720 Tampere' },
    description: 'A delicious sushi set with a variety of rolls and sashimi.',
    date: '2025-05-01',
    customerFeedback: {
      customerRating: 5,
      feedback: 'Absolutely delicious and fresh!',
    }
  },
  {
    id: '102',
    name: 'Veggie Box',
    price: '3.5 €',
    pickupTime: '11:30 - 13:30',
    distance: '2.0 km',
    portionsLeft: 0,
    rating: 4.0,
    image: veggieBox,
    location: { restaurant: 'Zarillo Hervanta', address: 'Pietilänkatu 2, 33720 Tampere' },
    description: 'A box filled with fresh vegetables and a tasty dip.',
    date: '2025-05-02',
    customerFeedback: {
      customerRating: 4,
      feedback: 'Nice variety of veggies, good value for money!',
    }
  },
  {
    id: '103',
    name: 'Pasta Salad',
    price: '4 €',
    pickupTime: '13:00 - 15:00',
    distance: '0.8 km',
    portionsLeft: 0,
    rating: 4.2,
    image: pastaSalad,
    location: { restaurant: 'Juvenes Ravintola Newton', address: 'Korkeakoulunkatu 6, 33720 Tampere' },
    description: 'A refreshing pasta salad with seasonal vegetables and dressing.',
    date: '2025-05-03',
    customerFeedback: {
      customerRating: 3.5,
      feedback: 'Tasty, but could use more dressing.',
    }
  },
  {
    id: '104',
    name: 'Fruit Basket',
    price: '2.5 €',
    pickupTime: '14:00 - 16:00',
    distance: '1.2 km',
    portionsLeft: 0,
    rating: 4.8,
    image: fruitBasket,
    location: { restaurant: 'Café Konehuone', address: 'Korkeakoulunkatu 6 a, 33720 Tampere' },
    description: 'A basket filled with a variety of fresh fruits.',
    date: '2025-05-04',
    customerFeedback: {
      customerRating: 4.7,
      feedback: 'Super fresh and sweet!',
    }
  },
];

  
  export const mockNearbyOffers = [
    {
      id: '201',
      name: 'Tofu Bowl',
      price: '2 €',
      pickupTime: '15:00 - 18:00',
      distance: '0.5 km',
      portionsLeft: 2,
      rating: 4.0,
      image: tofuBowl,
      location: {restaurant: 'Sodexo Hermia 6', address: 'Visiokatu 3, 33720 Tampere'},
      description: 'A healthy bowl with tofu, rice, and vegetables.',
    },
    {
      id: '202',
      name: 'Quinoa Salad',
      price: '3 €',
      pickupTime: '16:00 - 19:00',
      distance: '0.7 km',
      portionsLeft: 5,
      rating: 4.3,
      image: quinoaSalad,
      location: {restaurant: 'Sodexo Hertsi', address: 'Korkeakoulunkatu 4, 33720 Tampere'},
      description: 'A nutritious salad with quinoa, vegetables, and dressing.',
    },
    {
      id: '203',
      name: 'Vegan Burger',
      price: '4 €',
      pickupTime: '17:00 - 20:00',
      distance: '1.0 km',
      portionsLeft: 1,
      rating: 4.7,
      image: veganBurger,
      location: {restaurant: 'Reaktori', address: 'Korkeakoulunkatu 7, 33720 Tampere'},
      description: 'A delicious vegan burger with a plant-based patty and fresh toppings.',
    },
    {
      id: '204',
      name: 'Chickpea Curry',
      price: '3.5 €',
      pickupTime: '18:00 - 21:00',
      distance: '1.3 km',
      portionsLeft: 4,
      rating: 4.6,
      image: chickpeaCurry,
      location: {restaurant: 'Gate of India', address: 'Pietilänkatu 2, 33720 Tampere'},
      description: 'A flavorful chickpea curry served with rice.',
    },
    {
      id: '205',
      name: 'Falafel Wrap',
      price: '2.5 €',
      pickupTime: '19:00 - 22:00',
      distance: '0.9 km',
      portionsLeft: 3,
      rating: 4.4, 
      image: falafelWrap,
      location: {restaurant: 'Sodexo Hertsi', address: 'Korkeakoulunkatu 4, 33720 Tampere'},
      description: 'A tasty falafel wrap with fresh vegetables and sauce.',
    },
  ];
  
  export const mockCurrentDeals = [
    {
      id: '301',
      name: 'Smoothie Combo',
      price: '1 €',
      pickupTime: '16:00 - 20:00',
      distance: '1.1 km',
      portionsLeft: 3,
      rating: 4.5,
      image: smoothieCombo,
      location: {restaurant: 'Kontukeittio Hervanta', address: 'Pietilänkatu 5, 33720 Tampere'},
      description: 'A refreshing smoothie combo with seasonal fruits.',
    },
    {
      id: '302',
      name: 'Juice',
      price: '1 €',
      pickupTime: '17:00 - 19:00',
      distance: '0.9 km',
      portionsLeft: 1,
      rating: 4.2,
      image: juice,
      location: {restaurant: 'Ravintola Hertta By Linkosuo', address: 'Hermiankatu 1, 33720 Tampere'},
      description: 'A fresh juice made from organic fruits and vegetables.',
    },
    {
      id: '303',
      name: 'Salad Bowl',
      price: '1 €',
      pickupTime: '18:00 - 21:00',
      distance: '0.6 km',
      portionsLeft: 2,
      rating: 4.1,
      image: saladBowl,
      location: {restaurant: 'Lounasravintola Orvokki', address: 'Hermiankatu 6-8, 33720 Tampere'},
      description: 'A healthy salad bowl with a variety of fresh ingredients.',
    },
    {
      id: '304',
      name: 'Pasta',
      price: '1 €',
      pickupTime: '19:00 - 22:00',
      distance: '0.4 km',
      portionsLeft: 1,
      rating: 4.3,
      image: pasta,
      location: {restaurant: 'Lounasravintola Orvokki', address: 'Hermiankatu 6-8, 33720 Tampere'},
      description: 'A delicious pasta dish with seasonal vegetables and sauce.',
    }, 
    {
      id: '305',
      name: 'Pizza Slice',
      price: '1 €',
      pickupTime: '20:00 - 23:00',
      distance: '0.8 km',
      portionsLeft: 5,
      rating: 4.4,
      image: pizzaSlice,
      location: {restaurant: 'Rax Pizzabuffet', address: 'Pietilänkatu 2, 33720 Tampere'},
      description: 'A tasty pizza slice with fresh toppings.',
    },
  ];
  