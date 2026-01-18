export interface TvFilters {
  province?: string;
  district?: string;
  ward?: string;
  topic?: string;
  timeRangeDays: number;
}

export interface LayerToggles {
  hotspots: boolean;
  leads: boolean;
  tasks: boolean;
  evidences: boolean;
}

export interface TvSettings {
  autoPlayScenes: boolean;
  sceneIntervalSeconds: number;
  showAlertTicker: boolean;
  showEmergencyBanner: boolean;
  showCitizenGallery: boolean;
}
