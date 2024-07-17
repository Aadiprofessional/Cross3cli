export const products = [
    {
      id: 1,
      productName: 'Product 1',
      mainImage: require('../assets/product2.png'), // Example path to your image
      description: 'Description of Product 1',
      price: '99.99',
      colorsAvailable: ['red', 'blue', 'green'], // Example array of colors
      specifications: [
        { label: 'Size', value: 'Large' },
        { label: 'Material', value: 'Cotton' },
        { label: 'Material', value: 'Cotton' },
        { label: 'Material', value: 'Cotton' },
      ],
      deliveryTime: '2-3 days',
      images: {
        red: [
          require('../assets/product.png'),
          require('../assets/product.png'),
          require('../assets/product.png'),
        ],
        blue: [
          require('../assets/product.png'),
          require('../assets/product.png'),
          require('../assets/product.png'),
        ],
        green: [
          require('../assets/product2.png'),
          require('../assets/product2.png'),
          require('../assets/product.png'),
        ],
      },
    },
    // Add more products as needed
  ];
  