import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN TOKENS (Dark Only) ───
const t = {
  bg: "#0A0A0A",
  bgAlt: "#111111",
  bgCard: "rgba(255,255,255,0.03)",
  bgCardHover: "rgba(255,255,255,0.06)",
  bgGlass: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  borderAccent: "rgba(245,158,11,0.3)",
  text: "#F5F5F7",
  textSecondary: "#A1A1A6",
  textTertiary: "#6E6E73",
  accent: "#F59E0B",
  accentLight: "#FBBF24",
  accentDim: "rgba(245,158,11,0.12)",
  accentGlow: "rgba(245,158,11,0.08)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,0.12)",
  blue: "#60A5FA",
  blueDim: "rgba(96,165,250,0.12)",
  yellow: "#FBBF24",
  yellowDim: "rgba(251,191,36,0.12)",
  red: "#F87171",
  shadow: "0 1px 2px rgba(0,0,0,0.4)",
  shadowHover: "0 8px 32px rgba(0,0,0,0.5)",
  glowAccent: "0 0 60px rgba(245,158,11,0.06), 0 0 120px rgba(245,158,11,0.03)",
};

// ─── DATA ───
const CATEGORIES = [
  { id: "all", label: "Toutes", icon: "grid" },
  { id: "tech", label: "Tech & SaaS", icon: "cpu" },
  { id: "sante", label: "Santé", icon: "heart" },
  { id: "immobilier", label: "Immobilier", icon: "building" },
  { id: "btp", label: "BTP", icon: "hammer" },
  { id: "marketing", label: "Marketing & Com", icon: "megaphone" },
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
    problem: "Quand un patient reçoit un diagnostic grave ou incertain, obtenir un second avis médical est long (6-12 semaines), coûteux et compliqué.",
    solution: "Une plateforme de second avis : le patient upload son dossier médical, l'IA pré-analyse et oriente vers le bon spécialiste, le médecin rend son avis sous 48-72h. Cible : patients, mutuelles. Pricing suggéré : 150-300€ par avis.",
    competitors: "Deuxième Avis existe mais le marché reste embryonnaire en France.",
    weekTrend: "stable",
  },
  {
    id: 28, name: "Outil de scoring locataire pour propriétaires", category: "immobilier", score: 78,
    scores: { demande: 19, croissance: 19, concurrence: 16, monetisation: 12, faisabilite: 12 },
    trend: "+125%", market: "€780M", type: "SaaS", mentions: 510, sources: "Reddit, Forums immo, Google Trends",
    problem: "Les propriétaires reçoivent des dizaines de dossiers locataires et doivent les trier manuellement. Vérifier la solvabilité, l'authenticité des documents, comparer les profils — tout est chronophage.",
    solution: "Un outil de scoring automatique : upload du dossier, vérification IA des documents, score de solvabilité, comparaison entre candidats, alertes fraude. Cible : propriétaires bailleurs et agences. Pricing suggéré : 5€ par dossier ou 29€/mois illimité.",
    competitors: "Dossierfacile.fr existe mais ne fait pas de scoring ni de détection de fraude.",
    weekTrend: "up",
  },
  {
    id: 29, name: "Simulateur investissement locatif IA", category: "immobilier", score: 72,
    scores: { demande: 18, croissance: 17, concurrence: 14, monetisation: 12, faisabilite: 11 },
    trend: "+95%", market: "€1.4B", type: "SaaS / App", mentions: 460, sources: "Reddit, YouTube, Google Trends",
    problem: "Les investisseurs immobiliers débutants ne savent pas évaluer la rentabilité réelle d'un bien.",
    solution: "Un simulateur avancé : estimation du rendement net-net, simulation fiscale (LMNP, Pinel, SCI), projection sur 10-20 ans. Cible : investisseurs particuliers. Pricing suggéré : freemium, 14.99€/mois premium.",
    competitors: "Quelques simulateurs basiques en ligne mais aucun avec IA et données marché intégrées.",
    weekTrend: "stable",
  },
  {
    id: 30, name: "Outil de visite virtuelle IA pour agences", category: "immobilier", score: 66,
    scores: { demande: 17, croissance: 16, concurrence: 13, monetisation: 11, faisabilite: 9 },
    trend: "+80%", market: "€620M", type: "SaaS", mentions: 350, sources: "Product Hunt, Google Trends, Twitter/X",
    problem: "Créer des visites virtuelles coûte cher (photographe + Matterport). Les petites agences n'ont pas le budget.",
    solution: "Un outil qui transforme de simples photos smartphone en visite virtuelle 3D grâce à l'IA. Cible : agences et mandataires. Pricing suggéré : 39€/mois.",
    competitors: "Matterport domine le haut de gamme. Très peu d'offre accessible smartphone-only avec IA.",
    weekTrend: "new",
  },
  {
    id: 31, name: "Plateforme de coliving intelligent", category: "immobilier", score: 59,
    scores: { demande: 15, croissance: 14, concurrence: 12, monetisation: 10, faisabilite: 8 },
    trend: "+65%", market: "€480M", type: "Marketplace", mentions: 280, sources: "Reddit, Facebook Groups, Twitter/X",
    problem: "Trouver des colocataires compatibles est un cauchemar. Les plateformes actuelles sont de simples petites annonces sans matching.",
    solution: "Une plateforme de matching par IA : profil détaillé, algorithme de compatibilité. Cible : étudiants et jeunes actifs. Commission : 1 mois de loyer.",
    competitors: "La Carte des Colocs est le leader mais sans matching intelligent.",
    weekTrend: "stable",
  },
  {
    id: 32, name: "Outil de gestion de copropriété simplifié", category: "immobilier", score: 55,
    scores: { demande: 14, croissance: 13, concurrence: 11, monetisation: 9, faisabilite: 8 },
    trend: "+45%", market: "€890M", type: "SaaS", mentions: 190, sources: "Forums immo, Google Trends",
    problem: "Les petites copropriétés ne trouvent pas de syndic professionnel ou paient trop cher.",
    solution: "Un outil de syndic assistant : gestion des charges, convocation d'AG, votes en ligne. Cible : syndics bénévoles, petites copropriétés. Pricing suggéré : 9€/mois par copropriété.",
    competitors: "Matera et Cotoit visent les copros moyennes à grandes.",
    weekTrend: "stable",
  },
  {
    id: 33, name: "Outil de rédaction d'annonces immo IA", category: "immobilier", score: 70,
    scores: { demande: 17, croissance: 17, concurrence: 14, monetisation: 11, faisabilite: 11 },
    trend: "+90%", market: "€320M", type: "SaaS", mentions: 350, sources: "Twitter/X, Forums immo, Google Trends",
    problem: "Les agents rédigent des dizaines d'annonces par mois avec les mêmes formules creuses.",
    solution: "Un outil qui génère des annonces uniques et vendeuses. Cible : agents et mandataires. Pricing suggéré : 25€/mois.",
    competitors: "Rien de spécialisé immobilier avec les bonnes données métier.",
    weekTrend: "new",
  },
  {
    id: 34, name: "SaaS gestion de parc immobilier pour SCI", category: "immobilier", score: 58,
    scores: { demande: 15, croissance: 14, concurrence: 12, monetisation: 9, faisabilite: 8 },
    trend: "+52%", market: "€340M", type: "SaaS", mentions: 230, sources: "Forums immo, Reddit",
    problem: "Les SCI familiales n'ont aucun outil adapté.",
    solution: "Un outil dédié SCI : comptabilité simplifiée, suivi de rentabilité par bien. Cible : gérants de SCI. Pricing suggéré : 19€/mois par SCI.",
    competitors: "Les logiciels comptables classiques ne gèrent pas les spécificités SCI.",
    weekTrend: "stable",
  },
  {
    id: 35, name: "App de suivi de chantier par photo IA", category: "btp", score: 80,
    scores: { demande: 20, croissance: 20, concurrence: 16, monetisation: 12, faisabilite: 12 },
    trend: "+150%", market: "€1.8B", type: "App", mentions: 680, sources: "Forums BTP, Reddit, Google Trends",
    problem: "Le suivi de chantier se fait par WhatsApp et photos en vrac.",
    solution: "Une app mobile ultra simple : photo → l'IA catégorise, géolocalise et horodate. Cible : artisans et chefs de chantier TPE. Pricing suggéré : 19€/mois.",
    competitors: "Finalcad et BatiScript visent les grands groupes. Quasi rien pour les TPE.",
    weekTrend: "up",
  },
  {
    id: 36, name: "Marketplace matériaux BTP entre pros", category: "btp", score: 69,
    scores: { demande: 17, croissance: 17, concurrence: 14, monetisation: 11, faisabilite: 10 },
    trend: "+80%", market: "€2.1B", type: "Marketplace", mentions: 390, sources: "Forums BTP, Reddit",
    problem: "Les artisans achètent chez 2-3 fournisseurs habituels sans comparer.",
    solution: "Une marketplace B2B : comparateur de prix fournisseurs locaux, revente de surplus entre artisans. Commission : 5-8% par transaction.",
    competitors: "StockPro fait les surplus mais pas de plateforme complète prix + surplus.",
    weekTrend: "stable",
  },
  {
    id: 37, name: "Outil de conformité RE2020 automatisé", category: "btp", score: 63,
    scores: { demande: 16, croissance: 16, concurrence: 13, monetisation: 10, faisabilite: 8 },
    trend: "+70%", market: "€560M", type: "SaaS", mentions: 310, sources: "Forums BTP, LinkedIn, Google Trends",
    problem: "La RE2020 impose de nouvelles normes thermiques et carbone.",
    solution: "Un outil simplifié : caractéristiques du projet → calcul conformité. Cible : constructeurs, architectes. Pricing suggéré : 79€/mois.",
    competitors: "Pleiades, ClimaWin sont complexes et chers. Pas d'offre simplifiée IA.",
    weekTrend: "new",
  },
  {
    id: 38, name: "Plateforme mise en relation chantier/artisan", category: "btp", score: 56,
    scores: { demande: 15, croissance: 13, concurrence: 11, monetisation: 9, faisabilite: 8 },
    trend: "+45%", market: "€1.3B", type: "Marketplace", mentions: 260, sources: "Google Trends, Forums BTP",
    problem: "Les particuliers galèrent à trouver des artisans fiables.",
    solution: "Une plateforme avec meilleur matching par IA. Commission : 15€ par mise en relation.",
    competitors: "Marché concurrentiel mais la qualité du matching reste le point faible de tous.",
    weekTrend: "stable",
  },
  {
    id: 39, name: "Logiciel planification de chantier IA", category: "btp", score: 52,
    scores: { demande: 13, croissance: 13, concurrence: 11, monetisation: 8, faisabilite: 7 },
    trend: "+40%", market: "€720M", type: "SaaS", mentions: 180, sources: "Forums BTP, LinkedIn",
    problem: "La planification pour les petites entreprises se fait sur Excel.",
    solution: "Un planning visuel intelligent : Gantt simplifié, gestion des dépendances. Cible : chefs de chantier TPE/PME. Pricing suggéré : 39€/mois.",
    competitors: "MS Project est surdimensionné. Quelques apps existent mais sans IA.",
    weekTrend: "stable",
  },
  {
    id: 40, name: "Plateforme formation IA pour artisans", category: "btp", score: 48,
    scores: { demande: 12, croissance: 12, concurrence: 10, monetisation: 8, faisabilite: 6 },
    trend: "+35%", market: "€380M", type: "Plateforme", mentions: 150, sources: "Forums BTP, YouTube",
    problem: "Les artisans doivent se former continuellement mais les formations classiques sont chères.",
    solution: "Micro-formations vidéo de 10-15 minutes, certifiantes. Cible : artisans en activité. Pricing suggéré : 19€/mois.",
    competitors: "Peu de formation en ligne spécifique BTP.",
    weekTrend: "stable",
  },
  {
    id: 41, name: "Outil calcul bilan carbone chantier", category: "btp", score: 51,
    scores: { demande: 13, croissance: 12, concurrence: 11, monetisation: 8, faisabilite: 7 },
    trend: "+38%", market: "€290M", type: "SaaS", mentions: 170, sources: "LinkedIn, Forums BTP",
    problem: "La réglementation pousse au calcul de l'empreinte carbone mais les outils sont complexes.",
    solution: "Un outil simplifié : matériaux et quantités → empreinte calculée. Cible : PME BTP. Pricing suggéré : 49€/mois.",
    competitors: "Elodie, Vizcab sont experts. Rien de simplifié pour TPE/PME.",
    weekTrend: "stable",
  },
  {
    id: 42, name: "Générateur de landing pages IA", category: "marketing", score: 80,
    scores: { demande: 20, croissance: 19, concurrence: 16, monetisation: 13, faisabilite: 12 },
    trend: "+140%", market: "€1.6B", type: "SaaS", mentions: 720, sources: "Product Hunt, Reddit, Twitter/X",
    problem: "Créer une landing page qui convertit demande des compétences en copywriting, design et technique.",
    solution: "L'utilisateur décrit son offre → l'IA génère une landing page complète. Cible : freelances, solopreneurs, PME. Pricing suggéré : 19€/mois.",
    competitors: "Carrd, Unbounce existent mais aucun ne fait la stratégie + le copy par IA.",
    weekTrend: "up",
  },
  {
    id: 43, name: "Outil d'analyse de concurrents par IA", category: "marketing", score: 76,
    scores: { demande: 19, croissance: 18, concurrence: 15, monetisation: 12, faisabilite: 12 },
    trend: "+105%", market: "€920M", type: "SaaS", mentions: 480, sources: "Reddit, Indie Hackers, Product Hunt",
    problem: "Surveiller ses concurrents demande de checker manuellement leurs sites, réseaux sociaux, prix.",
    solution: "Un radar concurrentiel IA : suivi automatique des changements, analyse des stratégies. Cible : fondateurs SaaS. Pricing suggéré : 39€/mois.",
    competitors: "Crayon, Kompyte sont orientés enterprise à +200€/mois.",
    weekTrend: "new",
  },
  {
    id: 44, name: "Plateforme de création de newsletters IA", category: "marketing", score: 73,
    scores: { demande: 18, croissance: 18, concurrence: 14, monetisation: 12, faisabilite: 11 },
    trend: "+115%", market: "€780M", type: "SaaS", mentions: 520, sources: "Twitter/X, Product Hunt, Reddit",
    problem: "Lancer et maintenir une newsletter demande énormément de travail.",
    solution: "Suggestion de sujets tendance, rédaction assistée avec le ton de l'auteur. Cible : créateurs, solopreneurs. Pricing suggéré : 15€/mois.",
    competitors: "Substack et Beehiiv dominent la distribution. L'angle création IA est le différenciateur.",
    weekTrend: "up",
  },
  {
    id: 45, name: "Outil de repurposing de contenu IA", category: "marketing", score: 71,
    scores: { demande: 18, croissance: 17, concurrence: 14, monetisation: 11, faisabilite: 11 },
    trend: "+100%", market: "€620M", type: "SaaS", mentions: 440, sources: "Twitter/X, Reddit, YouTube",
    problem: "Les créateurs passent des heures sur un contenu long puis n'ont plus le temps de le décliner.",
    solution: "Un outil qui prend un contenu source et génère des déclinaisons pour chaque plateforme. Cible : créateurs, marketeurs. Pricing suggéré : 25€/mois.",
    competitors: "Repurpose.io fait de la vidéo. Aucun ne fait tout avec IA.",
    weekTrend: "up",
  },
  {
    id: 46, name: "Outil de social proof automatisé", category: "marketing", score: 67,
    scores: { demande: 16, croissance: 16, concurrence: 14, monetisation: 11, faisabilite: 10 },
    trend: "+75%", market: "€340M", type: "SaaS", mentions: 310, sources: "Indie Hackers, Product Hunt, Twitter/X",
    problem: "Collecter et afficher des témoignages clients est manuel.",
    solution: "Collecte automatisée, formulaire vidéo simplifié. Cible : SaaS, freelances, e-commerce. Pricing suggéré : 25€/mois.",
    competitors: "Senja, Testimonial.to émergent mais marché fragmenté.",
    weekTrend: "stable",
  },
  {
    id: 47, name: "Générateur de stratégie SEO par IA", category: "marketing", score: 69,
    scores: { demande: 17, croissance: 17, concurrence: 13, monetisation: 11, faisabilite: 11 },
    trend: "+88%", market: "€1.2B", type: "SaaS", mentions: 380, sources: "Reddit, Twitter/X, Product Hunt",
    problem: "Les freelances et PME savent que le SEO est important mais ne savent pas par où commencer.",
    solution: "Analyse du site → opportunités de mots-clés → plan de contenu SEO priorisé. Cible : freelances, PME. Pricing suggéré : 29€/mois.",
    competitors: "SEMrush et Ahrefs dominent les données. L'angle stratégie actionnable IA est libre.",
    weekTrend: "new",
  },
  {
    id: 48, name: "CRM gestion d'influenceurs pour PME", category: "marketing", score: 62,
    scores: { demande: 15, croissance: 15, concurrence: 13, monetisation: 10, faisabilite: 9 },
    trend: "+65%", market: "€480M", type: "SaaS", mentions: 280, sources: "Twitter/X, LinkedIn, Reddit",
    problem: "Les PME veulent travailler avec des micro-influenceurs mais ne savent pas comment.",
    solution: "Un CRM simplifié : recherche d'influenceurs par niche et localisation. Cible : PME et e-commerçants. Pricing suggéré : 39€/mois.",
    competitors: "Kolsquare, Upfluence visent les grands comptes.",
    weekTrend: "stable",
  },
  {
    id: 49, name: "Outil gestion des avis Google pour PME", category: "marketing", score: 66,
    scores: { demande: 17, croissance: 15, concurrence: 13, monetisation: 11, faisabilite: 10 },
    trend: "+72%", market: "€460M", type: "SaaS", mentions: 290, sources: "Google Trends, Reddit, Forums PME",
    problem: "Les avis Google sont le premier critère de choix pour les commerces locaux.",
    solution: "Demande automatisée d'avis après chaque prestation, réponses générées par IA. Cible : commerces, restaurants. Pricing suggéré : 29€/mois.",
    competitors: "Partoo, Localranker existent mais marché fragmenté.",
    weekTrend: "up",
  },
  {
    id: 50, name: "Bot LinkedIn lead gen pour agences", category: "marketing", score: 64,
    scores: { demande: 16, croissance: 15, concurrence: 13, monetisation: 11, faisabilite: 9 },
    trend: "+70%", market: "€560M", type: "SaaS", mentions: 340, sources: "Reddit, Twitter/X, LinkedIn",
    problem: "Les agences prospectent sur LinkedIn manuellement.",
    solution: "Identification des prospects par IA, messages hyper-personnalisés. Cible : agences marketing. Pricing suggéré : 59€/mois.",
    competitors: "Waalaxy, Phantombuster existent. La personnalisation IA profonde est le différenciateur.",
    weekTrend: "stable",
  },
  {
    id: 51, name: "Plateforme micro-learning marketing", category: "marketing", score: 54,
    scores: { demande: 14, croissance: 13, concurrence: 11, monetisation: 9, faisabilite: 7 },
    trend: "+48%", market: "€420M", type: "Plateforme", mentions: 210, sources: "Reddit, Twitter/X",
    problem: "Les freelances doivent constamment apprendre de nouvelles compétences marketing.",
    solution: "Micro-formations de 10 minutes. Cible : freelances marketing. Pricing suggéré : 15€/mois.",
    competitors: "Udemy et Coursera sont généralistes. Le micro-learning marketing spécialisé est libre.",
    weekTrend: "stable",
  },
];

const WEEK_LABEL = "Semaine du 10 mars 2026";

const SCORE_LABELS = {
  demande: { label: "Demande", max: 25, desc: "Volume de mentions et recherches détectées" },
  croissance: { label: "Croissance", max: 25, desc: "Vitesse d'évolution de la tendance" },
  concurrence: { label: "Concurrence", max: 20, desc: "Moins de concurrence = score plus élevé" },
  monetisation: { label: "Monétisation", max: 15, desc: "Potentiel de revenus identifié" },
  faisabilite: { label: "Faisabilité", max: 15, desc: "Facilité à lancer un MVP" },
};

// ─── SVG ICONS ───
const Icons = {
  grid: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  cpu: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>,
  heart: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  building: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/></svg>,
  hammer: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 010-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 00-3.94-1.64H9l.92.82A6.18 6.18 0 0112 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>,
  megaphone: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg>,
  arrowRight: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  arrowLeft: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
  sparkle: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill={props.color||"currentColor"}><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
  radar: (props) => <svg width={props.size||20} height={props.size||20} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/></svg>,
  trendUp: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  check: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  calendar: (props) => <svg width={props.size||16} height={props.size||16} viewBox="0 0 24 24" fill="none" stroke={props.color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
};

const CategoryIcon = ({ id, size = 20, color }) => {
  const cat = CATEGORIES.find(c => c.id === id);
  const IconComp = Icons[cat?.icon] || Icons.grid;
  return <IconComp size={size} color={color || t.accent} />;
};

// ─── HOOKS ───
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(docHeight > 0 ? scrollY / docHeight : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── STELLAR ORB ───
function StellarOrb({ progress }) {
  // Moves from left (-20%) to right (120%) as user scrolls
  const x = -20 + progress * 140;
  // Slight vertical wave using sine
  const yWave = Math.sin(progress * Math.PI * 2) * 8;
  // Subtle size pulse
  const scale = 1 + Math.sin(progress * Math.PI) * 0.15;
  // Opacity: fade in then fade out at extremes
  const opacity = 0.12 + Math.sin(progress * Math.PI) * 0.08;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, overflow: "hidden",
    }}>
      {/* Main orb */}
      <div style={{
        position: "absolute",
        top: `calc(18% + ${yWave}px)`,
        left: `${x}%`,
        width: 600, height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(245,158,11,${opacity}) 0%, rgba(245,158,11,${opacity * 0.4}) 30%, rgba(217,119,6,${opacity * 0.15}) 55%, transparent 75%)`,
        filter: `blur(80px)`,
        transform: `scale(${scale})`,
        transition: "left 0.15s linear, top 0.15s linear, transform 0.3s ease-out",
        willChange: "left, top, transform",
      }} />
      {/* Secondary smaller orb — trailing, cooler color */}
      <div style={{
        position: "absolute",
        top: `calc(30% + ${-yWave * 0.6}px)`,
        left: `${x - 15}%`,
        width: 300, height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(96,165,250,${opacity * 0.5}) 0%, rgba(96,165,250,${opacity * 0.15}) 40%, transparent 70%)`,
        filter: "blur(60px)",
        transform: `scale(${scale * 0.8})`,
        transition: "left 0.25s linear, top 0.25s linear",
        willChange: "left, top",
      }} />
    </div>
  );
}

// ─── COMPONENTS ───

function ScoreRing({ score, size = 52, strokeWidth = 3.5 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? t.green : score >= 70 ? t.blue : score >= 55 ? t.yellow : t.red;
  const glow = score >= 85 ? `0 0 12px ${t.green}40` : score >= 70 ? `0 0 12px ${t.blue}30` : "none";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0, filter: `drop-shadow(${glow})` }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.border} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 700, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>
        {score}
      </div>
    </div>
  );
}

function TrendBadge({ value }) {
  const num = parseInt(value);
  const color = num >= 200 ? t.green : num >= 100 ? t.blue : t.textSecondary;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color, fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
      <Icons.trendUp size={12} color={color} />
      {value}
    </span>
  );
}

function WeekBadge({ type }) {
  const config = {
    new: { label: "Nouveau", bg: t.accentDim, color: t.accent, border: t.borderAccent },
    up: { label: "En hausse", bg: t.greenDim, color: t.green, border: `rgba(52,211,153,0.2)` },
    stable: { label: "Stable", bg: "rgba(255,255,255,0.04)", color: t.textTertiary, border: t.border },
  };
  const c = config[type] || config.stable;
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.02em" }}>
      {c.label}
    </span>
  );
}

function Tag({ children, color }) {
  const c = color || t.textTertiary;
  return (
    <span style={{ color: c, background: `${c}10`, border: `1px solid ${c}18`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
      {children}
    </span>
  );
}

function ScoreBreakdown({ scores }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {Object.entries(SCORE_LABELS).map(([key, meta]) => {
        const val = scores[key];
        const pct = (val / meta.max) * 100;
        const color = pct >= 85 ? t.green : pct >= 65 ? t.blue : t.yellow;
        return (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: t.textSecondary, fontWeight: 500 }}>{meta.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>{val}/{meta.max}</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: `linear-gradient(90deg, ${color}80, ${color})`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GlassCard({ children, style, onClick, hover = true, glow = false }) {
  const baseStyle = {
    background: t.bgCard,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${t.border}`,
    borderRadius: 16,
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    ...(glow ? { boxShadow: t.glowAccent } : { boxShadow: t.shadow }),
    ...(onClick ? { cursor: "pointer" } : {}),
    ...style,
  };
  return (
    <div
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={hover && onClick ? (e) => {
        e.currentTarget.style.borderColor = t.borderHover;
        e.currentTarget.style.background = t.bgCardHover;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = glow ? `0 0 80px rgba(245,158,11,0.1), ${t.shadowHover}` : t.shadowHover;
      } : undefined}
      onMouseLeave={hover && onClick ? (e) => {
        e.currentTarget.style.borderColor = t.border;
        e.currentTarget.style.background = t.bgCard;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = glow ? t.glowAccent : t.shadow;
      } : undefined}
    >
      {children}
    </div>
  );
}

function RevealSection({ children, style, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function OpportunityRow({ opp, index, onSelect, showRank = false }) {
  return (
    <GlassCard onClick={() => onSelect(opp)} style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
      {showRank && (
        <div style={{ fontSize: 18, fontWeight: 800, color: t.textTertiary, width: 28, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", opacity: 0.4 }}>{index}</div>
      )}
      <ScoreRing score={opp.score} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 6, lineHeight: 1.4 }}>{opp.name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <Tag>{CATEGORIES.find(c => c.id === opp.category)?.label}</Tag>
          <Tag>{opp.type}</Tag>
          <WeekBadge type={opp.weekTrend} />
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <TrendBadge value={opp.trend} />
        <div style={{ fontSize: 12, color: t.textTertiary, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{opp.market}</div>
      </div>
      <div style={{ color: t.textTertiary, flexShrink: 0, marginLeft: 4 }}>
        <Icons.arrowRight size={16} color={t.textTertiary} />
      </div>
    </GlassCard>
  );
}

// ─── VIEWS ───

function HomeView({ opportunities, onSelect, onNavigate }) {
  const sorted = [...opportunities].sort((a, b) => b.score - a.score);
  const top5 = sorted.slice(0, 5);
  const newOpps = opportunities.filter(o => o.weekTrend === "new");
  const risingOpps = opportunities.filter(o => o.weekTrend === "up");
  const avgScore = Math.round(opportunities.reduce((a, b) => a + b.score, 0) / opportunities.length);
  const totalMentions = opportunities.reduce((a, b) => a + b.mentions, 0);
  const catCounts = CATEGORIES.filter(c => c.id !== "all").map(c => ({
    ...c,
    count: opportunities.filter(o => o.category === c.id).length,
    avgScore: Math.round(opportunities.filter(o => o.category === c.id).reduce((a, b) => a + b.score, 0) / opportunities.filter(o => o.category === c.id).length),
    best: [...opportunities.filter(o => o.category === c.id)].sort((a, b) => b.score - a.score)[0],
  }));

  return (
    <div>
      {/* ─── HERO ─── */}
      <div style={{ position: "relative", textAlign: "center", padding: "80px 20px 100px", overflow: "hidden" }}>
        {/* Aurora Background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 30% 50%, rgba(245,158,11,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 70% 50%, rgba(96,165,250,0.04) 0%, transparent 50%)
          `,
        }} />
        {/* Grain */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.03, pointerEvents: "none" }}>
          <svg width="100%" height="100%"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain)"/></svg>
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 800, margin: "0 auto" }}>
          <RevealSection>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: t.accentDim, border: `1px solid ${t.borderAccent}`, borderRadius: 24, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: t.accent, fontWeight: 600 }}>
              <Icons.sparkle size={14} color={t.accent} />
              Propulsé par l'intelligence artificielle
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: t.text, margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em", fontFamily: "'Inter', system-ui, sans-serif" }}>
              Votre radar<br />
              <span style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                d'opportunités business
              </span>
            </h1>
          </RevealSection>

          <RevealSection delay={0.2}>
            <p style={{ color: t.textSecondary, fontSize: "clamp(16px, 2vw, 20px)", margin: "0 auto 40px", maxWidth: 560, lineHeight: 1.6, fontWeight: 400 }}>
              Chaque semaine, notre IA analyse des milliers de signaux pour détecter les meilleures opportunités de marché.
            </p>
          </RevealSection>

          <RevealSection delay={0.3}>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => onNavigate("top")} style={{
                background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000", padding: "14px 32px", borderRadius: 12,
                fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.3s ease", boxShadow: "0 0 30px rgba(245,158,11,0.2)",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(245,158,11,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Explorer le Top 10
              </button>
              <button onClick={() => onNavigate("contact")} style={{
                background: "transparent", color: t.text, padding: "14px 32px", borderRadius: 12,
                fontSize: 15, fontWeight: 600, border: `1px solid ${t.border}`, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.3s ease", backdropFilter: "blur(10px)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.borderHover; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = "transparent"; }}>
                Prendre rendez-vous
              </button>
            </div>
          </RevealSection>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <RevealSection style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {[
            { label: "Opportunités", value: opportunities.length, color: t.accent },
            { label: "Score moyen", value: avgScore, color: t.blue },
            { label: "Nouvelles", value: newOpps.length, sub: "cette semaine", color: t.green },
            { label: "En hausse", value: risingOpps.length, sub: "cette semaine", color: t.yellow },
            { label: "Mentions", value: totalMentions.toLocaleString(), color: t.textSecondary },
            { label: "Secteurs", value: catCounts.length, color: t.accent },
          ].map((s, i) => (
            <GlassCard key={i} style={{ padding: "18px 20px" }} hover={false}>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 4 }}>{s.sub}</div>}
            </GlassCard>
          ))}
        </div>
      </RevealSection>

      {/* ─── HOW IT WORKS ─── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
        <RevealSection>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: t.text, margin: 0, letterSpacing: "-0.02em" }}>Comment ça marche</h2>
            <p style={{ color: t.textTertiary, fontSize: 16, margin: "12px 0 0", lineHeight: 1.6 }}>3 étapes, chaque semaine, automatiquement</p>
          </div>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: <Icons.radar size={28} color={t.accent} />, step: "01", title: "Analyse IA", desc: "Notre IA scanne des milliers de sources : Reddit, Google Trends, Product Hunt, forums spécialisés et réseaux sociaux." },
            { icon: <Icons.sparkle size={28} color={t.accent} />, step: "02", title: "Scoring multi-critères", desc: "Chaque opportunité est évaluée sur 5 axes : demande, croissance, concurrence, monétisation et faisabilité." },
            { icon: <Icons.trendUp size={28} color={t.accent} />, step: "03", title: "Top classement", desc: "Les meilleures opportunités sont classées et mises à jour chaque lundi avec les données fraîches." },
          ].map((item, i) => (
            <RevealSection key={i} delay={i * 0.15}>
              <GlassCard style={{ padding: 28, height: "100%" }} hover={false} glow={i === 0}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: t.accentDim, border: `1px solid ${t.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 40, fontWeight: 900, color: "rgba(255,255,255,0.04)", fontFamily: "'JetBrains Mono', monospace" }}>{item.step}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: "0 0 10px" }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </GlassCard>
            </RevealSection>
          ))}
        </div>
      </div>

      {/* ─── ALERT BANNER ─── */}
      {newOpps.length > 0 && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
          <RevealSection>
            <GlassCard onClick={() => onSelect(newOpps.sort((a,b) => b.score - a.score)[0])} glow style={{ padding: "22px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.accent, display: "inline-block", animation: "pulse 2s ease-in-out infinite", boxShadow: `0 0 12px ${t.accent}60` }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.accent }}>Alerte opportunité</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 6 }}>
                {newOpps.sort((a,b) => b.score - a.score)[0].name}
              </div>
              <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.5, display: "flex", alignItems: "center", gap: 8 }}>
                Score {newOpps.sort((a,b) => b.score - a.score)[0].score}/100 · {newOpps.sort((a,b) => b.score - a.score)[0].trend} de croissance
                <Icons.arrowRight size={14} color={t.accent} />
              </div>
            </GlassCard>
          </RevealSection>
        </div>
      )}

      {/* ─── TOP 5 ─── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
        <RevealSection>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0 }}>Top 5 de la semaine</h2>
            <button onClick={() => onNavigate("top")} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
              Voir le Top 10 <Icons.arrowRight size={14} color={t.accent} />
            </button>
          </div>
        </RevealSection>
        <div style={{ display: "grid", gap: 10 }}>
          {top5.map((opp, i) => (
            <RevealSection key={opp.id} delay={i * 0.05}>
              <OpportunityRow opp={opp} index={i + 1} onSelect={onSelect} showRank />
            </RevealSection>
          ))}
        </div>
      </div>

      {/* ─── SECTORS ─── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
        <RevealSection>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0 }}>Par secteur</h2>
            <button onClick={() => onNavigate("categories")} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
              Toutes les catégories <Icons.arrowRight size={14} color={t.accent} />
            </button>
          </div>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {catCounts.map((cat, i) => (
            <RevealSection key={cat.id} delay={i * 0.08}>
              <GlassCard onClick={() => onNavigate("categories", cat.id)} style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: t.accentDim, border: `1px solid ${t.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CategoryIcon id={cat.id} size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{cat.label}</div>
                      <div style={{ fontSize: 12, color: t.textTertiary }}>{cat.count} opportunités</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Score moy.</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: t.blue, fontFamily: "'JetBrains Mono', monospace" }}>{cat.avgScore}</div>
                  </div>
                </div>
                {cat.best && (
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px", border: `1px solid ${t.border}` }}>
                    <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>Meilleure opportunité</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.4, marginBottom: 6 }}>{cat.best.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: t.green, fontFamily: "'JetBrains Mono', monospace" }}>{cat.best.score}/100</span>
                      <TrendBadge value={cat.best.trend} />
                    </div>
                  </div>
                )}
              </GlassCard>
            </RevealSection>
          ))}
        </div>
      </div>

      {/* ─── NEW THIS WEEK ─── */}
      {newOpps.length > 0 && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
          <RevealSection>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
              Nouvelles cette semaine
              <span style={{ background: t.accentDim, color: t.accent, border: `1px solid ${t.borderAccent}`, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{newOpps.length}</span>
            </h2>
          </RevealSection>
          <div style={{ display: "grid", gap: 10 }}>
            {newOpps.sort((a, b) => b.score - a.score).map((opp, i) => (
              <RevealSection key={opp.id} delay={i * 0.05}>
                <OpportunityRow opp={opp} onSelect={onSelect} />
              </RevealSection>
            ))}
          </div>
        </div>
      )}

      {/* ─── RISING ─── */}
      {risingOpps.length > 0 && (
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 48px" }}>
          <RevealSection>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
              En hausse
              <span style={{ background: t.greenDim, color: t.green, border: `1px solid rgba(52,211,153,0.2)`, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{risingOpps.length}</span>
            </h2>
          </RevealSection>
          <div style={{ display: "grid", gap: 10 }}>
            {risingOpps.sort((a, b) => b.score - a.score).map((opp, i) => (
              <RevealSection key={opp.id} delay={i * 0.05}>
                <OpportunityRow opp={opp} onSelect={onSelect} />
              </RevealSection>
            ))}
          </div>
        </div>
      )}

      {/* ─── CTA ─── */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
        <RevealSection>
          <div style={{
            position: "relative", borderRadius: 20, padding: "48px 32px", textAlign: "center", overflow: "hidden",
            border: `1px solid ${t.borderAccent}`,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: t.text, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Une opportunité vous parle ?</h2>
              <p style={{ color: t.textSecondary, fontSize: 16, margin: "0 auto 28px", maxWidth: 480, lineHeight: 1.6 }}>
                On vous accompagne de l'idée au lancement — stratégie, MVP, acquisition clients.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <button onClick={() => onNavigate("top")} style={{
                  background: "transparent", color: t.text, padding: "14px 28px", borderRadius: 12,
                  fontSize: 14, fontWeight: 600, border: `1px solid ${t.border}`, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.borderHover; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; }}>
                  Explorer le Top 10
                </button>
                <button onClick={() => onNavigate("contact")} style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000", padding: "14px 28px", borderRadius: 12,
                  fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.3s ease", boxShadow: "0 0 30px rgba(245,158,11,0.2)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(245,158,11,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  Prendre rendez-vous
                </button>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

function TopView({ opportunities, onSelect }) {
  const sorted = [...opportunities].sort((a, b) => b.score - a.score);
  const top10 = sorted.slice(0, 10);
  const rest = sorted.slice(10);
  const [showAll, setShowAll] = useState(false);
  const avgScore = Math.round(opportunities.reduce((a, b) => a + b.score, 0) / opportunities.length);
  const newCount = opportunities.filter(o => o.weekTrend === "new").length;

  return (
    <div>
      <RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Opportunités", value: opportunities.length, color: t.accent },
            { label: "Score moyen", value: avgScore + "/100", color: t.blue },
            { label: "Nouvelles", value: newCount, color: t.green },
            { label: "Catégories", value: CATEGORIES.length - 1, color: t.textSecondary },
          ].map((s, i) => (
            <GlassCard key={i} style={{ padding: "16px 20px" }} hover={false}>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            </GlassCard>
          ))}
        </div>
      </RevealSection>

      <RevealSection>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: 0, letterSpacing: "-0.02em" }}>Top 10 de la semaine</h2>
          <p style={{ color: t.textTertiary, fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>
            Les opportunités business les mieux scorées — analyse IA mise à jour chaque lundi.
          </p>
        </div>
      </RevealSection>

      <div style={{ display: "grid", gap: 10 }}>
        {top10.map((opp, i) => (
          <RevealSection key={opp.id} delay={i * 0.04}>
            <OpportunityRow opp={opp} index={i + 1} onSelect={onSelect} showRank />
          </RevealSection>
        ))}
      </div>

      {rest.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <RevealSection>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0 }}>Toutes les opportunités</h2>
                <p style={{ color: t.textTertiary, fontSize: 13, margin: "6px 0 0" }}>{rest.length} opportunités supplémentaires</p>
              </div>
              <button onClick={() => setShowAll(!showAll)} style={{
                background: t.accentDim, color: t.accent, border: `1px solid ${t.borderAccent}`, borderRadius: 10,
                padding: "10px 22px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s ease",
              }}>
                {showAll ? "Réduire" : `Voir les ${rest.length}`}
              </button>
            </div>
          </RevealSection>

          {showAll && (
            <div style={{ display: "grid", gap: 8 }}>
              {rest.map((opp, i) => (
                <RevealSection key={opp.id} delay={Math.min(i * 0.02, 0.4)}>
                  <OpportunityRow opp={opp} index={i + 11} onSelect={onSelect} showRank />
                </RevealSection>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryView({ opportunities, onSelect, initialCat }) {
  const [activeCat, setActiveCat] = useState(initialCat || "all");
  const filtered = activeCat === "all" ? opportunities : opportunities.filter(o => o.category === activeCat);
  const sorted = [...filtered].sort((a, b) => b.score - a.score);

  return (
    <div>
      <RevealSection>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: 0, letterSpacing: "-0.02em" }}>Catégories</h2>
          <p style={{ color: t.textTertiary, fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>Explore les opportunités par secteur d'activité.</p>
        </div>
      </RevealSection>

      <RevealSection>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map(cat => {
            const active = activeCat === cat.id;
            const count = cat.id === "all" ? opportunities.length : opportunities.filter(o => o.category === cat.id).length;
            return (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
                background: active ? t.accentDim : t.bgCard,
                color: active ? t.accent : t.textSecondary,
                border: `1px solid ${active ? t.borderAccent : t.border}`,
                borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit",
              }}>
                <CategoryIcon id={cat.id} size={16} color={active ? t.accent : t.textTertiary} />
                {cat.label}
                <span style={{ background: active ? `${t.accent}20` : "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </RevealSection>

      {activeCat !== "all" && (
        <RevealSection>
          <GlassCard style={{ padding: 22, marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }} hover={false}>
            <div>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Opportunités</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>{sorted.length}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Score moyen</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.accent, fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(sorted.reduce((a, b) => a + b.score, 0) / sorted.length)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: t.textTertiary, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Meilleur score</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.green, fontFamily: "'JetBrains Mono', monospace" }}>{sorted[0]?.score || "—"}</div>
            </div>
          </GlassCard>
        </RevealSection>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {sorted.map((opp, i) => (
          <RevealSection key={opp.id} delay={Math.min(i * 0.03, 0.4)}>
            <OpportunityRow opp={opp} onSelect={onSelect} />
          </RevealSection>
        ))}
      </div>
    </div>
  );
}

function DetailView({ opportunity: opp, onBack }) {
  const cat = CATEGORIES.find(c => c.id === opp.category);

  return (
    <div>
      <RevealSection>
        <button onClick={onBack} style={{ background: "none", border: "none", color: t.accent, cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0, marginBottom: 24, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.arrowLeft size={16} color={t.accent} />
          Retour
        </button>
      </RevealSection>

      <RevealSection>
        <GlassCard style={{ padding: 32, marginBottom: 20 }} hover={false} glow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
            <ScoreRing score={opp.score} size={80} strokeWidth={4.5} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <Tag color={t.accent}>{cat?.label}</Tag>
                <Tag>{opp.type}</Tag>
                <WeekBadge type={opp.weekTrend} />
              </div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: t.text, margin: "0 0 12px", lineHeight: 1.3, letterSpacing: "-0.02em" }}>{opp.name}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontSize: 14 }}>
                <span style={{ color: t.textSecondary }}>Marché : <strong style={{ color: t.text }}>{opp.market}</strong></span>
                <span style={{ color: t.textSecondary }}>Tendance : <TrendBadge value={opp.trend} /></span>
                <span style={{ color: t.textSecondary }}>Mentions : <strong style={{ color: t.text }}>{opp.mentions.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
        </GlassCard>
      </RevealSection>

      <RevealSection delay={0.1}>
        <GlassCard style={{ padding: 28, marginBottom: 20 }} hover={false}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 18px" }}>Détail du score</h3>
          <ScoreBreakdown scores={opp.scores} />
          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: `1px solid ${t.border}`, fontSize: 13, color: t.textTertiary, lineHeight: 1.6 }}>
            Score calculé sur 5 critères : demande marché (25pts), croissance (25pts), concurrence (20pts), monétisation (15pts) et faisabilité (15pts).
          </div>
        </GlassCard>
      </RevealSection>

      <RevealSection delay={0.15}>
        <GlassCard style={{ padding: 28, marginBottom: 20 }} hover={false}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 14px" }}>Problématique identifiée</h3>
          <p style={{ color: t.textSecondary, fontSize: 15, lineHeight: 1.8, margin: 0 }}>{opp.problem}</p>
          <div style={{ marginTop: 14, fontSize: 12, color: t.textTertiary }}>Sources : {opp.sources}</div>
        </GlassCard>
      </RevealSection>

      <RevealSection delay={0.2}>
        <div style={{
          background: t.accentDim, border: `1px solid ${t.borderAccent}`, borderRadius: 16, padding: 28, marginBottom: 20,
          boxShadow: "0 0 40px rgba(245,158,11,0.05)",
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.accent, margin: "0 0 14px" }}>Solution proposée</h3>
          <p style={{ color: t.text, fontSize: 15, lineHeight: 1.8, margin: 0 }}>{opp.solution}</p>
        </div>
      </RevealSection>

      <RevealSection delay={0.25}>
        <GlassCard style={{ padding: 28, marginBottom: 28 }} hover={false}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 14px" }}>Paysage concurrentiel</h3>
          <p style={{ color: t.textSecondary, fontSize: 15, lineHeight: 1.8, margin: 0 }}>{opp.competitors}</p>
        </GlassCard>
      </RevealSection>

      <RevealSection delay={0.3}>
        <div style={{
          position: "relative", borderRadius: 20, padding: "40px 32px", textAlign: "center", overflow: "hidden",
          border: `1px solid ${t.borderAccent}`,
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Cette opportunité vous intéresse ?</h3>
            <p style={{ color: t.textSecondary, fontSize: 15, margin: "0 0 24px", lineHeight: 1.6 }}>
              On vous accompagne pour transformer cette opportunité en projet concret.
            </p>
            <a href="https://calendly.com/mur-noe-celony/30min" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000", padding: "14px 32px", borderRadius: 12,
              fontSize: 15, fontWeight: 700, textDecoration: "none", cursor: "pointer", border: "none", fontFamily: "inherit",
              transition: "all 0.3s ease", boxShadow: "0 0 30px rgba(245,158,11,0.2)",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(245,158,11,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              Prendre rendez-vous <Icons.arrowRight size={16} color="#000" />
            </a>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}

function ContactView({ onNavigate }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: t.text, margin: 0, letterSpacing: "-0.02em" }}>On vous accompagne</h2>
          <p style={{ color: t.textSecondary, fontSize: 16, margin: "14px 0 0", lineHeight: 1.6 }}>
            Vous avez repéré une opportunité ? On vous aide à la transformer en business.
          </p>
        </div>
      </RevealSection>

      <RevealSection delay={0.1}>
        <GlassCard style={{ padding: 32, marginBottom: 28 }} hover={false} glow>
          <div style={{ display: "grid", gap: 24, marginBottom: 28 }}>
            {[
              { icon: <Icons.radar size={22} color={t.accent} />, title: "Validation de l'idée", desc: "On analyse le marché, la concurrence et la viabilité de votre opportunité." },
              { icon: <Icons.sparkle size={22} color={t.accent} />, title: "Stratégie de lancement", desc: "Plan d'action, MVP, acquisition des premiers clients — tout est structuré." },
              { icon: <Icons.trendUp size={22} color={t.accent} />, title: "Accompagnement continu", desc: "Suivi hebdomadaire pour itérer, optimiser et scaler votre projet." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: t.accentDim, border: `1px solid ${t.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <a href="https://calendly.com/mur-noe-celony/30min" target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000", padding: "16px 32px", borderRadius: 12,
            fontSize: 16, fontWeight: 700, textDecoration: "none", cursor: "pointer",
            transition: "all 0.3s ease", width: "100%", border: "none", fontFamily: "inherit",
            boxShadow: "0 0 30px rgba(245,158,11,0.2)",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(245,158,11,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Réserver un appel découverte <Icons.arrowRight size={18} color="#000" />
          </a>
        </GlassCard>
      </RevealSection>

      <RevealSection delay={0.2}>
        <div style={{ textAlign: "center", fontSize: 13, color: t.textTertiary, lineHeight: 1.6 }}>
          Appel gratuit de 30 minutes · Sans engagement · On discute de votre projet
        </div>
      </RevealSection>
    </div>
  );
}

// ─── MAIN APP ───
export default function Trendora() {
  const [view, setView] = useState("home");
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [initialCat, setInitialCat] = useState(null);
  const scrollProgress = useScrollProgress();

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
    <div style={{ background: t.bg, minHeight: "100vh", color: t.text, position: "relative" }}>
      <StellarOrb progress={scrollProgress} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: ${t.bg}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: ${t.accent}30; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
        @media (min-width: 641px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header style={{
        background: "rgba(10,10,10,0.8)",
        borderBottom: `1px solid ${t.border}`,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => { setView("home"); setSelectedOpp(null); }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#000", fontSize: 15, fontWeight: 900,
                boxShadow: "0 0 20px rgba(245,158,11,0.2)",
              }}>T</div>
              <span style={{ fontSize: 19, fontWeight: 800, color: t.text, letterSpacing: "-0.02em" }}>Trendora</span>
            </div>
            <nav className="nav-desktop" style={{ display: "flex", gap: 4 }}>
              {navItems.map(item => {
                const active = view === item.id || (view === "detail" && item.id === "home");
                return (
                  <button key={item.id} onClick={() => handleNavigate(item.id)} style={{
                    background: active ? t.accentDim : "transparent",
                    color: active ? t.accent : t.textSecondary,
                    border: `1px solid ${active ? t.borderAccent : "transparent"}`,
                    borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                    transition: "all 0.2s ease", fontFamily: "inherit",
                  }}
                    onMouseEnter={!active ? (e) => { e.currentTarget.style.color = t.text; } : undefined}
                    onMouseLeave={!active ? (e) => { e.currentTarget.style.color = t.textSecondary; } : undefined}>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <a href="https://calendly.com/mur-noe-celony/30min" target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.preventDefault(); handleNavigate("contact"); }}
            style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000", padding: "9px 20px", borderRadius: 10,
              fontSize: 13, fontWeight: 700, textDecoration: "none", cursor: "pointer",
              transition: "all 0.3s ease", border: "none", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 0 20px rgba(245,158,11,0.15)",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(245,158,11,0.15)"; }}>
            On vous accompagne
          </a>
        </div>

        {/* Mobile nav */}
        <nav className="nav-mobile" style={{ display: "none", padding: "0 24px 12px", gap: 4 }}>
          {navItems.map(item => {
            const active = view === item.id || (view === "detail" && item.id === "home");
            return (
              <button key={item.id} onClick={() => handleNavigate(item.id)} style={{
                flex: 1, background: active ? t.accentDim : "transparent",
                color: active ? t.accent : t.textSecondary,
                border: `1px solid ${active ? t.borderAccent : "transparent"}`,
                borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600,
                transition: "all 0.2s ease", fontFamily: "inherit",
              }}>
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ─── WEEK BANNER ─── */}
      {view !== "contact" && view !== "home" && (
        <div style={{ borderBottom: `1px solid ${t.border}`, padding: "10px 24px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.green, display: "inline-block", boxShadow: `0 0 8px ${t.green}40` }} />
              <span style={{ color: t.textSecondary, fontWeight: 500 }}>{WEEK_LABEL}</span>
              <span style={{ color: t.textTertiary }}>·</span>
              <span style={{ color: t.textTertiary }}>{OPPORTUNITIES.length} opportunités analysées</span>
            </div>
            <span style={{ color: t.textTertiary, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
              <Icons.calendar size={12} color={t.textTertiary} /> Prochain refresh : lundi
            </span>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ maxWidth: view === "home" ? 1200 : 880, margin: "0 auto", padding: view === "home" ? "0 0 64px" : "32px 24px 64px", transition: "max-width 0.3s ease" }}>
        {view === "home" && <HomeView opportunities={OPPORTUNITIES} onSelect={handleSelect} onNavigate={handleNavigate} />}
        {view === "top" && <TopView opportunities={OPPORTUNITIES} onSelect={handleSelect} />}
        {view === "categories" && <CategoryView opportunities={OPPORTUNITIES} onSelect={handleSelect} initialCat={initialCat} />}
        {view === "detail" && selectedOpp && <DetailView opportunity={selectedOpp} onBack={handleBack} />}
        {view === "contact" && <ContactView onNavigate={handleNavigate} />}
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: "24px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: t.textTertiary, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg, #F59E0B, #D97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: 9, fontWeight: 900 }}>T</div>
            <span>Trendora — Radar d'opportunités business propulsé par IA</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>Google Trends · Reddit · Product Hunt · Twitter/X</span>
        </div>
      </footer>
    </div>
  );
}
