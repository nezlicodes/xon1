// Default FAQ config
export const defaultFaqConfig = {
    title: "Questions Fréquentes",
    subtitle: "Trouvez des réponses aux questions les plus courantes concernant nos produits et services",
    is_enabled: true,
    display_limit: 10,
    show_categories: true,
    allow_search: false,
    expand_first: true
};

// Default FAQ categories
export const defaultCategories = [
    {
        id: "category-1",
        name: "Commandes et Livraison",
        is_active: true,
        display_order: 1,
        user_id: "default"
    },
    {
        id: "category-2",
        name: "Produits",
        is_active: true,
        display_order: 2,
        user_id: "default"
    },
    {
        id: "category-3",
        name: "Paiement",
        is_active: true,
        display_order: 3,
        user_id: "default"
    },
    {
        id: "category-4",
        name: "Retours et Remboursements",
        is_active: true,
        display_order: 4,
        user_id: "default"
    }
];

// Default FAQ items
export const defaultItems = [
    {
        id: "faq-1",
        question: "Combien de temps faut-il pour recevoir ma commande ?",
        answer: "Le délai de livraison dépend de votre localisation. En général, les commandes sont livrées dans un délai de 3 à 5 jours ouvrables. Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi pour suivre votre colis.",
        category_id: "category-1",
        is_active: true,
        is_featured: true,
        display_order: 1,
        user_id: "default"
    },
    {
        id: "faq-2",
        question: "Quels sont les modes de paiement acceptés ?",
        answer: "Nous acceptons plusieurs méthodes de paiement : cartes de crédit (Visa, Mastercard, American Express), PayPal, virement bancaire et paiement à la livraison dans certaines régions. Tous les paiements sont sécurisés et cryptés pour garantir la protection de vos informations.",
        category_id: "category-3",
        is_active: true,
        is_featured: true,
        display_order: 1,
        user_id: "default"
    },
    {
        id: "faq-3",
        question: "Comment puis-je suivre ma commande ?",
        answer: "Vous pouvez suivre votre commande en vous connectant à votre compte et en accédant à la section 'Mes commandes'. Vous y trouverez le statut actuel de votre commande ainsi que le numéro de suivi une fois que le colis a été expédié. Vous pouvez également suivre votre commande via le lien de suivi envoyé dans l'email de confirmation d'expédition.",
        category_id: "category-1",
        is_active: true,
        is_featured: false,
        display_order: 2,
        user_id: "default"
    },
    {
        id: "faq-4",
        question: "Quelle est votre politique de retour ?",
        answer: "Nous offrons une politique de retour de 30 jours pour tous nos produits. Si vous n'êtes pas satisfait de votre achat, vous pouvez nous renvoyer les articles non utilisés et dans leur emballage d'origine pour un remboursement complet ou un échange. Veuillez noter que les frais d'expédition du retour sont à votre charge, sauf si l'article est défectueux.",
        category_id: "category-4",
        is_active: true,
        is_featured: true,
        display_order: 1,
        user_id: "default"
    },
    {
        id: "faq-5",
        question: "Les produits sont-ils garantis ?",
        answer: "Oui, tous nos produits sont couverts par une garantie minimale de 12 mois contre les défauts de fabrication. Certains produits peuvent bénéficier d'une garantie plus longue, comme indiqué dans leurs descriptions. En cas de problème avec votre produit pendant la période de garantie, veuillez contacter notre service client pour organiser une réparation ou un remplacement.",
        category_id: "category-2",
        is_active: true,
        is_featured: false,
        display_order: 1,
        user_id: "default"
    },
    {
        id: "faq-6",
        question: "Comment puis-je contacter le service client ?",
        answer: "Notre équipe de service client est disponible du lundi au vendredi de 9h à 18h. Vous pouvez nous contacter par email à support@notreboutique.com, par téléphone au 01 23 45 67 89, ou via le formulaire de contact sur notre site. Nous nous efforçons de répondre à toutes les demandes dans un délai de 24 heures ouvrables.",
        category_id: null,
        is_active: true,
        is_featured: false,
        display_order: 5,
        user_id: "default"
    },
    {
        id: "faq-7",
        question: "Livrez-vous à l'international ?",
        answer: "Oui, nous livrons dans de nombreux pays à travers le monde. Les frais d'expédition et les délais de livraison varient selon la destination. Lors du processus de commande, vous pourrez voir les options de livraison disponibles pour votre pays ainsi que les frais associés avant de finaliser votre achat.",
        category_id: "category-1",
        is_active: true,
        is_featured: false,
        display_order: 3,
        user_id: "default"
    },
    {
        id: "faq-8",
        question: "Comment demander un remboursement ?",
        answer: "Pour demander un remboursement, veuillez d'abord nous contacter par email à remboursements@notreboutique.com en indiquant votre numéro de commande et la raison de votre demande. Une fois votre retour reçu et inspecté, nous vous informerons de l'approbation ou du rejet de votre remboursement. Si approuvé, votre remboursement sera traité et un crédit sera automatiquement appliqué à votre carte de crédit ou méthode de paiement originale dans les 5-10 jours ouvrables.",
        category_id: "category-4",
        is_active: true,
        is_featured: false,
        display_order: 2,
        user_id: "default"
    }
];
