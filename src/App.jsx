import { useState, useEffect, useCallback } from "react";

// ─── DESIGN TOKENS ───
const tokens = {
  light: {
    bg: "#FFFCF9",
    bgSecondary: "#F7F3EE",
    bgTertiary: "#EFEBE5",
    bgCard: "#FFFFFF",
    bgCardHover: "#FDFAF6",
    border: "#E8E2DA",
    borderLight: "#F0EBE4",
    text: "#1A1613",
    textSecondary: "#6B6259",
    textTertiary: "#9C9389",
    accent: "#C75B2A",
    accentLight: "#E8845A",
    accentBg: "#FDF0EA",
    accentBorder: "#F5D4C4",
    green: "#2D8A56",
    greenBg: "#EBF5F0",
    greenBorder: "#C4E1D1",
    blue: "#3A7BC8",
    blueBg: "#EDF3FB",
    yellow: "#B8860B",
    yellowBg: "#FDF6E3",
    red: "#C0392B",
    shadow: "0 1px 3px rgba(26,22,19,0.06), 0 1px 2px rgba(26,22,19,0.04)",
    shadowHover: "0 4px 12px rgba(26,22,19,0.08), 0 2px 4px rgba(26,22,19,0.04)",
  },
  dark: {
    bg: "#1A1714",
    bgSecondary: "#231F1B",
    bgTertiary: "#2C2722",
    bgCard: "#252118",
    bgCardHover: "#2E2A24",
    border: "#3A352E",
    borderLight: "#322D27",
    text: "#F0EBE4",
    textSecondary: "#A89E93",
    textTertiary: "#7A7068",
    accent: "#E8845A",
    accentLight: "#F0A07A",
    accentBg: "#3A271E",
    accentBorder: "#5C3D2E",
    green: "#4CAF7A",
    greenBg: "#1E3028",
    greenBorder: "#2E4A38",
    blue: "#5A9BE0",
    blueBg: "#1E2A38",
    yellow: "#D4A024",
    yellowBg: "#2E2818",
    red: "#E05A4E",
    shadow: "0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)",
    shadowHover: "0 4px 12px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15)",
  },
};

// ─── DATA ───
const CATEGORIES = [
  { id: "all", label: "Toutes", icon: "◎" },
  { id: "tech", label: "Tech & SaaS", icon: "⬡" },
  { id: "sante", label: "Santé", icon: "♡" },
  { id: "immobilier", label: "Immobilier", icon: "△" },
  { id: "btp", label: "BTP", icon: "⬢" },
  { id: "marketing", label: "Marketing & Com", icon: "◈" },
];

const OPPORTUNITIES = [
  {
    id: 1, name: "IA de génération de devis pour artisans BTP", category: "btp", score: 94,
    scores: { demande: 23, croissance: 24, concurrence: 19, monetisation: 14, faisabilite: 14 },
    trend: "+310%", market: "€3.2B", type: "SaaS", mentions: 1840, sources: "Reddit, Forums Pro, Google Trends",
    problem: "Les artisans et petites entreprises du BTP passent en moyenne 4 à 6 heures par semaine à rédiger des devis manuellement. Les erreurs de chiffrage sont fréquentes, les relances inexistantes, et beaucoup de devis sont envoyés trop tard — ce qui fait perdre des chantiers. Aucun outil actuel ne combine IA + catalogue matériaux + suivi client de manière simple et adaptée aux TPE du bâtiment.",
    solution: "Un SaaS qui génère des devis en quelques minutes grâce à l'IA. L'artisan décrit le chantier, l'outil propose un devis structuré avec les bons matériaux et prix à jour. Fonctionnalités clés : catalogue matériaux intégré avec prix fournisseurs, génération automatique par description vocale ou texte, signature électronique, relance automatique des devis en attente. Cible : artisans solo et PME du bâtiment (plombiers, électriciens, maçons). Pricing suggéré : 39€/mois solo, 99€/mois équipe.",
    competitors: "Peu de concurrence IA directe. Quelques outils classiques (Obat, Batappli) mais sans intelligence artificielle.",
    weekTrend: "new",
  },
  {
    id: 2, name: "Outils IA pour études notariales", category: "tech", score: 91,
    scores: { demande: 21, croissance: 23, concurrence: 20, monetisation: 14, faisabilite: 13 },
    trend: "+180%", market: "€2.1B", type: "SaaS", mentions: 920, sources: "Twitter/X, Forums juridiques, Google Trends",
    problem: "Les notaires et clercs de notaire passent un temps considérable sur la rédaction d'actes répétitifs, la recherche de jurisprudence et la vérification de conformité. La profession est en retard sur la digitalisation et les outils existants sont vieillissants et peu intuitifs. La demande pour des outils modernes augmente avec l'arrivée d'une nouvelle génération de notaires.",
    solution: "Un assistant IA spécialisé pour le notariat : rédaction assistée d'actes notariés avec templates intelligents, recherche de jurisprudence par question en langage naturel, vérification automatique de conformité, gestion de dossier client intégrée. Cible : études notariales françaises (environ 6 500 offices). Pricing suggéré : 199€/mois par étude.",
    competitors: "Marché quasi vierge en IA. Outils classiques (Genapi, Fiducial) sans couche intelligente.",
    weekTrend: "up",
  },
  {
    id: 3, name: "Plateforme IA pour restaurateurs", category: "sante", score: 89,
    scores: { demande: 22, croissance: 24, concurrence: 18, monetisation: 13, faisabilite: 12 },
    trend: "+230%", market: "€1.8B", type: "SaaS / App", mentions: 1350, sources: "Reddit, Twitter/X, Facebook Groups",
    problem: "Les restaurateurs indépendants jonglent entre gestion des stocks, création de menus, commandes fournisseurs et rentabilité des plats — tout ça souvent sur papier ou Excel. Le gaspillage alimentaire est un problème majeur (10-15% de perte en moyenne). Il n'existe pas d'outil simple et abordable qui combine ces fonctions avec de l'intelligence prédictive.",
    solution: "Une app qui utilise l'IA pour optimiser toute la chaîne : menus générés selon la saison et les marges, gestion prédictive des stocks pour réduire le gaspillage, commandes fournisseurs automatisées, dashboard de rentabilité par plat en temps réel. Cible : restaurateurs indépendants et petites chaînes. Pricing suggéré : 69€/mois.",
    competitors: "Quelques outils de gestion (Zenchef, Lightspeed) mais aucun avec IA prédictive sur les stocks et menus.",
    weekTrend: "new",
  },
  {
    id: 4, name: "CRM intelligent pour freelances", category: "tech", score: 87,
    scores: { demande: 22, croissance: 20, concurrence: 17, monetisation: 14, faisabilite: 14 },
    trend: "+140%", market: "€960M", type: "SaaS", mentions: 780, sources: "Reddit, Indie Hackers, Twitter/X",
    problem: "Les freelances utilisent un patchwork d'outils (Notion, Google Sheets, Excel) pour gérer leurs clients, projets et facturation. Il n'existe pas de CRM pensé pour le workflow freelance : prospection → devis → projet → facture → relance. Les CRM classiques (HubSpot, Salesforce) sont surdimensionnés et trop chers pour un indépendant.",
    solution: "Un CRM minimaliste pensé freelance : pipeline visuel du prospect au paiement, génération de devis et factures intégrée, relances automatiques, dashboard revenus et prévisions, intégration bancaire pour le suivi des paiements. Cible : freelances tech, créatifs, consultants. Pricing suggéré : 19€/mois.",
    competitors: "Concurrence modérée (Bonsai, HoneyBook) mais peu d'acteurs en français et adaptés au marché européen.",
    weekTrend: "stable",
  },
  {
    id: 5, name: "Assistant IA pour agents immobiliers", category: "immobilier", score: 86,
    scores: { demande: 23, croissance: 22, concurrence: 16, monetisation: 13, faisabilite: 12 },
    trend: "+280%", market: "€4.1B", type: "SaaS", mentions: 1100, sources: "Google Trends, Twitter/X, Forums immo",
    problem: "Les agents immobiliers passent 60% de leur temps sur des tâches administratives : rédaction d'annonces, réponses aux demandes, organisation des visites, suivi acquéreurs. La plupart des outils du secteur sont des CRM génériques qui ne comprennent pas les spécificités métier. La génération de leads qualifiés reste le problème numéro un.",
    solution: "Un assistant IA métier : rédaction automatique d'annonces optimisées SEO, chatbot qualificateur de leads 24/7, matching intelligent acheteur/bien, automatisation du suivi acquéreur, estimation de prix par IA. Cible : agents indépendants et petites agences. Pricing suggéré : 89€/mois.",
    competitors: "Quelques acteurs (Yanport, Apimo) mais sans vraie couche IA générative.",
    weekTrend: "up",
  },
  {
    id: 6, name: "Plateforme d'emailing IA pour PME", category: "marketing", score: 85,
    scores: { demande: 21, croissance: 19, concurrence: 16, monetisation: 15, faisabilite: 14 },
    trend: "+120%", market: "€2.8B", type: "SaaS", mentions: 680, sources: "Reddit, Product Hunt, Google Trends",
    problem: "Les PME et solopreneurs savent que l'email marketing fonctionne mais n'ont ni le temps ni les compétences pour rédiger des séquences efficaces. Les outils existants (Mailchimp, Brevo) offrent l'infrastructure mais pas la stratégie. Le taux d'ouverture moyen est de 21% et la plupart des séquences sont mal construites.",
    solution: "Un outil qui combine envoi d'emails ET rédaction IA : l'utilisateur décrit son objectif, l'IA génère la séquence complète (objets, corps, timing, CTA), A/B testing automatique des objets, optimisation continue basée sur les résultats, templates par industrie. Cible : PME, solopreneurs, freelances. Pricing suggéré : 29€/mois.",
    competitors: "Marché saturé en email marketing mais quasi vide en 'email strategy AI'. Opportunité de niche.",
    weekTrend: "stable",
  },
  {
    id: 7, name: "Logiciel suivi de chantier simplifié", category: "btp", score: 83,
    scores: { demande: 20, croissance: 21, concurrence: 17, monetisation: 13, faisabilite: 12 },
    trend: "+95%", market: "€1.5B", type: "SaaS / App", mentions: 560, sources: "Forums BTP, Reddit, Google Trends",
    problem: "Le suivi de chantier dans les petites structures se fait encore sur papier, WhatsApp et photos non organisées. Les chefs de chantier perdent du temps à documenter l'avancement, les malfaçons et la communication avec les clients. Les outils existants (Bulldozair, Finalcad) sont pensés pour les grands groupes et trop complexes pour les artisans.",
    solution: "Une app mobile-first ultra simple : prise de photo géolocalisée et datée automatiquement, rapport d'avancement généré par IA à partir des photos, partage client en un clic, suivi des réserves et malfaçons, planning chantier visuel. Cible : artisans et petites entreprises BTP. Pricing suggéré : 29€/mois.",
    competitors: "Concurrence orientée grands groupes. Très peu d'offre pour les TPE/PME.",
    weekTrend: "up",
  },
  {
    id: 8, name: "Téléconsultation IA spécialisée dermatologie", category: "sante", score: 81,
    scores: { demande: 20, croissance: 20, concurrence: 15, monetisation: 14, faisabilite: 12 },
    trend: "+160%", market: "€3.6B", type: "SaaS / App", mentions: 490, sources: "Reddit, PubMed, Twitter/X",
    problem: "Les délais pour voir un dermatologue en France dépassent souvent 6 mois. Les patients cherchent des réponses en ligne sur des forums peu fiables. Les médecins généralistes manquent d'outils pour le pré-diagnostic dermatologique. Le marché de la télédermatologie explose mais les solutions actuelles manquent de spécialisation.",
    solution: "Plateforme de pré-diagnostic dermatologique par IA : le patient envoie une photo, l'IA analyse et oriente (urgence, RDV dermato, conseil), connexion avec un réseau de dermatologues pour téléconsultation rapide, suivi de l'évolution des lésions dans le temps. Cible : patients, médecins généralistes, dermatologues. Pricing suggéré : B2B — 149€/mois par cabinet.",
    competitors: "Quelques acteurs (Skin Analytics, DermoSafe) mais marché francophone quasi vierge.",
    weekTrend: "up",
  },
  {
    id: 9, name: "Estimateur immobilier IA pour particuliers", category: "immobilier", score: 79,
    scores: { demande: 21, croissance: 18, concurrence: 14, monetisation: 13, faisabilite: 13 },
    trend: "+105%", market: "€1.2B", type: "SaaS / App", mentions: 720, sources: "Google Trends, Reddit, Forums immo",
    problem: "Les particuliers qui veulent vendre ou acheter un bien n'ont aucun moyen fiable d'estimer un prix juste. Les estimations en ligne (MeilleursAgents, SeLoger) sont trop génériques. Les vrais comparatifs de ventes récentes ne sont pas accessibles facilement. Résultat : des biens surévalués qui stagnent ou sous-évalués qui font perdre de l'argent.",
    solution: "Un outil d'estimation ultra-précis basé sur les données DVF (Demandes de Valeurs Foncières), enrichi par IA : comparaison avec les ventes réelles du quartier, facteurs de correction (étage, vue, état, DPE), évolution prévisionnelle du prix, rapport PDF téléchargeable. Cible : particuliers vendeurs, investisseurs. Monétisation : gratuit → rapport premium payant (9€) ou lead gen vers agents partenaires.",
    competitors: "MeilleursAgents domine mais l'approche IA + données DVF précises reste une niche.",
    weekTrend: "stable",
  },
  {
    id: 10, name: "Automatisation cold outreach pour agences", category: "marketing", score: 77,
    scores: { demande: 19, croissance: 18, concurrence: 14, monetisation: 14, faisabilite: 12 },
    trend: "+90%", market: "€840M", type: "SaaS", mentions: 540, sources: "Reddit, Indie Hackers, Twitter/X",
    problem: "Les agences marketing et communication passent un temps fou à prospecter : recherche de leads, rédaction de messages personnalisés, suivi des relances. Les outils de cold email existants (Lemlist, Instantly) gèrent l'envoi mais pas la stratégie ni la personnalisation profonde. Les taux de réponse chutent parce que les messages sont génériques.",
    solution: "Un outil de prospection IA pour agences : scraping intelligent de prospects qualifiés, rédaction hyper-personnalisée par IA (analyse du site web du prospect, de son LinkedIn, de ses problématiques), séquences multi-canal (email + LinkedIn), dashboard de performance et optimisation auto. Cible : agences marketing, agences web, consultants. Pricing suggéré : 79€/mois.",
    competitors: "Lemlist, Instantly, Apollo dominent l'envoi. L'angle 'stratégie + personnalisation IA' reste sous-exploité.",
    weekTrend: "new",
  },
  {
    id: 11, name: "Plateforme de gestion locative IA", category: "immobilier", score: 75,
    scores: { demande: 19, croissance: 17, concurrence: 14, monetisation: 13, faisabilite: 12 },
    trend: "+85%", market: "€2.3B", type: "SaaS", mentions: 410, sources: "Reddit, Forums immobilier",
    problem: "Les propriétaires bailleurs qui gèrent 2 à 20 biens en direct n'ont pas d'outil adapté. Soit ils paient une agence (7-10% des loyers), soit ils gèrent tout manuellement. Les quittances, les relances de loyer, les déclarations fiscales, la communication avec les locataires — tout est chronophage.",
    solution: "Un outil tout-en-un pour propriétaires bailleurs : génération automatique de quittances et relances, suivi des paiements avec alerte retard, aide à la déclaration fiscale (revenus fonciers), communication locataire centralisée, gestion des travaux et incidents. Cible : propriétaires de 2 à 20 biens. Pricing suggéré : 12€/mois par bien.",
    competitors: "Quelques acteurs (Rentila, Ublo) mais UX datée et pas d'IA.",
    weekTrend: "stable",
  },
  {
    id: 12, name: "Chatbot IA santé mentale entreprise", category: "sante", score: 73,
    scores: { demande: 18, croissance: 19, concurrence: 13, monetisation: 12, faisabilite: 11 },
    trend: "+145%", market: "€1.9B", type: "SaaS B2B", mentions: 380, sources: "LinkedIn, Reddit, Twitter/X",
    problem: "La santé mentale au travail est un sujet en explosion. Les entreprises sont obligées par la loi de prévenir les risques psychosociaux mais n'ont pas d'outils pratiques. Les solutions actuelles (EAP, numéros verts) ont des taux d'utilisation inférieurs à 5% car perçues comme stigmatisantes.",
    solution: "Un chatbot IA anonyme et confidentiel accessible à tous les salariés : check-in quotidien du bien-être, détection précoce des signaux de détresse, orientation vers les ressources adaptées, dashboard anonymisé pour les RH (tendances, pas de données individuelles). Cible : DRH, entreprises de 50 à 5000 salariés. Pricing suggéré : 3€/salarié/mois.",
    competitors: "Moka.care, Teale existent mais le marché reste très fragmenté et en forte croissance.",
    weekTrend: "up",
  },
  // ─── TECH & SaaS (additional) ───
  {
    id: 13, name: "Générateur de contrats freelance par IA", category: "tech", score: 82,
    scores: { demande: 20, croissance: 19, concurrence: 17, monetisation: 13, faisabilite: 13 },
    trend: "+130%", market: "€680M", type: "SaaS", mentions: 620, sources: "Reddit, Indie Hackers, Twitter/X",
    problem: "Les freelances rédigent leurs contrats avec des templates Word trouvés en ligne, souvent juridiquement fragiles. Chaque nouveau client nécessite une adaptation manuelle. Les avocats coûtent cher pour des contrats récurrents et similaires.",
    solution: "Un générateur de contrats IA adapté aux freelances : questionnaire simple, génération d'un contrat conforme au droit français, clauses personnalisables, signature électronique intégrée, bibliothèque de modèles par métier (dev, design, consulting). Cible : freelances et micro-entrepreneurs. Pricing suggéré : 15€/mois.",
    competitors: "Captain Contrat existe mais vise les PME avec des prix élevés. Peu d'offre IA spécifique freelance.",
    weekTrend: "new",
  },
  {
    id: 14, name: "Dashboard analytics pour micro-SaaS", category: "tech", score: 74,
    scores: { demande: 18, croissance: 17, concurrence: 15, monetisation: 12, faisabilite: 12 },
    trend: "+85%", market: "€420M", type: "SaaS", mentions: 340, sources: "Indie Hackers, Twitter/X, Product Hunt",
    problem: "Les créateurs de micro-SaaS jonglent entre Stripe, Google Analytics, Crisp et 10 autres outils pour comprendre la santé de leur produit. Aucun dashboard ne centralise MRR, churn, acquisition, support et usage en un seul endroit pour les petits produits.",
    solution: "Un dashboard tout-en-un pour indie makers : connexion Stripe pour le MRR et churn, intégration analytics pour le trafic, métriques d'usage produit, alertes sur les indicateurs clés, rapport hebdomadaire automatique. Cible : indie hackers et créateurs de micro-SaaS. Pricing suggéré : 19€/mois.",
    competitors: "Baremetrics et ChartMogul existent mais sont chers et surdimensionnés pour les micro-SaaS.",
    weekTrend: "stable",
  },
  {
    id: 15, name: "Outil de pricing dynamique pour SaaS", category: "tech", score: 68,
    scores: { demande: 16, croissance: 16, concurrence: 14, monetisation: 11, faisabilite: 11 },
    trend: "+72%", market: "€340M", type: "SaaS", mentions: 280, sources: "Twitter/X, Indie Hackers",
    problem: "La plupart des SaaS fixent leurs prix au feeling et ne les changent jamais. Ils perdent du revenu sur des clients prêts à payer plus, ou ratent des conversions à cause de prix trop élevés. L'A/B testing de prix est complexe à mettre en place.",
    solution: "Un outil qui analyse le comportement utilisateur et la willingness-to-pay pour suggérer le pricing optimal. A/B test de pages pricing intégré, segmentation automatique, simulation de revenus. Cible : fondateurs SaaS early-stage. Pricing suggéré : 49€/mois.",
    competitors: "ProfitWell (Paddle) offre certaines fonctions mais est orienté grands comptes.",
    weekTrend: "stable",
  },
  {
    id: 16, name: "Plateforme de feedback produit IA", category: "tech", score: 71,
    scores: { demande: 17, croissance: 18, concurrence: 14, monetisation: 11, faisabilite: 11 },
    trend: "+95%", market: "€510M", type: "SaaS", mentions: 390, sources: "Product Hunt, Reddit, Twitter/X",
    problem: "Les fondateurs reçoivent du feedback partout : emails, Intercom, tweets, avis app stores, appels clients. Tout est dispersé et difficile à prioriser. Ils passent des heures à trier manuellement pour comprendre ce que veulent vraiment leurs utilisateurs.",
    solution: "Un outil qui centralise et analyse tous les feedbacks par IA : connexion aux sources (email, chat, reviews, réseaux sociaux), catégorisation automatique par thème, détection des demandes récurrentes, scoring de priorité basé sur l'impact business. Cible : fondateurs et product managers. Pricing suggéré : 39€/mois.",
    competitors: "Canny, ProductBoard existent mais sont chers et sans vraie analyse IA.",
    weekTrend: "up",
  },
  {
    id: 17, name: "Outil de migration no-code vers code", category: "tech", score: 58,
    scores: { demande: 14, croissance: 15, concurrence: 12, monetisation: 9, faisabilite: 8 },
    trend: "+60%", market: "€280M", type: "SaaS / Service", mentions: 210, sources: "Reddit, Indie Hackers",
    problem: "Beaucoup de startups démarrent sur Bubble, Webflow ou Airtable puis atteignent les limites du no-code. La migration vers du vrai code est un projet complexe et coûteux, souvent mal estimé.",
    solution: "Un service qui analyse l'app no-code existante et génère une base de code propre (React/Node) avec l'IA, prête à être reprise par un développeur. Audit automatique, estimation du coût de migration, génération du code de base. Cible : startups post no-code. Pricing suggéré : 2000-5000€ ou SaaS 99€/mois.",
    competitors: "Marché quasi inexistant. Quelques agences le font manuellement.",
    weekTrend: "new",
  },
  {
    id: 18, name: "API de vérification de conformité RGPD", category: "tech", score: 65,
    scores: { demande: 16, croissance: 15, concurrence: 13, monetisation: 11, faisabilite: 10 },
    trend: "+68%", market: "€1.1B", type: "API / SaaS", mentions: 310, sources: "Reddit, HackerNews, LinkedIn",
    problem: "Les développeurs et petites boîtes ne savent pas si leur produit est conforme au RGPD. Les audits juridiques coûtent cher. Les plugins de cookies ne suffisent pas — il faut aussi vérifier le stockage des données, les sous-traitants, les durées de conservation.",
    solution: "Une API qui scanne un site ou une app et génère un rapport de conformité RGPD automatique : cookies, trackers, politique de confidentialité, flux de données, sous-traitants détectés. Rapport PDF + plan d'action. Cible : développeurs, startups, PME. Pricing suggéré : 29€/mois.",
    competitors: "Cookiebot, OneTrust sont orientés grands groupes et très chers.",
    weekTrend: "stable",
  },
  {
    id: 19, name: "Outil d'audit UX automatisé par IA", category: "tech", score: 72,
    scores: { demande: 18, croissance: 17, concurrence: 15, monetisation: 11, faisabilite: 11 },
    trend: "+98%", market: "€580M", type: "SaaS", mentions: 370, sources: "Product Hunt, Reddit, Twitter/X",
    problem: "La plupart des sites ont des problèmes UX qui font fuir les utilisateurs mais les fondateurs ne les voient pas. Un audit UX professionnel coûte 2000-5000€. Les outils d'analytics montrent le quoi mais pas le pourquoi.",
    solution: "Un outil qui analyse automatiquement l'UX d'un site : screenshot de chaque page, analyse IA des patterns problématiques, score UX par page, recommandations priorisées avec maquettes de correction. Cible : fondateurs, product managers, freelances. Pricing suggéré : 39€/mois.",
    competitors: "Hotjar et Crazy Egg montrent les données. L'analyse IA avec recommandations est le différenciateur.",
    weekTrend: "new",
  },
  {
    id: 20, name: "Outil de veille réglementaire IA pour PME", category: "tech", score: 63,
    scores: { demande: 16, croissance: 15, concurrence: 13, monetisation: 10, faisabilite: 9 },
    trend: "+62%", market: "€520M", type: "SaaS", mentions: 270, sources: "LinkedIn, Reddit, Google Trends",
    problem: "Les PME sont soumises à de plus en plus de réglementations (RGPD, facturation électronique, RSE, accessibilité...) et n'ont pas de juriste interne. Elles découvrent les nouvelles obligations au dernier moment, parfois par une amende.",
    solution: "Un outil de veille réglementaire personnalisé : l'entreprise renseigne son profil, l'IA surveille les évolutions légales pertinentes, envoie des alertes en langage clair avec les actions à mener et les échéances. Cible : dirigeants et DAF de PME. Pricing suggéré : 49€/mois.",
    competitors: "Les cabinets d'avocats font ça manuellement. Pas d'outil IA accessible pour les PME.",
    weekTrend: "new",
  },
  // ─── SANTÉ (additional) ───
  {
    id: 21, name: "App de suivi nutritionnel IA personnalisé", category: "sante", score: 76,
    scores: { demande: 20, croissance: 18, concurrence: 14, monetisation: 12, faisabilite: 12 },
    trend: "+110%", market: "€2.4B", type: "App", mentions: 580, sources: "Reddit, Twitter/X, Google Trends",
    problem: "Les apps de nutrition existantes demandent de scanner chaque aliment manuellement. C'est fastidieux, les gens abandonnent après 2 semaines. Les recommandations sont génériques et ne tiennent pas compte des pathologies ou préférences culturelles.",
    solution: "Une app qui utilise la photo pour identifier les repas, calcule les macros automatiquement, et génère des recommandations personnalisées basées sur les objectifs santé, allergies, préférences culturelles. Coaching IA adaptatif. Cible : personnes soucieuses de leur alimentation. Pricing suggéré : 9.99€/mois.",
    competitors: "MyFitnessPal domine mais UX datée. L'angle IA + photo + personnalisation est sous-exploité.",
    weekTrend: "up",
  },
  {
    id: 22, name: "Plateforme de coordination soins à domicile", category: "sante", score: 70,
    scores: { demande: 18, croissance: 17, concurrence: 14, monetisation: 11, faisabilite: 10 },
    trend: "+90%", market: "€3.8B", type: "SaaS", mentions: 420, sources: "Forums santé, LinkedIn, Google Trends",
    problem: "Les soins à domicile impliquent infirmiers, aides-soignants, médecins, kinés — tous avec leurs propres plannings. La coordination est faite par téléphone et cahier de liaison papier. Les familles n'ont aucune visibilité.",
    solution: "Une plateforme de coordination : planning partagé, cahier de liaison numérique, alertes médicamenteuses, accès famille en lecture seule, rapport automatique pour le médecin traitant. Cible : SSIAD, services de soins à domicile. Pricing suggéré : 49€/mois par structure.",
    competitors: "Marché très fragmenté, outils vieillissants. Opportunité forte.",
    weekTrend: "stable",
  },
  {
    id: 23, name: "IA de pré-triage pour urgences", category: "sante", score: 64,
    scores: { demande: 17, croissance: 16, concurrence: 12, monetisation: 10, faisabilite: 9 },
    trend: "+75%", market: "€1.5B", type: "SaaS B2B", mentions: 290, sources: "PubMed, Twitter/X, Reddit",
    problem: "Les urgences hospitalières sont saturées. 40% des passages ne relèvent pas de l'urgence réelle. Les patients attendent des heures sans savoir s'ils devraient plutôt consulter leur médecin.",
    solution: "Un chatbot IA de pré-triage : le patient décrit ses symptômes, l'IA évalue le niveau d'urgence et oriente (urgences, médecin de garde, téléconsultation, pharmacie). Cible : hôpitaux, ARS, mutuelles. Pricing suggéré : licence B2B 500€/mois.",
    competitors: "Quelques initiatives publiques mais pas de solution IA clé en main.",
    weekTrend: "up",
  },
  {
    id: 24, name: "Marketplace kinés / ostéos à domicile", category: "sante", score: 61,
    scores: { demande: 16, croissance: 15, concurrence: 12, monetisation: 10, faisabilite: 8 },
    trend: "+55%", market: "€920M", type: "Marketplace", mentions: 240, sources: "Google Trends, Forums santé",
    problem: "Trouver un kiné ou un ostéo qui se déplace à domicile est compliqué. Les plateformes comme Doctolib ne filtrent pas facilement par déplacement. Les personnes âgées ou à mobilité réduite sont les premières touchées.",
    solution: "Une marketplace spécialisée : recherche par localisation, profils vérifiés, réservation en ligne, paiement sécurisé, avis patients. Côté praticien : gestion du planning et zone de déplacement. Cible : patients à domicile + praticiens. Commission : 10-15% par séance.",
    competitors: "Doctolib domine le RDV médical mais ne gère pas le déplacement à domicile.",
    weekTrend: "stable",
  },
  {
    id: 25, name: "App de gestion de stock pour pharmacies", category: "sante", score: 60,
    scores: { demande: 15, croissance: 14, concurrence: 13, monetisation: 10, faisabilite: 8 },
    trend: "+50%", market: "€640M", type: "SaaS", mentions: 220, sources: "Forums pharma, LinkedIn",
    problem: "Les pharmacies gèrent leur stock avec les logiciels des grossistes, qui ne communiquent pas entre eux. Les ruptures sont fréquentes, les péremptions génèrent des pertes, et la gestion multi-fournisseurs est chronophage.",
    solution: "Un outil de gestion de stock intelligent : prédiction IA des besoins, alerte péremption, comparaison automatique des prix entre grossistes, commande optimisée multi-fournisseurs. Cible : pharmacies indépendantes. Pricing suggéré : 89€/mois.",
    competitors: "Les logiciels de gestion officinale sont limités en IA prédictive.",
    weekTrend: "stable",
  },
  {
    id: 26, name: "Assistant IA pour rédaction médicale", category: "sante", score: 67,
    scores: { demande: 17, croissance: 16, concurrence: 14, monetisation: 11, faisabilite: 9 },
    trend: "+80%", market: "€740M", type: "SaaS", mentions: 300, sources: "PubMed, LinkedIn, Twitter/X",
    problem: "Les médecins passent 2-3 heures par jour sur de la paperasse : comptes-rendus, courriers aux confrères, certificats. La dictée vocale ne structure pas le contenu médical. Le burnout médical est en partie lié à cette charge administrative.",
    solution: "Un assistant IA spécialisé : dictée vocale avec structuration automatique, génération de courriers aux spécialistes, templates par spécialité, intégration aux logiciels métier. Cible : médecins libéraux. Pricing suggéré : 59€/mois.",
    competitors: "Quelques acteurs émergents (Nabla) mais le marché est encore très ouvert.",
    weekTrend: "up",
  },
  {
    id: 27, name: "Plateforme de second avis médical IA", category: "sante", score: 55,
    scores: { demande: 14, croissance: 14, concurrence: 11, monetisation: 9, faisabilite: 7 },
    trend: "+42%", market: "€580M", type: "Marketplace / App", mentions: 190, sources: "Reddit, Google Trends",
    problem: "Quand un patient reçoit un diagnostic grave ou incertain, obtenir un second avis médical est long (6-12 semaines), coûteux et compliqué. Les patients ne savent pas vers quel spécialiste se tourner ni comment transmettre leur dossier.",
    solution: "Une plateforme de second avis : le patient upload son dossier médical, l'IA pré-analyse et oriente vers le bon spécialiste, le médecin rend son avis sous 48-72h. Dossier structuré automatiquement. Cible : patients, mutuelles. Pricing suggéré : 150-300€ par avis ou prise en charge mutuelle.",
    competitors: "Deuxième Avis existe mais le marché reste embryonnaire en France.",
    weekTrend: "stable",
  },
  // ─── IMMOBILIER (additional) ───
  {
    id: 28, name: "Outil de scoring locataire pour propriétaires", category: "immobilier", score: 78,
    scores: { demande: 19, croissance: 19, concurrence: 16, monetisation: 12, faisabilite: 12 },
    trend: "+125%", market: "€780M", type: "SaaS", mentions: 510, sources: "Reddit, Forums immo, Google Trends",
    problem: "Les propriétaires reçoivent des dizaines de dossiers locataires et doivent les trier manuellement. Vérifier la solvabilité, l'authenticité des documents, comparer les profils — tout est chronophage. Les fraudes aux faux bulletins de salaire augmentent.",
    solution: "Un outil de scoring automatique : upload du dossier, vérification IA des documents, score de solvabilité, comparaison entre candidats, alertes fraude. Cible : propriétaires bailleurs et agences. Pricing suggéré : 5€ par dossier ou 29€/mois illimité.",
    competitors: "Dossierfacile.fr existe mais ne fait pas de scoring ni de détection de fraude.",
    weekTrend: "up",
  },
  {
    id: 29, name: "Simulateur investissement locatif IA", category: "immobilier", score: 72,
    scores: { demande: 18, croissance: 17, concurrence: 14, monetisation: 12, faisabilite: 11 },
    trend: "+95%", market: "€1.4B", type: "SaaS / App", mentions: 460, sources: "Reddit, YouTube, Google Trends",
    problem: "Les investisseurs immobiliers débutants ne savent pas évaluer la rentabilité réelle d'un bien. Les simulateurs existants sont basiques et ne prennent pas en compte la fiscalité réelle, les charges, la vacance locative.",
    solution: "Un simulateur avancé : estimation du rendement net-net, simulation fiscale (LMNP, Pinel, SCI), projection sur 10-20 ans, comparaison avec d'autres investissements, analyse du marché local. Cible : investisseurs particuliers. Pricing suggéré : freemium, 14.99€/mois premium.",
    competitors: "Quelques simulateurs basiques en ligne mais aucun avec IA et données marché intégrées.",
    weekTrend: "stable",
  },
  {
    id: 30, name: "Outil de visite virtuelle IA pour agences", category: "immobilier", score: 66,
    scores: { demande: 17, croissance: 16, concurrence: 13, monetisation: 11, faisabilite: 9 },
    trend: "+80%", market: "€620M", type: "SaaS", mentions: 350, sources: "Product Hunt, Google Trends, Twitter/X",
    problem: "Créer des visites virtuelles coûte cher (photographe + Matterport). Les petites agences n'ont pas le budget. Les annonces sans visite virtuelle génèrent 40% moins de contacts.",
    solution: "Un outil qui transforme de simples photos smartphone en visite virtuelle 3D grâce à l'IA : prise de photos guidée, reconstruction 3D auto, intégration SeLoger/LeBonCoin, home staging virtuel en option. Cible : agences et mandataires. Pricing suggéré : 39€/mois.",
    competitors: "Matterport domine le haut de gamme. Très peu d'offre accessible smartphone-only avec IA.",
    weekTrend: "new",
  },
  {
    id: 31, name: "Plateforme de coliving intelligent", category: "immobilier", score: 59,
    scores: { demande: 15, croissance: 14, concurrence: 12, monetisation: 10, faisabilite: 8 },
    trend: "+65%", market: "€480M", type: "Marketplace", mentions: 280, sources: "Reddit, Facebook Groups, Twitter/X",
    problem: "Trouver des colocataires compatibles est un cauchemar. Les plateformes actuelles sont de simples petites annonces sans matching. Les conflits sont la première cause de départ anticipé.",
    solution: "Une plateforme de matching par IA : profil détaillé, algorithme de compatibilité, visite virtuelle, contrat de colocation généré, gestion des dépenses partagées. Cible : étudiants et jeunes actifs. Commission : 1 mois de loyer ou abonnement propriétaire.",
    competitors: "La Carte des Colocs est le leader mais sans matching intelligent.",
    weekTrend: "stable",
  },
  {
    id: 32, name: "Outil de gestion de copropriété simplifié", category: "immobilier", score: 55,
    scores: { demande: 14, croissance: 13, concurrence: 11, monetisation: 9, faisabilite: 8 },
    trend: "+45%", market: "€890M", type: "SaaS", mentions: 190, sources: "Forums immo, Google Trends",
    problem: "Les petites copropriétés ne trouvent pas de syndic professionnel ou paient trop cher. Le syndic bénévole est un casse-tête administratif.",
    solution: "Un outil de syndic assistant : gestion des charges, convocation d'AG, votes en ligne, suivi travaux, comptabilité simplifiée, rappels réglementaires. Cible : syndics bénévoles, petites copropriétés. Pricing suggéré : 9€/mois par copropriété.",
    competitors: "Matera et Cotoit visent les copros moyennes à grandes.",
    weekTrend: "stable",
  },
  {
    id: 33, name: "Outil de rédaction d'annonces immo IA", category: "immobilier", score: 70,
    scores: { demande: 17, croissance: 17, concurrence: 14, monetisation: 11, faisabilite: 11 },
    trend: "+90%", market: "€320M", type: "SaaS", mentions: 350, sources: "Twitter/X, Forums immo, Google Trends",
    problem: "Les agents rédigent des dizaines d'annonces par mois avec les mêmes formules creuses. Une bonne annonce génère 3x plus de contacts mais prend 30 minutes à rédiger.",
    solution: "Un outil qui génère des annonces uniques et vendeuses : caractéristiques du bien → annonce persuasive adaptée à la cible, optimisée SEO portails. Multi-langue en option. Cible : agents et mandataires. Pricing suggéré : 25€/mois.",
    competitors: "Rien de spécialisé immobilier avec les bonnes données métier.",
    weekTrend: "new",
  },
  {
    id: 34, name: "SaaS gestion de parc immobilier pour SCI", category: "immobilier", score: 58,
    scores: { demande: 15, croissance: 14, concurrence: 12, monetisation: 9, faisabilite: 8 },
    trend: "+52%", market: "€340M", type: "SaaS", mentions: 230, sources: "Forums immo, Reddit",
    problem: "Les SCI familiales n'ont aucun outil adapté. La comptabilité SCI est spécifique, les obligations déclaratives complexes, et tout est géré entre Excel et le comptable.",
    solution: "Un outil dédié SCI : comptabilité simplifiée, suivi de rentabilité par bien, simulation fiscale, gestion des AG, documents obligatoires, tableau de bord patrimonial. Cible : gérants de SCI. Pricing suggéré : 19€/mois par SCI.",
    competitors: "Les logiciels comptables classiques ne gèrent pas les spécificités SCI.",
    weekTrend: "stable",
  },
  // ─── BTP (additional) ───
  {
    id: 35, name: "App de suivi de chantier par photo IA", category: "btp", score: 80,
    scores: { demande: 20, croissance: 20, concurrence: 16, monetisation: 12, faisabilite: 12 },
    trend: "+150%", market: "€1.8B", type: "App", mentions: 680, sources: "Forums BTP, Reddit, Google Trends",
    problem: "Le suivi de chantier se fait par WhatsApp et photos en vrac. Les comptes-rendus sont rédigés à la main. Les litiges avec les clients sont fréquents car il n'y a pas de preuve structurée.",
    solution: "Une app mobile ultra simple : photo → l'IA catégorise, géolocalise et horodate, génère un rapport d'avancement automatique, timeline visuelle partageable avec le client. Cible : artisans et chefs de chantier TPE. Pricing suggéré : 19€/mois.",
    competitors: "Finalcad et BatiScript visent les grands groupes. Quasi rien pour les TPE.",
    weekTrend: "up",
  },
  {
    id: 36, name: "Marketplace matériaux BTP entre pros", category: "btp", score: 69,
    scores: { demande: 17, croissance: 17, concurrence: 14, monetisation: 11, faisabilite: 10 },
    trend: "+80%", market: "€2.1B", type: "Marketplace", mentions: 390, sources: "Forums BTP, Reddit",
    problem: "Les artisans achètent chez 2-3 fournisseurs habituels sans comparer. Les surplus de chantier finissent à la déchetterie. Pas de plateforme pour revendre du stock entre pros ou comparer les prix.",
    solution: "Une marketplace B2B : comparateur de prix fournisseurs locaux, revente de surplus entre artisans, livraison mutualisée, historique des prix. Cible : artisans et PME du bâtiment. Commission : 5-8% par transaction.",
    competitors: "StockPro fait les surplus mais pas de plateforme complète prix + surplus.",
    weekTrend: "stable",
  },
  {
    id: 37, name: "Outil de conformité RE2020 automatisé", category: "btp", score: 63,
    scores: { demande: 16, croissance: 16, concurrence: 13, monetisation: 10, faisabilite: 8 },
    trend: "+70%", market: "€560M", type: "SaaS", mentions: 310, sources: "Forums BTP, LinkedIn, Google Trends",
    problem: "La RE2020 impose de nouvelles normes thermiques et carbone. Les bureaux d'études sont submergés, les artisans ne comprennent pas les exigences, et les outils de calcul sont réservés aux experts.",
    solution: "Un outil simplifié : caractéristiques du projet → calcul conformité, points de blocage, alternatives suggérées, rapport conforme aux normes. Cible : constructeurs, architectes. Pricing suggéré : 79€/mois.",
    competitors: "Pleiades, ClimaWin sont complexes et chers. Pas d'offre simplifiée IA.",
    weekTrend: "new",
  },
  {
    id: 38, name: "Plateforme mise en relation chantier/artisan", category: "btp", score: 56,
    scores: { demande: 15, croissance: 13, concurrence: 11, monetisation: 9, faisabilite: 8 },
    trend: "+45%", market: "€1.3B", type: "Marketplace", mentions: 260, sources: "Google Trends, Forums BTP",
    problem: "Les particuliers galèrent à trouver des artisans fiables. Les plateformes existantes vendent des leads en masse. Les artisans reçoivent des demandes non qualifiées.",
    solution: "Une plateforme avec meilleur matching : description projet assistée par IA, matching intelligent par spécialité et zone, avis vérifiés post-chantier. Cible : particuliers + artisans. Commission : 15€ par mise en relation.",
    competitors: "Marché concurrentiel mais la qualité du matching reste le point faible de tous.",
    weekTrend: "stable",
  },
  {
    id: 39, name: "Logiciel planification de chantier IA", category: "btp", score: 52,
    scores: { demande: 13, croissance: 13, concurrence: 11, monetisation: 8, faisabilite: 7 },
    trend: "+40%", market: "€720M", type: "SaaS", mentions: 180, sources: "Forums BTP, LinkedIn",
    problem: "La planification pour les petites entreprises se fait sur Excel. Les retards s'accumulent car les dépendances entre corps de métier ne sont pas gérées — effet domino non anticipé.",
    solution: "Un planning visuel intelligent : Gantt simplifié, gestion des dépendances entre lots, alertes retard, recalcul IA du planning en temps réel. Cible : chefs de chantier TPE/PME. Pricing suggéré : 39€/mois.",
    competitors: "MS Project est surdimensionné. Quelques apps existent mais sans IA.",
    weekTrend: "stable",
  },
  {
    id: 40, name: "Plateforme formation IA pour artisans", category: "btp", score: 48,
    scores: { demande: 12, croissance: 12, concurrence: 10, monetisation: 8, faisabilite: 6 },
    trend: "+35%", market: "€380M", type: "Plateforme", mentions: 150, sources: "Forums BTP, YouTube",
    problem: "Les artisans doivent se former continuellement (nouvelles normes, matériaux, techniques) mais les formations classiques sont chères et peu adaptées à leur emploi du temps.",
    solution: "Micro-formations vidéo de 10-15 minutes, certifiantes, accessibles sur mobile au chantier, contenu mis à jour par IA. Cible : artisans en activité. Pricing suggéré : 19€/mois ou OPCO.",
    competitors: "Peu de formation en ligne spécifique BTP. Les organismes classiques sont rigides.",
    weekTrend: "stable",
  },
  {
    id: 41, name: "Outil calcul bilan carbone chantier", category: "btp", score: 51,
    scores: { demande: 13, croissance: 12, concurrence: 11, monetisation: 8, faisabilite: 7 },
    trend: "+38%", market: "€290M", type: "SaaS", mentions: 170, sources: "LinkedIn, Forums BTP",
    problem: "La réglementation pousse au calcul de l'empreinte carbone mais les outils sont complexes et réservés aux bureaux d'études. Les PME n'ont ni les compétences ni le budget.",
    solution: "Un outil simplifié : matériaux et quantités → empreinte calculée, alternatives moins carbonées suggérées, rapport conforme. Cible : PME BTP, maîtres d'œuvre. Pricing suggéré : 49€/mois.",
    competitors: "Elodie, Vizcab sont experts. Rien de simplifié pour TPE/PME.",
    weekTrend: "stable",
  },
  // ─── MARKETING & COM (additional) ───
  {
    id: 42, name: "Générateur de landing pages IA", category: "marketing", score: 80,
    scores: { demande: 20, croissance: 19, concurrence: 16, monetisation: 13, faisabilite: 12 },
    trend: "+140%", market: "€1.6B", type: "SaaS", mentions: 720, sources: "Product Hunt, Reddit, Twitter/X",
    problem: "Créer une landing page qui convertit demande des compétences en copywriting, design et technique. Les freelances passent des jours dessus. Les builders facilitent la technique mais pas la stratégie de conversion.",
    solution: "L'utilisateur décrit son offre en 3 phrases → l'IA génère une landing page complète : structure persuasive, copywriting optimisé, design pro, responsive, hébergement inclus, A/B testing des headlines. Cible : freelances, solopreneurs, PME. Pricing suggéré : 19€/mois.",
    competitors: "Carrd, Unbounce, Leadpages existent mais aucun ne fait la stratégie + le copy par IA.",
    weekTrend: "up",
  },
  {
    id: 43, name: "Outil d'analyse de concurrents par IA", category: "marketing", score: 76,
    scores: { demande: 19, croissance: 18, concurrence: 15, monetisation: 12, faisabilite: 12 },
    trend: "+105%", market: "€920M", type: "SaaS", mentions: 480, sources: "Reddit, Indie Hackers, Product Hunt",
    problem: "Surveiller ses concurrents demande de checker manuellement leurs sites, réseaux sociaux, prix, features, campagnes pub. Les outils de veille sont chers et orientés SEO uniquement.",
    solution: "Un radar concurrentiel IA : suivi automatique des changements, analyse des stratégies, alertes temps réel, benchmark vs son propre produit, rapport mensuel. Cible : fondateurs SaaS, directeurs marketing. Pricing suggéré : 39€/mois.",
    competitors: "Crayon, Kompyte sont orientés enterprise à +200€/mois.",
    weekTrend: "new",
  },
  {
    id: 44, name: "Plateforme de création de newsletters IA", category: "marketing", score: 73,
    scores: { demande: 18, croissance: 18, concurrence: 14, monetisation: 12, faisabilite: 11 },
    trend: "+115%", market: "€780M", type: "SaaS", mentions: 520, sources: "Twitter/X, Product Hunt, Reddit",
    problem: "Lancer et maintenir une newsletter demande énormément de travail. Beaucoup de créateurs abandonnent après quelques numéros. Les outils actuels gèrent la distribution mais pas la création de contenu.",
    solution: "Suggestion de sujets tendance dans la niche, rédaction assistée avec le ton de l'auteur, templates visuels, optimisation de l'objet par IA, analyse des performances avec suggestions. Cible : créateurs, solopreneurs. Pricing suggéré : 15€/mois.",
    competitors: "Substack et Beehiiv dominent la distribution. L'angle création IA est le différenciateur.",
    weekTrend: "up",
  },
  {
    id: 45, name: "Outil de repurposing de contenu IA", category: "marketing", score: 71,
    scores: { demande: 18, croissance: 17, concurrence: 14, monetisation: 11, faisabilite: 11 },
    trend: "+100%", market: "€620M", type: "SaaS", mentions: 440, sources: "Twitter/X, Reddit, YouTube",
    problem: "Les créateurs passent des heures sur un contenu long puis n'ont plus le temps de le décliner. Un article pourrait devenir 10 posts LinkedIn, 5 tweets, 3 carrousels — mais personne ne le fait manuellement.",
    solution: "Un outil qui prend un contenu source et génère des déclinaisons pour chaque plateforme : posts LinkedIn, threads Twitter, carrousels, scripts de shorts, extraits newsletter — dans le ton de l'auteur. Cible : créateurs, marketeurs. Pricing suggéré : 25€/mois.",
    competitors: "Repurpose.io fait de la vidéo. Typeshare fait du texte. Aucun ne fait tout avec IA.",
    weekTrend: "up",
  },
  {
    id: 46, name: "Outil de social proof automatisé", category: "marketing", score: 67,
    scores: { demande: 16, croissance: 16, concurrence: 14, monetisation: 11, faisabilite: 10 },
    trend: "+75%", market: "€340M", type: "SaaS", mentions: 310, sources: "Indie Hackers, Product Hunt, Twitter/X",
    problem: "Collecter et afficher des témoignages clients est manuel. Les widgets existants sont limités. La vidéo testimoniale est puissante mais difficile à obtenir.",
    solution: "Collecte automatisée (email + SMS), formulaire vidéo simplifié (1 clic), mur de témoignages intégrable, widget notifications, import avis Google/Trustpilot. Cible : SaaS, freelances, e-commerce. Pricing suggéré : 25€/mois.",
    competitors: "Senja, Testimonial.to émergent mais marché fragmenté.",
    weekTrend: "stable",
  },
  {
    id: 47, name: "Générateur de stratégie SEO par IA", category: "marketing", score: 69,
    scores: { demande: 17, croissance: 17, concurrence: 13, monetisation: 11, faisabilite: 11 },
    trend: "+88%", market: "€1.2B", type: "SaaS", mentions: 380, sources: "Reddit, Twitter/X, Product Hunt",
    problem: "Les freelances et PME savent que le SEO est important mais ne savent pas par où commencer. Les outils donnent des données brutes sans stratégie. La plupart des petits sites n'exploitent pas 10% de leur potentiel.",
    solution: "Analyse du site → opportunités de mots-clés accessibles → plan de contenu SEO priorisé : quels articles écrire, dans quel ordre, quelle structure. Plan sur 3 mois en 5 minutes. Cible : freelances, PME, blogueurs. Pricing suggéré : 29€/mois.",
    competitors: "SEMrush et Ahrefs dominent les données. L'angle stratégie actionnable IA est libre.",
    weekTrend: "new",
  },
  {
    id: 48, name: "CRM gestion d'influenceurs pour PME", category: "marketing", score: 62,
    scores: { demande: 15, croissance: 15, concurrence: 13, monetisation: 10, faisabilite: 9 },
    trend: "+65%", market: "€480M", type: "SaaS", mentions: 280, sources: "Twitter/X, LinkedIn, Reddit",
    problem: "Les PME veulent travailler avec des micro-influenceurs mais ne savent pas comment les trouver, contacter, négocier et mesurer le ROI. Les plateformes d'influence sont conçues pour les grandes marques à +500€/mois.",
    solution: "Un CRM simplifié : recherche d'influenceurs par niche et localisation, templates de contact, suivi des collaborations, calcul du ROI, gestion des envois produits. Cible : PME et e-commerçants. Pricing suggéré : 39€/mois.",
    competitors: "Kolsquare, Upfluence visent les grands comptes. Pas d'offre abordable pour PME.",
    weekTrend: "stable",
  },
  {
    id: 49, name: "Outil gestion des avis Google pour PME", category: "marketing", score: 66,
    scores: { demande: 17, croissance: 15, concurrence: 13, monetisation: 11, faisabilite: 10 },
    trend: "+72%", market: "€460M", type: "SaaS", mentions: 290, sources: "Google Trends, Reddit, Forums PME",
    problem: "Les avis Google sont le premier critère de choix pour les commerces locaux. Mais les PME ne demandent pas d'avis systématiquement, ne répondent pas aux négatifs, et ne savent pas comment améliorer leur note.",
    solution: "Demande automatisée d'avis après chaque prestation, réponses générées par IA, analyse du sentiment, suggestions d'amélioration, benchmark concurrents locaux. Cible : commerces, restaurants, artisans. Pricing suggéré : 29€/mois.",
    competitors: "Partoo, Localranker existent mais marché fragmenté et IA peu exploitée.",
    weekTrend: "up",
  },
  {
    id: 50, name: "Bot LinkedIn lead gen pour agences", category: "marketing", score: 64,
    scores: { demande: 16, croissance: 15, concurrence: 13, monetisation: 11, faisabilite: 9 },
    trend: "+70%", market: "€560M", type: "SaaS", mentions: 340, sources: "Reddit, Twitter/X, LinkedIn",
    problem: "Les agences prospectent sur LinkedIn manuellement : recherche, demandes de connexion, messages, relances. Efficace mais chronophage. Les outils d'automatisation risquent le ban et ne personnalisent pas assez.",
    solution: "Identification des prospects par IA, messages hyper-personnalisés (analyse profil, contenu, problématiques), séquences adaptatives, respect des limites LinkedIn. Cible : agences marketing et commerciales. Pricing suggéré : 59€/mois.",
    competitors: "Waalaxy, Phantombuster existent. La personnalisation IA profonde est le différenciateur.",
    weekTrend: "stable",
  },
  {
    id: 51, name: "Plateforme micro-learning marketing", category: "marketing", score: 54,
    scores: { demande: 14, croissance: 13, concurrence: 11, monetisation: 9, faisabilite: 7 },
    trend: "+48%", market: "€420M", type: "Plateforme", mentions: 210, sources: "Reddit, Twitter/X",
    problem: "Les freelances doivent constamment apprendre de nouvelles compétences marketing mais n'ont pas le temps pour des formations longues. Les contenus gratuits sont dispersés et inégaux.",
    solution: "Micro-formations de 10 minutes : un sujet = un module actionnable, exercices pratiques, progression gamifiée, contenu mis à jour par IA. Cible : freelances marketing, solopreneurs. Pricing suggéré : 15€/mois.",
    competitors: "Udemy et Coursera sont généralistes. Le micro-learning marketing spécialisé est libre.",
    weekTrend: "stable",
  },
];

const WEEK_LABEL = "Semaine du 10 mars 2026";

// ─── SCORING CRITERIA ───
const SCORE_LABELS = {
  demande: { label: "Demande", max: 25, desc: "Volume de mentions et recherches détectées" },
  croissance: { label: "Croissance", max: 25, desc: "Vitesse d'évolution de la tendance" },
  concurrence: { label: "Concurrence", max: 20, desc: "Moins de concurrence = score plus élevé" },
  monetisation: { label: "Monétisation", max: 15, desc: "Potentiel de revenus identifié" },
  faisabilite: { label: "Faisabilité", max: 15, desc: "Facilité à lancer un MVP" },
};

// ─── COMPONENTS ───

function ThemeToggle({ dark, setDark }) {
  const t = dark ? tokens.dark : tokens.light;
  return (
    <button onClick={() => setDark(!dark)} style={{ background: t.bgTertiary, border: `1px solid ${t.border}`, color: t.textSecondary, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 13, transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: 6 }}>
      {dark ? "☀" : "☾"} {dark ? "Light" : "Dark"}
    </button>
  );
}

function ScoreRing({ score, size = 48, strokeWidth = 3.5, dark }) {
  const t = dark ? tokens.dark : tokens.light;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? t.green : score >= 70 ? t.blue : t.yellow;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.borderLight} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.28, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif" }}>
        {score}
      </div>
    </div>
  );
}

function TrendBadge({ value, dark }) {
  const t = dark ? tokens.dark : tokens.light;
  const num = parseInt(value);
  const color = num >= 200 ? t.green : num >= 100 ? t.blue : t.textSecondary;
  return (
    <span style={{ color, fontSize: 12, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</span>
  );
}

function WeekBadge({ type, dark }) {
  const t = dark ? tokens.dark : tokens.light;
  const config = {
    new: { label: "Nouveau", bg: t.accentBg, color: t.accent, border: t.accentBorder },
    up: { label: "En hausse", bg: t.greenBg, color: t.green, border: t.greenBorder },
    stable: { label: "Stable", bg: t.bgTertiary, color: t.textSecondary, border: t.border },
  };
  const c = config[type] || config.stable;
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.02em" }}>
      {c.label}
    </span>
  );
}

function Tag({ children, dark, color }) {
  const t = dark ? tokens.dark : tokens.light;
  const c = color || t.textSecondary;
  return (
    <span style={{ color: c, background: `${c}10`, border: `1px solid ${c}20`, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500 }}>
      {children}
    </span>
  );
}

function ScoreBreakdown({ scores, dark }) {
  const t = dark ? tokens.dark : tokens.light;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {Object.entries(SCORE_LABELS).map(([key, meta]) => {
        const val = scores[key];
        const pct = (val / meta.max) * 100;
        const color = pct >= 85 ? t.green : pct >= 65 ? t.blue : t.yellow;
        return (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: t.textSecondary, fontWeight: 500 }}>{meta.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace" }}>{val}/{meta.max}</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: t.bgTertiary, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: color, transition: "width 0.8s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── VIEWS ───

function TopView({ opportunities, onSelect, onSwitchView, dark }) {
  const t = dark ? tokens.dark : tokens.light;
  const sorted = [...opportunities].sort((a, b) => b.score - a.score);
  const top10 = sorted.slice(0, 10);
  const rest = sorted.slice(10);
  const [showAll, setShowAll] = useState(false);
  const avgScore = Math.round(opportunities.reduce((a, b) => a + b.score, 0) / opportunities.length);
  const newCount = opportunities.filter(o => o.weekTrend === "new").length;

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Opportunités", value: opportunities.length, color: t.accent },
          { label: "Score moyen", value: avgScore + "/100", color: t.blue },
          { label: "Nouvelles", value: newCount, color: t.green },
          { label: "Catégories", value: CATEGORIES.length - 1, color: t.textSecondary },
        ].map((s, i) => (
          <div key={i} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", boxShadow: t.shadow }}>
            <div style={{ fontSize: 11, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Fraunces', Georgia, serif" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Fraunces', Georgia, serif" }}>Top 10 de la semaine</h2>
        <p style={{ color: t.textTertiary, fontSize: 13, margin: "6px 0 0", lineHeight: 1.5 }}>
          Les opportunités business les mieux scorées cette semaine — analyse IA mise à jour chaque lundi.
        </p>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {top10.map((opp, i) => (
          <div key={opp.id} onClick={() => onSelect(opp)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.25s ease", boxShadow: t.shadow, display: "flex", alignItems: "center", gap: 16 }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowHover; e.currentTarget.style.borderColor = t.accent + "40"; e.currentTarget.style.background = t.bgCardHover; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.bgCard; }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: t.textTertiary, width: 32, textAlign: "center", fontFamily: "'Fraunces', Georgia, serif", opacity: 0.5 }}>{i + 1}</div>
            <ScoreRing score={opp.score} dark={dark} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 6, lineHeight: 1.3 }}>{opp.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                <Tag dark={dark}>{CATEGORIES.find(c => c.id === opp.category)?.label}</Tag>
                <Tag dark={dark}>{opp.type}</Tag>
                <WeekBadge type={opp.weekTrend} dark={dark} />
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <TrendBadge value={opp.trend} dark={dark} />
              <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 4 }}>{opp.market}</div>
            </div>
            <div style={{ color: t.textTertiary, fontSize: 18, flexShrink: 0, marginLeft: 4 }}>→</div>
          </div>
        ))}
      </div>

      {/* All other opportunities */}
      {rest.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Fraunces', Georgia, serif" }}>Toutes les opportunités</h2>
              <p style={{ color: t.textTertiary, fontSize: 13, margin: "4px 0 0" }}>{rest.length} opportunités supplémentaires classées par score</p>
            </div>
            <button onClick={() => setShowAll(!showAll)} style={{ background: t.accentBg, color: t.accent, border: `1px solid ${t.accentBorder}`, borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s ease" }}>
              {showAll ? "Réduire" : `Voir les ${rest.length} opportunités`}
            </button>
          </div>

          {showAll && (
            <div style={{ display: "grid", gap: 8 }}>
              {rest.map((opp, i) => (
                <div key={opp.id} onClick={() => onSelect(opp)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.25s ease", boxShadow: t.shadow, display: "flex", alignItems: "center", gap: 14 }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowHover; e.currentTarget.style.borderColor = t.accent + "30"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.borderColor = t.border; }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.textTertiary, width: 28, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", opacity: 0.4 }}>{i + 11}</div>
                  <ScoreRing score={opp.score} size={40} strokeWidth={3} dark={dark} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4, lineHeight: 1.3 }}>{opp.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      <Tag dark={dark}>{CATEGORIES.find(c => c.id === opp.category)?.label}</Tag>
                      <Tag dark={dark}>{opp.type}</Tag>
                      <WeekBadge type={opp.weekTrend} dark={dark} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <TrendBadge value={opp.trend} dark={dark} />
                    <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 3 }}>{opp.market}</div>
                  </div>
                  <div style={{ color: t.textTertiary, fontSize: 16, flexShrink: 0 }}>→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryView({ opportunities, onSelect, dark, initialCat }) {
  const t = dark ? tokens.dark : tokens.light;
  const [activeCat, setActiveCat] = useState(initialCat || "all");
  const filtered = activeCat === "all" ? opportunities : opportunities.filter(o => o.category === activeCat);
  const sorted = [...filtered].sort((a, b) => b.score - a.score);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Fraunces', Georgia, serif" }}>Catégories</h2>
        <p style={{ color: t.textTertiary, fontSize: 13, margin: "6px 0 0", lineHeight: 1.5 }}>
          Explore les opportunités par secteur d'activité.
        </p>
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {CATEGORIES.map(cat => {
          const active = activeCat === cat.id;
          const count = cat.id === "all" ? opportunities.length : opportunities.filter(o => o.category === cat.id).length;
          return (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
              background: active ? t.accentBg : t.bgCard,
              color: active ? t.accent : t.textSecondary,
              border: `1px solid ${active ? t.accentBorder : t.border}`,
              borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: 6,
              fontFamily: "inherit",
            }}>
              <span>{cat.icon}</span> {cat.label}
              <span style={{ background: active ? t.accent + "20" : t.bgTertiary, padding: "1px 6px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Category Stats */}
      {activeCat !== "all" && (
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, boxShadow: t.shadow }}>
          <div>
            <div style={{ fontSize: 11, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>Opportunités</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif" }}>{sorted.length}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>Score moyen</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: t.accent, fontFamily: "'Fraunces', Georgia, serif" }}>{Math.round(sorted.reduce((a, b) => a + b.score, 0) / sorted.length)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>Meilleur score</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: t.green, fontFamily: "'Fraunces', Georgia, serif" }}>{sorted[0]?.score || "—"}</div>
          </div>
        </div>
      )}

      {/* Opportunity Cards */}
      <div style={{ display: "grid", gap: 12 }}>
        {sorted.map(opp => (
          <div key={opp.id} onClick={() => onSelect(opp)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.25s ease", boxShadow: t.shadow, display: "flex", alignItems: "center", gap: 16 }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowHover; e.currentTarget.style.borderColor = t.accent + "40"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.borderColor = t.border; }}>
            <ScoreRing score={opp.score} dark={dark} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 6, lineHeight: 1.3 }}>{opp.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                <Tag dark={dark}>{opp.type}</Tag>
                <Tag dark={dark}>{opp.market}</Tag>
                <WeekBadge type={opp.weekTrend} dark={dark} />
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <TrendBadge value={opp.trend} dark={dark} />
              <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 4 }}>{opp.mentions} mentions</div>
            </div>
            <div style={{ color: t.textTertiary, fontSize: 18, flexShrink: 0 }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailView({ opportunity: opp, onBack, dark }) {
  const t = dark ? tokens.dark : tokens.light;
  const cat = CATEGORIES.find(c => c.id === opp.category);

  return (
    <div>
      {/* Back */}
      <button onClick={onBack} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 20, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
        ← Retour
      </button>

      {/* Header Card */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, boxShadow: t.shadow, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
          <ScoreRing score={opp.score} size={72} strokeWidth={4.5} dark={dark} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              <Tag dark={dark} color={t.accent}>{cat?.label}</Tag>
              <Tag dark={dark}>{opp.type}</Tag>
              <WeekBadge type={opp.weekTrend} dark={dark} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: t.text, margin: "0 0 8px", lineHeight: 1.3, fontFamily: "'Fraunces', Georgia, serif" }}>{opp.name}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13 }}>
              <span style={{ color: t.textSecondary }}>Marché : <strong style={{ color: t.text }}>{opp.market}</strong></span>
              <span style={{ color: t.textSecondary }}>Tendance : <TrendBadge value={opp.trend} dark={dark} /></span>
              <span style={{ color: t.textSecondary }}>Mentions : <strong style={{ color: t.text }}>{opp.mentions.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, boxShadow: t.shadow, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: "0 0 16px", fontFamily: "'Fraunces', Georgia, serif" }}>Détail du score</h3>
        <ScoreBreakdown scores={opp.scores} dark={dark} />
        <div style={{ marginTop: 14, padding: "10px 14px", background: t.bgTertiary, borderRadius: 10, fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>
          Score calculé sur 5 critères : demande marché (25pts), vitesse de croissance (25pts), niveau de concurrence (20pts), potentiel de monétisation (15pts) et faisabilité technique (15pts).
        </div>
      </div>

      {/* Problem */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, boxShadow: t.shadow, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: "0 0 12px", fontFamily: "'Fraunces', Georgia, serif" }}>Problématique identifiée</h3>
        <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{opp.problem}</p>
        <div style={{ marginTop: 12, fontSize: 12, color: t.textTertiary }}>
          Sources : {opp.sources}
        </div>
      </div>

      {/* Solution */}
      <div style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: t.accent, margin: "0 0 12px", fontFamily: "'Fraunces', Georgia, serif" }}>Début de solution proposée</h3>
        <p style={{ color: t.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{opp.solution}</p>
      </div>

      {/* Competition */}
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, boxShadow: t.shadow, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: "0 0 12px", fontFamily: "'Fraunces', Georgia, serif" }}>Paysage concurrentiel</h3>
        <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{opp.competitors}</p>
      </div>

      {/* CTA */}
      <div style={{ background: `linear-gradient(135deg, ${t.accentBg}, ${t.bgCard})`, border: `1px solid ${t.accentBorder}`, borderRadius: 16, padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 8, fontFamily: "'Fraunces', Georgia, serif" }}>Cette opportunité vous intéresse ?</div>
        <p style={{ color: t.textSecondary, fontSize: 14, marginBottom: 18, lineHeight: 1.5 }}>
          On vous accompagne pour transformer cette opportunité en projet concret — de l'idée au lancement.
        </p>
        <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: t.accent, color: "#FFFFFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.2s ease", cursor: "pointer", border: "none", fontFamily: "inherit" }}
          onMouseEnter={e => e.currentTarget.style.background = t.accentLight}
          onMouseLeave={e => e.currentTarget.style.background = t.accent}>
          Prendre rendez-vous →
        </a>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ───
function ContactView({ dark }) {
  const t = dark ? tokens.dark : tokens.light;
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Fraunces', Georgia, serif" }}>On vous accompagne</h2>
        <p style={{ color: t.textSecondary, fontSize: 14, margin: "10px 0 0", lineHeight: 1.6 }}>
          Vous avez repéré une opportunité ? On vous aide à la transformer en business — de la stratégie au lancement.
        </p>
      </div>

      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 28, boxShadow: t.shadow, marginBottom: 24 }}>
        <div style={{ display: "grid", gap: 20, marginBottom: 24 }}>
          {[
            { icon: "◎", title: "Validation de l'idée", desc: "On analyse le marché, la concurrence et la viabilité de votre opportunité." },
            { icon: "△", title: "Stratégie de lancement", desc: "Plan d'action, MVP, acquisition des premiers clients — tout est structuré." },
            { icon: "⬡", title: "Accompagnement continu", desc: "Suivi hebdomadaire pour itérer, optimiser et scaler votre projet." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: t.accentBg, border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: t.accent, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: t.accent, color: "#FFFFFF", padding: "14px 28px", borderRadius: 12,
          fontSize: 15, fontWeight: 600, textDecoration: "none", cursor: "pointer",
          transition: "all 0.2s ease", width: "100%", border: "none", fontFamily: "inherit",
        }}
          onMouseEnter={e => e.currentTarget.style.background = t.accentLight}
          onMouseLeave={e => e.currentTarget.style.background = t.accent}>
          Réserver un appel découverte →
        </a>
      </div>

      <div style={{ textAlign: "center", fontSize: 12, color: t.textTertiary, lineHeight: 1.6 }}>
        Appel gratuit de 30 minutes · Sans engagement · On discute de votre projet
      </div>
    </div>
  );
}

// ─── HOME VIEW ───
function HomeView({ opportunities, onSelect, onNavigate, dark }) {
  const t = dark ? tokens.dark : tokens.light;
  const sorted = [...opportunities].sort((a, b) => b.score - a.score);
  const top5 = sorted.slice(0, 5);
  const avgScore = Math.round(opportunities.reduce((a, b) => a + b.score, 0) / opportunities.length);
  const newOpps = opportunities.filter(o => o.weekTrend === "new");
  const risingOpps = opportunities.filter(o => o.weekTrend === "up");
  const totalMentions = opportunities.reduce((a, b) => a + b.mentions, 0);
  const catCounts = CATEGORIES.filter(c => c.id !== "all").map(c => ({
    ...c,
    count: opportunities.filter(o => o.category === c.id).length,
    avgScore: Math.round(opportunities.filter(o => o.category === c.id).reduce((a, b) => a + b.score, 0) / opportunities.filter(o => o.category === c.id).length),
    best: [...opportunities.filter(o => o.category === c.id)].sort((a, b) => b.score - a.score)[0],
  }));

  const Btn = ({ children, onClick, primary }) => (
    <button onClick={onClick} style={{
      background: primary ? t.accent : t.bgCard,
      color: primary ? "#FFF" : t.textSecondary,
      border: `1px solid ${primary ? t.accent : t.border}`,
      borderRadius: 10, padding: "10px 22px", cursor: "pointer", fontSize: 13, fontWeight: 600,
      transition: "all 0.2s ease", fontFamily: "inherit",
    }}
      onMouseEnter={e => { if (primary) e.currentTarget.style.background = t.accentLight; else e.currentTarget.style.borderColor = t.accent + "50"; }}
      onMouseLeave={e => { if (primary) e.currentTarget.style.background = t.accent; else e.currentTarget.style.borderColor = t.border; }}>
      {children}
    </button>
  );

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "20px 0 36px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: t.text, margin: 0, fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.2 }}>
          Votre radar d'opportunités business
        </h1>
        <p style={{ color: t.textSecondary, fontSize: 15, margin: "12px auto 0", maxWidth: 520, lineHeight: 1.6 }}>
          Chaque semaine, notre IA analyse des milliers de signaux pour détecter les meilleures opportunités de marché. Trouvez votre prochaine idée.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Opportunités", value: opportunities.length, color: t.accent },
          { label: "Score moyen", value: avgScore, color: t.blue },
          { label: "Nouvelles", value: newOpps.length, sub: "cette semaine", color: t.green },
          { label: "En hausse", value: risingOpps.length, sub: "cette semaine", color: t.yellow },
          { label: "Mentions", value: totalMentions.toLocaleString(), color: t.textSecondary },
          { label: "Secteurs", value: catCounts.length, color: t.accent },
        ].map((s, i) => (
          <div key={i} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 18px", boxShadow: t.shadow }}>
            <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'Fraunces', Georgia, serif" }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 2 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      {newOpps.length > 0 && (
        <div onClick={() => onSelect(newOpps.sort((a,b) => b.score - a.score)[0])} style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, borderRadius: 14, padding: "18px 22px", marginBottom: 32, cursor: "pointer", transition: "all 0.2s ease" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
          onMouseLeave={e => e.currentTarget.style.borderColor = t.accentBorder}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent, display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: t.accent }}>Alerte opportunité</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 4 }}>
            {newOpps.sort((a,b) => b.score - a.score)[0].name}
          </div>
          <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.5 }}>
            Score {newOpps.sort((a,b) => b.score - a.score)[0].score}/100 · {newOpps.sort((a,b) => b.score - a.score)[0].trend} de croissance · Cliquez pour découvrir →
          </div>
        </div>
      )}

      {/* Top 5 Preview */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Fraunces', Georgia, serif" }}>Top 5 de la semaine</h2>
          <button onClick={() => onNavigate("top")} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>Voir le Top 10 →</button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {top5.map((opp, i) => (
            <div key={opp.id} onClick={() => onSelect(opp)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.25s ease", boxShadow: t.shadow, display: "flex", alignItems: "center", gap: 14 }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowHover; e.currentTarget.style.borderColor = t.accent + "40"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.borderColor = t.border; }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.textTertiary, width: 28, textAlign: "center", fontFamily: "'Fraunces', Georgia, serif", opacity: 0.4 }}>{i + 1}</div>
              <ScoreRing score={opp.score} size={42} strokeWidth={3} dark={dark} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4, lineHeight: 1.3 }}>{opp.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <Tag dark={dark}>{CATEGORIES.find(c => c.id === opp.category)?.label}</Tag>
                  <Tag dark={dark}>{opp.type}</Tag>
                  <WeekBadge type={opp.weekTrend} dark={dark} />
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <TrendBadge value={opp.trend} dark={dark} />
                <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 3 }}>{opp.market}</div>
              </div>
              <div style={{ color: t.textTertiary, fontSize: 16, flexShrink: 0 }}>→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sectors Overview */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Fraunces', Georgia, serif" }}>Par secteur</h2>
          <button onClick={() => onNavigate("categories")} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>Voir toutes les catégories →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {catCounts.map(cat => (
            <div key={cat.id} onClick={() => onNavigate("categories", cat.id)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.25s ease", boxShadow: t.shadow }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowHover; e.currentTarget.style.borderColor = t.accent + "40"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.borderColor = t.border; }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: t.accentBg, border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: t.accent }}>{cat.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{cat.label}</div>
                    <div style={{ fontSize: 12, color: t.textTertiary }}>{cat.count} opportunités</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Score moy.</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: t.blue, fontFamily: "'Fraunces', Georgia, serif" }}>{cat.avgScore}</div>
                </div>
              </div>
              {cat.best && (
                <div style={{ background: t.bgSecondary, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>Meilleure opportunité</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{cat.best.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.green, fontFamily: "'IBM Plex Mono', monospace" }}>{cat.best.score}/100</span>
                    <TrendBadge value={cat.best.trend} dark={dark} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* New this week */}
      {newOpps.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: "0 0 16px", fontFamily: "'Fraunces', Georgia, serif" }}>
            Nouvelles cette semaine
            <span style={{ background: t.accentBg, color: t.accent, border: `1px solid ${t.accentBorder}`, padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, marginLeft: 10 }}>{newOpps.length}</span>
          </h2>
          <div style={{ display: "grid", gap: 10 }}>
            {newOpps.sort((a, b) => b.score - a.score).map(opp => (
              <div key={opp.id} onClick={() => onSelect(opp)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.25s ease", boxShadow: t.shadow, display: "flex", alignItems: "center", gap: 14 }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowHover; e.currentTarget.style.borderColor = t.accent + "40"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.borderColor = t.border; }}>
                <ScoreRing score={opp.score} size={40} strokeWidth={3} dark={dark} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4, lineHeight: 1.3 }}>{opp.name}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <Tag dark={dark}>{CATEGORIES.find(c => c.id === opp.category)?.label}</Tag>
                    <Tag dark={dark}>{opp.type}</Tag>
                    <WeekBadge type="new" dark={dark} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <TrendBadge value={opp.trend} dark={dark} />
                  <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 3 }}>{opp.market}</div>
                </div>
                <div style={{ color: t.textTertiary, fontSize: 16, flexShrink: 0 }}>→</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rising */}
      {risingOpps.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: "0 0 16px", fontFamily: "'Fraunces', Georgia, serif" }}>
            En hausse
            <span style={{ background: t.greenBg, color: t.green, border: `1px solid ${t.greenBorder}`, padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, marginLeft: 10 }}>{risingOpps.length}</span>
          </h2>
          <div style={{ display: "grid", gap: 10 }}>
            {risingOpps.sort((a, b) => b.score - a.score).map(opp => (
              <div key={opp.id} onClick={() => onSelect(opp)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.25s ease", boxShadow: t.shadow, display: "flex", alignItems: "center", gap: 14 }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowHover; e.currentTarget.style.borderColor = t.green + "40"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.borderColor = t.border; }}>
                <ScoreRing score={opp.score} size={40} strokeWidth={3} dark={dark} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4, lineHeight: 1.3 }}>{opp.name}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <Tag dark={dark}>{CATEGORIES.find(c => c.id === opp.category)?.label}</Tag>
                    <Tag dark={dark}>{opp.type}</Tag>
                    <WeekBadge type="up" dark={dark} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <TrendBadge value={opp.trend} dark={dark} />
                  <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 3 }}>{opp.market}</div>
                </div>
                <div style={{ color: t.textTertiary, fontSize: 16, flexShrink: 0 }}>→</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA banner */}
      <div style={{ background: `linear-gradient(135deg, ${t.accentBg}, ${t.bgCard})`, border: `1px solid ${t.accentBorder}`, borderRadius: 16, padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 8, fontFamily: "'Fraunces', Georgia, serif" }}>Une opportunité vous parle ?</div>
        <p style={{ color: t.textSecondary, fontSize: 14, marginBottom: 18, lineHeight: 1.5, maxWidth: 440, margin: "0 auto 18px" }}>
          On vous accompagne de l'idée au lancement — stratégie, MVP, acquisition clients.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Btn onClick={() => onNavigate("top")} primary={false}>Explorer le Top 10</Btn>
          <Btn onClick={() => onNavigate("contact")} primary={true}>Prendre rendez-vous →</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function Trendora() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState("home");
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [initialCat, setInitialCat] = useState(null);
  const t = dark ? tokens.dark : tokens.light;

  const handleSelect = useCallback((opp) => {
    setSelectedOpp(opp);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedOpp(null);
    setView(prev => prev === "detail" ? "home" : prev);
  }, []);

  const handleNavigate = useCallback((target, catId) => {
    setSelectedOpp(null);
    if (catId) setInitialCat(catId);
    else setInitialCat(null);
    setView(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navItems = [
    { id: "home", label: "Accueil" },
    { id: "top", label: "Top 10" },
    { id: "categories", label: "Catégories" },
  ];

  return (
    <div style={{ background: t.bg, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Source+Sans+3:ital,wght@0,300..900;1,300..900&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif; }
        ::selection { background: ${t.accent}30; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      {/* ─── HEADER ─── */}
      <header style={{ background: t.bg + "E6", borderBottom: `1px solid ${t.border}`, backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50, transition: "all 0.3s ease" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => { setView("home"); setSelectedOpp(null); }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 14, fontWeight: 800 }}>T</div>
              <span style={{ fontSize: 18, fontWeight: 700, color: t.text, fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.01em" }}>Trendora</span>
            </div>
            <nav style={{ display: "flex", gap: 4 }}>
              {navItems.map(item => {
                const active = view === item.id || (view === "detail" && item.id === "home");
                return (
                  <button key={item.id} onClick={() => handleNavigate(item.id)} style={{
                    background: active ? t.accentBg : "transparent",
                    color: active ? t.accent : t.textSecondary,
                    border: `1px solid ${active ? t.accentBorder : "transparent"}`,
                    borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    transition: "all 0.2s ease", fontFamily: "inherit",
                  }}>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle dark={dark} setDark={setDark} />
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer"
              onClick={(e) => { e.preventDefault(); handleNavigate("contact"); }}
              style={{
                background: t.accent, color: "#FFF", padding: "8px 18px", borderRadius: 10,
                fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer",
                transition: "all 0.2s ease", border: "none", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={e => e.currentTarget.style.background = t.accentLight}
              onMouseLeave={e => e.currentTarget.style.background = t.accent}>
              On vous accompagne
            </a>
          </div>
        </div>
      </header>

      {/* ─── WEEK BANNER ─── */}
      {view !== "contact" && (
        <div style={{ background: t.bgSecondary, borderBottom: `1px solid ${t.borderLight}`, padding: "10px 24px", transition: "all 0.3s ease" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.green, display: "inline-block" }} />
              <span style={{ color: t.textSecondary, fontWeight: 500 }}>{WEEK_LABEL}</span>
              <span style={{ color: t.textTertiary }}>·</span>
              <span style={{ color: t.textTertiary }}>{OPPORTUNITIES.length} opportunités analysées</span>
            </div>
            <span style={{ color: t.textTertiary, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
              Prochain refresh : lundi
            </span>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px 64px" }}>
        <div key={view + (selectedOpp?.id || "")} style={{ animation: "fadeUp 0.35s ease" }}>
          {view === "home" && <HomeView opportunities={OPPORTUNITIES} onSelect={handleSelect} onNavigate={handleNavigate} dark={dark} />}
          {view === "top" && <TopView opportunities={OPPORTUNITIES} onSelect={handleSelect} onSwitchView={() => handleNavigate("categories")} dark={dark} />}
          {view === "categories" && <CategoryView opportunities={OPPORTUNITIES} onSelect={handleSelect} dark={dark} initialCat={initialCat} />}
          {view === "detail" && selectedOpp && <DetailView opportunity={selectedOpp} onBack={handleBack} dark={dark} />}
          {view === "contact" && <ContactView dark={dark} />}
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: `1px solid ${t.borderLight}`, padding: "20px 24px", transition: "all 0.3s ease" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: t.textTertiary, flexWrap: "wrap", gap: 8 }}>
          <span>Trendora — Radar d'opportunités business propulsé par IA</span>
          <span>Sources : Google Trends · Reddit · Product Hunt · Twitter/X</span>
        </div>
      </footer>
    </div>
  );
}
