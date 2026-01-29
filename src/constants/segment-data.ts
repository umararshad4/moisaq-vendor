import { SegmentData } from "@/types";

export const SEGMENT_MOCK_DATA: Record<string, SegmentData> = {
  "1": {
    id: "1",
    segmentNumber: 12,
    source:
      "Hi, I'm David. In this video, we'll look at how upper back mobility affects overall movement. Lately, I've been working with several athletes, and I noticed that limited mobility in the upper spine is a common issue impacting their performance.",
    target:
      "Hallo, ik ben Delong. In deze video kijken we naar hoe de bewegelijkheid van de bovenrug invloed heeft op de algehele beweging. De afgelopen tijd heb ik met verschillende atleten gewerkt en merkte ik dat een beperkte mobiliteit van de bovenste wervelkolom een veelvoorkomend probleem is dat hun prestaties beïnvloedt.",
    editedTarget:
      "Hallo, ik ben Delong. In deze video kijken we naar hoe de bewegelijkheid van de bovenrug invloed heeft op de algehele beweging. De afgelopen tijd heb ik met verschillende atleten gewerkt en merkte ik dat een beperkte mobiliteit van de bovenste wervelkolom een veelvoorkomend probleem is dat hun prestaties beïnvloedt.",
    errors: [
      {
        id: 1,
        category: "Accuracy",
        subcategory: "Mistranslation",
        severity: "Minor",
        rationale:
          'The construction of the product name is incorrect. "Agilent InfinityLab LC Solutions" should translated as "Les solutions de LC Agilent InfinityLab". The word orde...',
        translatorFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
        reviewerFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
      },
    ],
  },
  "2": {
    id: "2",
    segmentNumber: 17,
    source:
      "The system must be calibrated before initial use to ensure accurate measurements.",
    target:
      "Le système doit être calibré avant la première utilisation pour assurer des mesures précises.",
    editedTarget:
      "Le système doit être étalonné avant la première utilisation afin de garantir des mesures précises.",
    errors: [
      {
        id: 1,
        category: "Terminology",
        subcategory: "Incorrect term",
        severity: "Major",
        rationale:
          'In technical and metrology contexts, "étalonner" is the correct standardized term in French. Using "calibrer" is considered less precise and does not comply with domain terminology guidelines.',
        translatorFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
        reviewerFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
      },
      {
        id: 2,
        category: "Accuracy",
        subcategory: "Mistranslation",
        severity: "Minor",
        rationale:
          'The construction of the product name is incorrect. "Agilent InfinityLab LC Solutions" should translated as "Les solutions de LC Agilent InfinityLab". The word order...',
        translatorFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
        reviewerFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
      },
    ],
  },
  "3": {
    id: "3",
    segmentNumber: 23,
    source:
      "Please ensure all connections are secure before powering on the device.",
    target:
      "Veuillez vous assurer que toutes les connexions sont sécurisées avant de mettre l'appareil sous tension.",
    editedTarget:
      "Veuillez vous assurer que toutes les connexions sont sécurisées avant de mettre l'appareil sous tension.",
    errors: [
      {
        id: 1,
        category: "Style",
        subcategory: "Inconsistency",
        severity: "Minor",
        rationale:
          "The formal tone is inconsistent with the rest of the document. A more direct imperative form would be appropriate.",
        translatorFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
        reviewerFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
      },
    ],
  },
  "4": {
    id: "4",
    segmentNumber: 27,
    source:
      "The software interface displays real-time data from all connected sensors.",
    target:
      "L'interface logicielle affiche les données en temps réel de tous les capteurs connectés.",
    editedTarget:
      "L'interface logicielle affiche les données en temps réel de tous les capteurs connectés.",
    errors: [],
  },
  "5": {
    id: "5",
    segmentNumber: 31,
    source:
      "Maintenance should be performed every six months to ensure optimal performance.",
    target:
      "L'entretien doit être effectué tous les six mois pour garantir des performances optimales.",
    editedTarget:
      "La maintenance doit être effectuée tous les six mois pour garantir des performances optimales.",
    errors: [
      {
        id: 1,
        category: "Terminology",
        subcategory: "Incorrect term",
        severity: "Critical",
        rationale:
          'In technical documentation, "maintenance" should be used instead of "entretien" for professional equipment to maintain consistency with industry standards.',
        translatorFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
        reviewerFeedback:
          "The construction of the product name is incorrect. 'Agilent InfinityLab LC Solutions' should translated as 'Les solutions de LC Agilent InfinityLab'. The word 'série'.",
      },
    ],
  },
};

export const TOTAL_SEGMENTS = 94;

export const JOB_INFO = {
  title: "HPLC System User Manual",
  languagePair: "EN → ES",
  reviewer: "Reviewer validation",
};
