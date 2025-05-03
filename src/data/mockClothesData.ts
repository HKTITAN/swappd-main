export interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  price: number; // In SwapCoins
  originalPrice?: number; // Original retail price in dollars
  category: string;
  subcategory: string;
  size: string;
  condition: 'Like New' | 'Good' | 'Fair';
  color: string;
  gender: 'Men' | 'Women' | 'Unisex';
  description: string;
  sustainabilityImpact: string;
  images: string[];
  tags: string[];
  dateAdded: string;
  isAvailable: boolean;
}

export const clothingCategories = [
  {
    name: 'Tops',
    subcategories: ['T-Shirts', 'Shirts', 'Blouses', 'Sweaters', 'Hoodies', 'Tank Tops']
  },
  {
    name: 'Bottoms',
    subcategories: ['Jeans', 'Trousers', 'Shorts', 'Skirts', 'Leggings']
  },
  {
    name: 'Dresses',
    subcategories: ['Casual', 'Formal', 'Mini', 'Midi', 'Maxi']
  },
  {
    name: 'Outerwear',
    subcategories: ['Jackets', 'Coats', 'Blazers', 'Vests']
  },
  {
    name: 'Activewear',
    subcategories: ['Sports Bras', 'Leggings', 'Shorts', 'Tops', 'Sets']
  },
  {
    name: 'Accessories',
    subcategories: ['Hats', 'Scarves', 'Bags', 'Jewelry', 'Belts']
  },
  {
    name: 'Footwear',
    subcategories: ['Sneakers', 'Boots', 'Heels', 'Sandals', 'Flats']
  }
];

export const mockClothingItems: ClothingItem[] = [
  // Tops
  {
    id: '1001',
    name: 'Organic Cotton T-Shirt',
    brand: 'EcoWear',
    price: 35,
    originalPrice: 75,
    category: 'Tops',
    subcategory: 'T-Shirts',
    size: 'M',
    condition: 'Like New',
    color: 'White',
    gender: 'Unisex',
    description: 'Minimalist organic cotton t-shirt with a relaxed fit. Features a crew neck and short sleeves. Made from 100% sustainable cotton.',
    sustainabilityImpact: 'Saves 2,700 liters of water compared to conventional cotton production.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800',
    ],
    tags: ['cotton', 'casual', 'basics', 'sustainable'],
    dateAdded: '2025-04-15',
    isAvailable: true
  },
  {
    id: '1002',
    name: 'Vintage Denim Shirt',
    brand: 'Levi\'s',
    price: 65,
    originalPrice: 110,
    category: 'Tops',
    subcategory: 'Shirts',
    size: 'L',
    condition: 'Good',
    color: 'Blue',
    gender: 'Unisex',
    description: 'Classic vintage denim shirt from the 90s. Features a button-down front, chest pockets, and slightly faded wash for that authentic look.',
    sustainabilityImpact: 'Extends the lifecycle of quality denim and reduces demand for new production.',
    images: [
      'https://images.unsplash.com/photo-1588187284031-34ea3b5f9aad?q=80&w=800',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800',
    ],
    tags: ['denim', 'vintage', '90s', 'retro'],
    dateAdded: '2025-04-20',
    isAvailable: true
  },
  {
    id: '1003',
    name: 'Cashmere Sweater',
    brand: 'Everlane',
    price: 95,
    originalPrice: 220,
    category: 'Tops',
    subcategory: 'Sweaters',
    size: 'S',
    condition: 'Like New',
    color: 'Camel',
    gender: 'Women',
    description: 'Luxuriously soft cashmere sweater with ribbed trim at the neck, cuffs, and hem. Perfect for layering or wearing on its own.',
    sustainabilityImpact: 'Quality cashmere lasts for years, reducing the need for frequent replacements.',
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800',
      'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=800',
    ],
    tags: ['cashmere', 'luxury', 'sweater', 'winter', 'soft'],
    dateAdded: '2025-04-10',
    isAvailable: true
  },
  
  // Bottoms
  {
    id: '2001',
    name: 'High-Waisted Mom Jeans',
    brand: 'Zara',
    price: 55,
    originalPrice: 89,
    category: 'Bottoms',
    subcategory: 'Jeans',
    size: '28',
    condition: 'Good',
    color: 'Light Blue',
    gender: 'Women',
    description: 'Vintage-inspired high-waisted mom jeans with a relaxed fit through the hips and legs. Features a classic five-pocket design and ankle length.',
    sustainabilityImpact: 'Reusing denim saves approximately 3,800 liters of water compared to producing a new pair.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800',
    ],
    tags: ['denim', 'high-waist', 'mom jeans', 'vintage'],
    dateAdded: '2025-04-22',
    isAvailable: true
  },
  {
    id: '2002',
    name: 'Linen Trousers',
    brand: 'COS',
    price: 60,
    originalPrice: 125,
    category: 'Bottoms',
    subcategory: 'Trousers',
    size: '32',
    condition: 'Like New',
    color: 'Beige',
    gender: 'Men',
    description: 'Relaxed-fit linen trousers with an elasticated waistband and drawstring. Perfect for warm weather with their lightweight, breathable fabric.',
    sustainabilityImpact: 'Linen requires less water to grow than cotton and every part of the plant is used.',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800',
      'https://images.unsplash.com/photo-1592878849122-facb97520f9e?q=80&w=800',
    ],
    tags: ['linen', 'summer', 'sustainable', 'breathable'],
    dateAdded: '2025-04-23',
    isAvailable: true
  },
  {
    id: '2003',
    name: 'Pleated Midi Skirt',
    brand: '& Other Stories',
    price: 45,
    originalPrice: 89,
    category: 'Bottoms',
    subcategory: 'Skirts',
    size: 'M',
    condition: 'Good',
    color: 'Black',
    gender: 'Women',
    description: 'Elegant pleated midi skirt with an A-line silhouette and hidden side zip closure. Versatile piece that can be dressed up or down.',
    sustainabilityImpact: 'Extending the life of clothes by just 9 months reduces their environmental impact by 20-30%.',
    images: [
      'https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=800',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800',
    ],
    tags: ['pleated', 'midi', 'elegant', 'versatile', 'black'],
    dateAdded: '2025-04-05',
    isAvailable: true
  },
  
  // Dresses
  {
    id: '3001',
    name: 'Floral Wrap Dress',
    brand: 'Reformation',
    price: 85,
    originalPrice: 198,
    category: 'Dresses',
    subcategory: 'Midi',
    size: 'S',
    condition: 'Like New',
    color: 'Multicolor',
    gender: 'Women',
    description: 'Beautiful floral print wrap dress with a V-neckline, tie waist, and midi length. Made from lightweight, recycled fabric perfect for spring and summer.',
    sustainabilityImpact: 'Made from recycled materials, saving water and reducing carbon emissions.',
    images: [
      'https://images.unsplash.com/photo-1612722432474-b971cdcea546?q=80&w=800',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800',
    ],
    tags: ['floral', 'wrap dress', 'summer', 'recycled', 'midi'],
    dateAdded: '2025-04-01',
    isAvailable: true
  },
  {
    id: '3002',
    name: 'Little Black Dress',
    brand: 'Theory',
    price: 95,
    originalPrice: 275,
    category: 'Dresses',
    subcategory: 'Formal',
    size: 'M',
    condition: 'Like New',
    color: 'Black',
    gender: 'Women',
    description: 'Classic little black dress with a fitted silhouette, jewel neckline, and cap sleeves. Perfect for cocktail events or dressed down with a denim jacket.',
    sustainabilityImpact: 'Timeless design ensures years of wear versus fast fashion alternatives.',
    images: [
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=800',
      'https://images.unsplash.com/flagged/photo-1585052201332-b8c0ce30972f?q=80&w=800',
    ],
    tags: ['LBD', 'cocktail', 'formal', 'classic', 'timeless'],
    dateAdded: '2025-03-28',
    isAvailable: true
  },
  
  // Outerwear
  {
    id: '4001',
    name: 'Vintage Leather Jacket',
    brand: 'All Saints',
    price: 150,
    originalPrice: 450,
    category: 'Outerwear',
    subcategory: 'Jackets',
    size: 'M',
    condition: 'Good',
    color: 'Black',
    gender: 'Unisex',
    description: 'Classic black leather biker jacket with asymmetric zip closure, notched lapels, and multiple pockets. Shows some signs of wear which adds to its character.',
    sustainabilityImpact: 'Reusing leather goods prevents waste and reduces demand for new leather production.',
    images: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800',
    ],
    tags: ['leather', 'biker', 'vintage', 'edgy', 'classic'],
    dateAdded: '2025-04-16',
    isAvailable: true
  },
  {
    id: '4002',
    name: 'Camel Wool Coat',
    brand: 'Max Mara',
    price: 175,
    originalPrice: 890,
    category: 'Outerwear',
    subcategory: 'Coats',
    size: 'L',
    condition: 'Like New',
    color: 'Camel',
    gender: 'Women',
    description: 'Luxurious camel wool coat with a classic straight cut, notched lapels, and single-button closure. Fully lined with side pockets.',
    sustainabilityImpact: 'Quality wool coats can last decades with proper care, reducing consumption.',
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75f8e55?q=80&w=800',
      'https://images.unsplash.com/photo-1520012218364-3dbe62c99bee?q=80&w=800',
    ],
    tags: ['wool', 'camel', 'luxury', 'winter', 'classic'],
    dateAdded: '2025-03-15',
    isAvailable: true
  },
  {
    id: '4003',
    name: 'Structured Blazer',
    brand: 'Arket',
    price: 80,
    originalPrice: 159,
    category: 'Outerwear',
    subcategory: 'Blazers',
    size: 'M',
    condition: 'Like New',
    color: 'Navy',
    gender: 'Women',
    description: 'Tailored navy blazer with a single-button closure, notched lapels, and front flap pockets. Made from a wool blend with a smooth lining.',
    sustainabilityImpact: 'A versatile staple that reduces the need for multiple special occasion pieces.',
    images: [
      'https://images.unsplash.com/photo-1642836927167-6e27ee4fe6e0?q=80&w=800',
      'https://images.unsplash.com/photo-1625178436428-7d6ece8e1ddd?q=80&w=800',
    ],
    tags: ['blazer', 'workwear', 'tailored', 'smart', 'versatile'],
    dateAdded: '2025-04-18',
    isAvailable: true
  },
  
  // Activewear
  {
    id: '5001',
    name: 'High Performance Leggings',
    brand: 'Lululemon',
    price: 65,
    originalPrice: 128,
    category: 'Activewear',
    subcategory: 'Leggings',
    size: 'S',
    condition: 'Like New',
    color: 'Black',
    gender: 'Women',
    description: 'High-waisted performance leggings with four-way stretch, moisture-wicking fabric, and hidden waistband pocket. Perfect for yoga, running, or everyday wear.',
    sustainabilityImpact: 'Quality activewear lasts longer, reducing the frequency of replacements.',
    images: [
      'https://images.unsplash.com/photo-1562886877-3ff29e3e4e03?q=80&w=800',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800',
    ],
    tags: ['workout', 'yoga', 'running', 'athleisure', 'performance'],
    dateAdded: '2025-04-25',
    isAvailable: true
  },
  {
    id: '5002',
    name: 'Technical Running Jacket',
    brand: 'Nike',
    price: 70,
    originalPrice: 120,
    category: 'Activewear',
    subcategory: 'Jackets',
    size: 'L',
    condition: 'Good',
    color: 'Gray',
    gender: 'Men',
    description: 'Lightweight running jacket with water-repellent finish, reflective details, and ventilation panels. Features thumbholes and a media pocket.',
    sustainabilityImpact: 'Extending the use phase of sportswear reduces its environmental footprint.',
    images: [
      'https://images.unsplash.com/photo-1578763398068-f69da8e9f014?q=80&w=800',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
    ],
    tags: ['running', 'technical', 'reflective', 'waterproof', 'workout'],
    dateAdded: '2025-04-02',
    isAvailable: true
  },
  
  // Accessories
  {
    id: '6001',
    name: 'Vintage Silk Scarf',
    brand: 'Hermès',
    price: 125,
    originalPrice: 450,
    category: 'Accessories',
    subcategory: 'Scarves',
    size: 'One Size',
    condition: 'Good',
    color: 'Multicolor',
    gender: 'Women',
    description: 'Authentic vintage Hermès silk scarf with a classic equestrian print in rich colors. Can be worn multiple ways - around the neck, as a headband, or tied to a bag.',
    sustainabilityImpact: 'Vintage luxury accessories retain their value and reduce demand for new production.',
    images: [
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=800',
      'https://images.unsplash.com/photo-1522781063376-4162c5587c6b?q=80&w=800',
    ],
    tags: ['silk', 'luxury', 'vintage', 'versatile', 'colorful'],
    dateAdded: '2025-03-20',
    isAvailable: true
  },
  {
    id: '6002',
    name: 'Leather Tote Bag',
    brand: 'Madewell',
    price: 90,
    originalPrice: 168,
    category: 'Accessories',
    subcategory: 'Bags',
    size: 'One Size',
    condition: 'Good',
    color: 'Tan',
    gender: 'Unisex',
    description: 'Spacious leather tote with two sturdy handles and an unlined interior. Perfect for work, travel, or everyday use. Develops a beautiful patina over time.',
    sustainabilityImpact: 'Quality leather goods age beautifully and can last for decades with proper care.',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800',
    ],
    tags: ['leather', 'tote', 'work', 'travel', 'everyday'],
    dateAdded: '2025-04-10',
    isAvailable: true
  },
  
  // Footwear
  {
    id: '7001',
    name: 'Classic White Sneakers',
    brand: 'Common Projects',
    price: 110,
    originalPrice: 425,
    category: 'Footwear',
    subcategory: 'Sneakers',
    size: 'EU 42',
    condition: 'Good',
    color: 'White',
    gender: 'Men',
    description: 'Minimalist white leather sneakers with a clean design and gold serial number stamp at the heel. Shows light signs of wear but has been well-maintained.',
    sustainabilityImpact: 'Quality leather shoes can be repaired and maintained, extending their lifespan.',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800',
    ],
    tags: ['sneakers', 'minimal', 'leather', 'classic', 'versatile'],
    dateAdded: '2025-04-05',
    isAvailable: true
  },
  {
    id: '7002',
    name: 'Leather Chelsea Boots',
    brand: 'Dr. Martens',
    price: 85,
    originalPrice: 180,
    category: 'Footwear',
    subcategory: 'Boots',
    size: 'UK 6',
    condition: 'Good',
    color: 'Black',
    gender: 'Unisex',
    description: 'Classic leather Chelsea boots with elastic side panels and pull tab. Features the iconic air-cushioned sole and yellow stitching.',
    sustainabilityImpact: 'Dr. Martens boots are known for their durability and can last for many years.',
    images: [
      'https://images.unsplash.com/photo-1610398752800-146f269dfcc8?q=80&w=800',
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800',
    ],
    tags: ['boots', 'chelsea', 'leather', 'iconic', 'durable'],
    dateAdded: '2025-03-30',
    isAvailable: true
  }
];

export default mockClothingItems;