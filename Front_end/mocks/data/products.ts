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
      image: sushiSet
    },
    {
      id: '102',
      name: 'Veggie Box',
      price: '3.5 €',
      pickupTime: '11:30 - 13:30',
      distance: '2.0 km',
      portionsLeft: 0,
      image: veggieBox
    },
    {
      id: '103',
      name: 'Pasta Salad',
      price: '4 €',
      pickupTime: '13:00 - 15:00',
      distance: '0.8 km',
      portionsLeft: 0,
      image: pastaSalad
    },
    {
      id: '104',
      name: 'Fruit Basket',
      price: '2.5 €',
      pickupTime: '14:00 - 16:00',
      distance: '1.2 km',
      portionsLeft: 0,
      image: fruitBasket
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
      image: tofuBowl
    },
    {
      id: '202',
      name: 'Quinoa Salad',
      price: '3 €',
      pickupTime: '16:00 - 19:00',
      distance: '0.7 km',
      portionsLeft: 5,
      image: quinoaSalad
    },
    {
      id: '203',
      name: 'Vegan Burger',
      price: '4 €',
      pickupTime: '17:00 - 20:00',
      distance: '1.0 km',
      portionsLeft: 1,
      image: veganBurger
    },
    {
      id: '204',
      name: 'Chickpea Curry',
      price: '3.5 €',
      pickupTime: '18:00 - 21:00',
      distance: '1.3 km',
      portionsLeft: 4,
      image: chickpeaCurry
    },
    {
      id: '205',
      name: 'Falafel Wrap',
      price: '2.5 €',
      pickupTime: '19:00 - 22:00',
      distance: '0.9 km',
      portionsLeft: 3, 
      image: falafelWrap
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
      image: smoothieCombo
    },
    {
      id: '302',
      name: 'Juice',
      price: '1 €',
      pickupTime: '17:00 - 19:00',
      distance: '0.9 km',
      portionsLeft: 1,
      image: juice
    },
    {
      id: '303',
      name: 'Salad Bowl',
      price: '1 €',
      pickupTime: '18:00 - 21:00',
      distance: '0.6 km',
      portionsLeft: 2,
      image: saladBowl
    },
    {
      id: '304',
      name: 'Pasta',
      price: '1 €',
      pickupTime: '19:00 - 22:00',
      distance: '0.4 km',
      portionsLeft: 0,
      image: pasta
    }, 
    {
      id: '305',
      name: 'Pizza Slice',
      price: '1 €',
      pickupTime: '20:00 - 23:00',
      distance: '0.8 km',
      portionsLeft: 5,
      image: pizzaSlice
    },
  ];
  