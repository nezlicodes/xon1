export const defaultCategories = [
    {
        id: "category-1",
        name: "Électronique",
        is_active: true
    },
    {
        id: "category-2",
        name: "Mode",
        is_active: true
    },
    {
        id: "category-3",
        name: "Maison",
        is_active: true
    },
    {
        id: "category-4",
        name: "Sports",
        is_active: true
    },
    {
        id: "category-5",
        name: "Beauté",
        is_active: true
    },
    {
        id: "category-6",
        name: "Livres",
        is_active: true
    }
];

// Placeholder products with expanded details (same as featured products component)
export const placeholderProducts = [
    {
        id: 'placeholder-1',
        name: 'Smartphone Premium XS',
        slug: 'smartphone-premium-xs',
        price: 1999.99,
        compare_at_price: 2499.99,
        quantity: 10,
        has_variants: false,
        category: { name: 'Électronique', id: 'category-1' },
        category_id: 'category-1',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-01-10T10:00:00Z'
    },
    {
        id: 'placeholder-2',
        name: 'Casque Audio Sans Fil',
        slug: 'casque-audio-sans-fil',
        price: 249.99,
        compare_at_price: null,
        quantity: 5,
        has_variants: false,
        category: { name: 'Électronique', id: 'category-1' },
        category_id: 'category-1',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-01-15T10:00:00Z'
    },
    {
        id: 'placeholder-3',
        name: 'Robe Élégante Soirée',
        slug: 'robe-elegante-soiree',
        price: 599.99,
        compare_at_price: 799.99,
        quantity: 0,
        has_variants: true,
        category: { name: 'Mode', id: 'category-2' },
        category_id: 'category-2',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-01-20T10:00:00Z'
    },
    {
        id: 'placeholder-4',
        name: 'Montre Connectée Sport',
        slug: 'montre-connectee-sport',
        price: 349.99,
        compare_at_price: null,
        quantity: 15,
        has_variants: false,
        category: { name: 'Sports', id: 'category-4' },
        category_id: 'category-4',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-01-25T10:00:00Z'
    },
    {
        id: 'placeholder-5',
        name: 'Diffuseur d\'Huiles Essentielles',
        slug: 'diffuseur-huiles-essentielles',
        price: 129.99,
        compare_at_price: 159.99,
        quantity: 8,
        has_variants: false,
        category: { name: 'Maison', id: 'category-3' },
        category_id: 'category-3',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-02-01T10:00:00Z'
    },
    {
        id: 'placeholder-6',
        name: 'Palette de Maquillage Professionnelle',
        slug: 'palette-maquillage-pro',
        price: 189.99,
        compare_at_price: null,
        quantity: 12,
        has_variants: false,
        category: { name: 'Beauté', id: 'category-5' },
        category_id: 'category-5',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-02-05T10:00:00Z'
    },
    {
        id: 'placeholder-7',
        name: 'Veste en Cuir Premium',
        slug: 'veste-cuir-premium',
        price: 899.99,
        compare_at_price: 1199.99,
        quantity: 0,
        has_variants: true,
        category: { name: 'Mode', id: 'category-2' },
        category_id: 'category-2',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-02-10T10:00:00Z'
    },
    {
        id: 'placeholder-8',
        name: 'Bestseller: Les Secrets de l\'Univers',
        slug: 'bestseller-secrets-univers',
        price: 79.99,
        compare_at_price: null,
        quantity: 22,
        has_variants: false,
        category: { name: 'Livres', id: 'category-6' },
        category_id: 'category-6',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-02-15T10:00:00Z'
    },
    {
        id: 'placeholder-9',
        name: 'Chaussures de Course Performance',
        slug: 'chaussures-course-performance',
        price: 299.99,
        compare_at_price: 349.99,
        quantity: 18,
        has_variants: true,
        category: { name: 'Sports', id: 'category-4' },
        category_id: 'category-4',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-02-20T10:00:00Z'
    },
    {
        id: 'placeholder-10',
        name: 'Set de Cuisine Premium',
        slug: 'set-cuisine-premium',
        price: 449.99,
        compare_at_price: 599.99,
        quantity: 7,
        has_variants: false,
        category: { name: 'Maison', id: 'category-3' },
        category_id: 'category-3',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-02-25T10:00:00Z'
    },
    {
        id: 'placeholder-11',
        name: 'Tablette Graphique Pro',
        slug: 'tablette-graphique-pro',
        price: 1299.99,
        compare_at_price: 1499.99,
        quantity: 4,
        has_variants: false,
        category: { name: 'Électronique', id: 'category-1' },
        category_id: 'category-1',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-03-01T10:00:00Z'
    },
    {
        id: 'placeholder-12',
        name: 'Crème Anti-âge Avancée',
        slug: 'creme-anti-age-avancee',
        price: 159.99,
        compare_at_price: null,
        quantity: 30,
        has_variants: false,
        category: { name: 'Beauté', id: 'category-5' },
        category_id: 'category-5',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-03-05T10:00:00Z'
    },
    {
        id: 'placeholder-13',
        name: 'Enceinte Bluetooth Waterproof',
        slug: 'enceinte-bluetooth-waterproof',
        price: 129.99,
        compare_at_price: 149.99,
        quantity: 25,
        has_variants: false,
        category: { name: 'Électronique', id: 'category-1' },
        category_id: 'category-1',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-03-10T10:00:00Z'
    },
    {
        id: 'placeholder-14',
        name: 'Roman: L\'Odyssée Fantastique',
        slug: 'roman-odyssee-fantastique',
        price: 59.99,
        compare_at_price: null,
        quantity: 15,
        has_variants: false,
        category: { name: 'Livres', id: 'category-6' },
        category_id: 'category-6',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-03-15T10:00:00Z'
    },
    {
        id: 'placeholder-15',
        name: 'Robot Aspirateur Intelligent',
        slug: 'robot-aspirateur-intelligent',
        price: 799.99,
        compare_at_price: 999.99,
        quantity: 9,
        has_variants: false,
        category: { name: 'Maison', id: 'category-3' },
        category_id: 'category-3',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-03-20T10:00:00Z'
    },
    {
        id: 'placeholder-16',
        name: 'Ensemble Sport Performance',
        slug: 'ensemble-sport-performance',
        price: 189.99,
        compare_at_price: 229.99,
        quantity: 0,
        has_variants: true,
        category: { name: 'Sports', id: 'category-4' },
        category_id: 'category-4',
        images: [{ url: '/images/placeholders/product.jpg' }],
        created_at: '2023-03-25T10:00:00Z'
    }
];
