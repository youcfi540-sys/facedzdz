
export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SELECTING_OUTFIT = 'SELECTING_OUTFIT',
  GENERATING_FINAL = 'GENERATING_FINAL',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown'
}

export interface OutfitOption {
  id: string;
  label: string;
  description: string;
  previewUrl?: string; // We'll generate 3 different previews for women
}

export interface ProcessingResult {
  originalImage: string;
  finalImage?: string;
  gender: Gender;
  outfitOptions: OutfitOption[];
  errorMessage?: string;
}
