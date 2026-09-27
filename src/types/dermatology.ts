export type UrgencyLevel = 'mild' | 'moderate' | 'high' | 'emergency';

export interface DifferentialDiagnosis {
  name: string;
  latinName: string;
  probability: number;
  reason: string;
}

export interface CareRecommendations {
  do: string[];
  dont: string[];
  skincareRoutine: string;
  recommendedIngredients: string[];
}

export interface HandAnalysisResult {
  primaryCondition: {
    name: string;
    latinName: string;
    confidence: number;
    shortDescription: string;
  };
  differentialDiagnoses: DifferentialDiagnosis[];
  urgencyLevel: UrgencyLevel;
  urgencyLabel: string;
  severityExplanation?: string;
  possibleCauses: string[];
  careRecommendations: CareRecommendations;
  warningSigns: string[];
  doctorQuestions: string[];
  disclaimer: string;
  timestamp?: number;
  userImage?: string;
  symptomsSnapshot?: HandSymptoms;
}

export interface HandSymptoms {
  location: string;
  duration: string;
  itchLevel: string;
  painLevel: string;
  triggers: string[];
  visualFeatures: string[];
  additionalNotes: string;
}

export interface DiseaseInfo {
  id: string;
  name: string;
  latinName: string;
  category: 'allergik' | 'ekzema' | 'infeksion' | 'autoimmun' | 'mavsumiy';
  shortDesc: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  careTips: string[];
  urgency: UrgencyLevel;
  iconType: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
