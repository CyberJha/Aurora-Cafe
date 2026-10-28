/**
 * src/data/menuData.js
 * Aurora Cafe - Food & Beverage Offerings
 * Unified menu catalog with categorization, pricing, and descriptions.
 */

export const MENU_ITEMS = [
    {
        id: 1,
        category: 'coffee',
        name: 'Classic Espresso',
        desc: 'Rich, bold, and perfectly extracted shot of our signature high-elevation blend.',
        price: '₹200',
        numericPrice: 200,
        img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80',
        alt: 'Classic Espresso',
        recommendedWith: 'Espresso Tiramisu'
    },
    {
        id: 2,
        category: 'coffee',
        name: 'Velvet Cappuccino',
        desc: 'Equal parts espresso, silky steamed milk, and velvety micro-foam with cocoa dusting.',
        price: '₹250',
        numericPrice: 250,
        img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80',
        alt: 'Velvet Cappuccino',
        recommendedWith: 'Butter Croissant'
    },
    {
        id: 3,
        category: 'cold',
        name: 'Vanilla Iced Latte',
        desc: 'Chilled espresso over artisanal milk with organic Madagascar bourbon vanilla.',
        price: '₹400',
        numericPrice: 400,
        img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80',
        alt: 'Vanilla Iced Latte',
        recommendedWith: 'Butter Croissant'
    },
    {
        id: 4,
        category: 'cold',
        name: 'Signature Cold Brew',
        desc: 'Steeped cold for 24 hours in small batches for ultra-low acidity and chocolate notes.',
        price: '₹350',
        numericPrice: 350,
        img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=500&q=80',
        alt: 'Signature Cold Brew',
        recommendedWith: 'Espresso Tiramisu'
    },
    {
        id: 5,
        category: 'dessert',
        name: 'Espresso Tiramisu',
        desc: 'Classic Venetian delicacy layered with mascarpone cream, cocoa, and espresso-soaked savoiardi.',
        price: '₹650',
        numericPrice: 650,
        img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80',
        alt: 'Espresso Tiramisu',
        recommendedWith: 'Classic Espresso'
    },
    {
        id: 6,
        category: 'snack',
        name: 'Butter Croissant',
        desc: 'Flaky, golden-brown French pastry laminated with pure cultured Normandy butter.',
        price: '₹400',
        numericPrice: 400,
        img: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=500&q=80',
        alt: 'Butter Croissant',
        recommendedWith: 'Velvet Cappuccino'
    }
];
