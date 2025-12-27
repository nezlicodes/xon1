-- Seed or update the footer section in content_sections with full editor-enabled fields
INSERT INTO public.content_sections (
  section_key,
  section_type,
  content_translations,
  is_active,
  display_order
)
VALUES (
  'footer',
  'footer',
  '{
    "fr": {
      "about_text": "Boutique en Ligne est votre destination privilégiée pour des produits de qualité. Nous nous engageons à offrir un service client exceptionnel et des produits soigneusement sélectionnés.",
      "copyright": "© 2024 Tous droits réservés.",
      "show_shop": true,
      "show_company": true,
      "show_support": true,
      "show_technologies": true,
      "show_policies": true,
      "show_newsletter": false,
      "show_payment_methods": false,
      "show_socials": true,
      "technologies_title": "Technologies",
      "policies_title": "Politiques",
      "newsletter_title": "Restez informé",
      "newsletter_description": "Abonnez-vous à notre newsletter pour recevoir nos dernières offres",
      "shop_title": "Boutique",
      "shop_links": [
        { "text": "Tous les Produits", "url": "/products" },
        { "text": "Panier", "url": "/cart" }
      ],
      "company_title": "Entreprise",
      "company_links": [
        { "text": "À Propos", "url": "/#about" },
        { "text": "Contact", "url": "/#contact" }
      ],
      "support_title": "Assistance",
      "support_links": [
        { "text": "Livraison", "url": "/shipping-policy" },
        { "text": "Retours", "url": "/return-policy" }
      ]
    },
    "ar": {
      "about_text": "المتجر الإلكتروني هو وجهتك المفضلة للمنتجات عالية الجودة. نحن ملتزمون بتقديم خدمة عملاء استثنائية ومنتجات مختارة بعناية.",
      "copyright": "© 2024 جميع الحقوق محفوظة.",
      "show_shop": true,
      "show_company": true,
      "show_support": true,
      "show_technologies": true,
      "show_policies": true,
      "show_newsletter": false,
      "show_payment_methods": false,
      "show_socials": true,
      "technologies_title": "التقنيات",
      "policies_title": "السياسات",
      "newsletter_title": "ابقَ على اطلاع",
      "newsletter_description": "اشترك في نشرتنا الإخبارية لتصلك أحدث عروضنا",
      "shop_title": "المتجر",
      "shop_links": [
        { "text": "جميع المنتجات", "url": "/products" },
        { "text": "السلة", "url": "/cart" }
      ],
      "company_title": "الشركة",
      "company_links": [
        { "text": "معلومات عنا", "url": "/#about" },
        { "text": "اتصل بنا", "url": "/#contact" }
      ],
      "support_title": "المساعدة",
      "support_links": [
        { "text": "التوصيل", "url": "/shipping-policy" },
        { "text": "الإرجاع", "url": "/return-policy" }
      ]
    },
    "en": {
      "about_text": "Online Store is your preferred destination for quality products. We are committed to providing exceptional customer service and carefully selected products.",
      "copyright": "© 2024 All rights reserved.",
      "show_shop": true,
      "show_company": true,
      "show_support": true,
      "show_technologies": true,
      "show_policies": true,
      "show_newsletter": false,
      "show_payment_methods": false,
      "show_socials": true,
      "technologies_title": "Technologies",
      "policies_title": "Policies",
      "newsletter_title": "Stay informed",
      "newsletter_description": "Subscribe to our newsletter to receive our latest offers",
      "shop_title": "Shop",
      "shop_links": [
        { "text": "All Products", "url": "/products" },
        { "text": "Cart", "url": "/cart" }
      ],
      "company_title": "Company",
      "company_links": [
        { "text": "About Us", "url": "/#about" },
        { "text": "Contact", "url": "/#contact" }
      ],
      "support_title": "Support",
      "support_links": [
        { "text": "Shipping", "url": "/shipping-policy" },
        { "text": "Returns", "url": "/return-policy" }
      ]
    }
  }'::jsonb,
  true,
  10
)
ON CONFLICT (section_key)
DO UPDATE SET
  content_translations = EXCLUDED.content_translations,
  updated_at = now();
