export type Category = {
    name: string;
    image: string;
  };
  
  export type RootStackParamList = {
    Home: undefined;
    CategoryTransition: { category: Category };
    CategoryList: { category: Category };
  };