import { ContextRow } from "@/types";

/**
 * Mock data for Full Context sidebar – segment index with source (EN) and target (FR) text.
 * Used to display surrounding segments when reviewing/editing a segment.
 */
export const FULL_CONTEXT_MOCK_DATA: ContextRow[] = [
  {
    index: 2,
    source:
      "Agilent InfinityLab LC Solutions provide the broadest range of liquid chromatography options for any application and budget.",
    target:
      "Les solutions LC Agilent InfinityLab offrent la plus large gamme d'options de chromatographie en phase liquide pour toutes les applications et tous les budgets.",
  },
  {
    index: 6,
    source:
      "Agilent 1290 Infinity III LC and Agilent 1260 Infinity II LC come equipped with new, smart tools that simplify method development and ensure consistent results.",
    target:
      "Les systèmes Agilent 1290 Infinity III LC et Agilent 1260 Infinity II LC sont équipés de nouveaux outils intelligents qui simplifient le développement de méthodes et garantissent des résultats cohérents.",
  },
  {
    index: 12,
    source:
      "Hi, I'm David. In this video, we'll look at how upper back mobility affects overall movement. Lately, I've been working with several athletes, and I noticed that limited mobility in the upper spine is a common issue impacting their performance.",
    target:
      "Hallo, ik ben Delong. In deze video kijken we naar hoe de bewegelijkheid van de bovenrug invloed heeft op de algehele beweging. De afgelopen tijd heb ik met verschillende atleten gewerkt en merkte ik dat een beperkte mobiliteit van de bovenste wervelkolom een veelvoorkomend probleem is dat hun prestaties beïnvloedt.",
  },
  {
    index: 18,
    source:
      "With over 50 years of expertise in LC, you can trust the reliability of our instruments and the support of our global service network.",
    target:
      "Avec plus de 50 ans d'expertise en chromatographie liquide, vous pouvez faire confiance à la fiabilité de nos instruments et au soutien de notre réseau de service mondial.",
  },
  {
    index: 20,
    source:
      "The software interface displays real-time data from all connected sensors and allows for remote monitoring and configuration.",
    target:
      "L'interface logicielle affiche les données en temps réel de tous les capteurs connectés et permet une surveillance et une configuration à distance.",
  },
];
