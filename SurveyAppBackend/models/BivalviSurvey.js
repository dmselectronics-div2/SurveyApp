const mongoose = require("mongoose");

const BivalviInfoSchema = new mongoose.Schema({
  // Basic information
  survey_no: { type: String, required: false },
  select_date: { type: Date, default: null },
  teamMembers: { type: String, default: "" },
  time_of_data_collection: { type: String, default: "" },
  nearest_high_tide_time: { type: String },
  time_of_sampling: { type: String },
  samplingMethod: { type: String, default: "" },
  Location: { type: String },
  customLocation: { type: String, default: "" }, // Added for custom location

  // Observer information
  observers: { type: String, default: "" },

  // Weather and environmental information
  selectedWeatherConditions: { type: String, default: "" },
  weatherRemark: { type: String, default: "" },

  // Habitat information
  plot_habitat_type: { type: String, default: "" },
  customHabitatType: { type: String, default: "" },
  plot_vegetation: { type: String, default: "" },
  customVegetation: { type: String, default: "" },
  if_restored_year_of_restoration: { type: String },

  // GPS coordinates
  latitude: { type: Number, min: -90, max: 90, default: 0 },
  longitude: { type: Number, min: -180, max: 180, default: 0 },

  // Quadrat information
  quadrat_id: { type: String },
  quadratLocation: { type: String, default: "" },
  customQuadratLocation: { type: String, default: "" },
  quadratObservedBy: { type: String },
  data_entered_by: { type: String, default: "" },
  quadrat_size_m: { type: Number },
  area_of_quadrat_size: { type: Number },

  // Transect information
  transectId: { type: String },
  transectObservedBy: { type: String },
  transectDataEnteredBy: { type: String },
  transectSize: { type: Number },
  transectLatitude: { type: String },
  transectLongitude: { type: String },
  endPointLatitude: { type: String },
  endPointLongitude: { type: String },

  // Peterson Grab information
  grabId: { type: String },
  grabObservedBy: { type: String },
  grabDataEnteredBy: { type: String },
  grabSize: { type: Number },
  grabLatitude: { type: String },
  grabLongitude: { type: String },

  // Soil Core information
  coreId: { type: String },
  coreObservedBy: { type: String },
  coreDataEnteredBy: { type: String },
  coreDepth: { type: String },
  sieveSize: { type: String },
  coreLatitude: { type: String },
  coreLongitude: { type: String },

  // Microhabitat information
  quadrat_microhabitat: { type: String },
  custom_Microhabitat: { type: String },
  customMicrohabitat: { type: String, default: "" }, // Added for frontend consistency

  // Clump information
  species_seen_clumped: { type: String, default: "No" },
  species_seen_clumped_what: { type: String },
  clumped_species_name: { type: String },
  clumped_where: { type: String },
  clumped_count: { type: Number },

  // Clumped species collection (for multiple entries)
  clumped_species: [{
    species_seen_clumped_what: { type: String },
    clumped_species_name: { type: String },
    clumped_where: { type: String },
    clumped_count: { type: Number }
  }],

  // Species observed on object above the soil
  species_seen_on_root: { type: String, default: "No" },
  species_on_root_where: { type: String },
  species_on_root_what: { type: String },

  // Species on root collection (for multiple entries)
  species_on_root_info: [{
    species_on_root_where: { type: String },
    species_on_root_what: { type: String }
  }],

  // Water information
  is_in_water: { type: String, default: "" }, // Changed field name to match frontend
  in_water: { type: String, default: "" },    // Keep for backward compatibility
  water_status: { type: String },
  water_depth: { type: Number },

  // Sampling information
  SamplingLayer: { type: String, default: "" },
  sampling_method: { type: String, default: "" },

  // Gastropod species counts
  ellobium_gangeticum_eg: { type: Number, default: 0 },
  melampus_ceylonicus_mc: { type: Number, default: 0 },
  melampus_fasciatus_mf: { type: Number, default: 0 },
  pythia_plicata_pp: { type: Number, default: 0 },
  littoraria_scabra_lc: { type: Number, default: 0 },
  nerita_polita_np: { type: Number, default: 0 },
  cerithidea_quoyii_cq: { type: Number, default: 0 },
  pirenella_cingulata_pc1: { type: Number, default: 0 },
  pirinella_conica_pc2: { type: Number, default: 0 },
  telescopium_telescopium_tr: { type: Number, default: 0 },
  terebralia_palustris_tp: { type: Number, default: 0 },
  haminoea_crocata_hc: { type: Number, default: 0 },
  faunus_ater_fa: { type: Number, default: 0 },
  family_onchidiidae: { type: Number, default: 0 },
  meiniplotia_scabra_ms3: { type: Number, default: 0 },
  meretrix_casta_MC: { type: Number, default: 0 },
  gelonia_coaxons_GC: { type: Number, default: 0 },
  magallana_belcheri_MB1: { type: Number, default: 0 },
  magallana_bilineata_MB2: { type: Number, default: 0 },
  saccostra_scyphophilla_SS: { type: Number, default: 0 },
  saccostra_cucullata_SC: { type: Number, default: 0 },
  martesia_striata_MS1: { type: Number, default: 0 },
  barnacle_sp_b: { type: Number, default: 0 },
  mytella_strigata_MS2: { type: Number, default: 0 },

  // Bivalve species counts
  corbicula_solida_cs: { type: Number, default: 0 },
  meretrix_casta_mc: { type: Number, default: 0 },
  gelonia_coaxans_gc: { type: Number, default: 0 },
  magallana_belcheri_mb1: { type: Number, default: 0 },
  magallana_bilineata_mb2: { type: Number, default: 0 },
  saccostrea_scyphophilla_ss: { type: Number, default: 0 },
  saccostrea_cucullata_sc: { type: Number, default: 0 },
  martesia_striata_ms: { type: Number, default: 0 },
  ballanus_sp_b: { type: Number, default: 0 },
  mytella_strigata_ms2: { type: Number, default: 0 },

  // Image section - improved based on frontend implementation
  photos: { type: String, default: "" },
  photoModalVisible: { type: Boolean, default: false },
  imageUri: { type: String, default: "" },

  // Content array for storing multiple images and text notes
  content: [{
    type: { type: String, enum: ['text', 'image'] },
    text: { type: String },  // For text content
    uri: { type: String }    // For image content
  }],

  // Notes and remarks 
  remark: { type: String, default: "" },

  // For any additional custom fields that might be added later
  custom_fields: { type: Map, of: mongoose.Schema.Types.Mixed }
}, {
  // This enables the storage of fields not defined in the schema
  // Useful for when frontend form fields change without requiring schema updates
  strict: false,

  // Adds createdAt and updatedAt timestamps automatically
  timestamps: true
});

// Add indexes for better query performance
BivalviInfoSchema.index({ survey_no: 1 });
BivalviInfoSchema.index({ select_date: 1 });
BivalviInfoSchema.index({ Location: 1 });
BivalviInfoSchema.index({ SamplingLayer: 1 });
BivalviInfoSchema.index({ plot_habitat_type: 1 });
BivalviInfoSchema.index({ created_at: 1 });
// Add indexes for new fields
BivalviInfoSchema.index({ grabId: 1 });
BivalviInfoSchema.index({ coreId: 1 });

// Pre-save middleware to map frontend field names to consistent backend names if needed
BivalviInfoSchema.pre('save', function (next) {
  // Map quadrat information from frontend fields
  if (!this.quadrat_id && this.quadratId) {
    this.quadrat_id = this.quadratId;
  }

  if (!this.quadrat_observed_by && this.quadratObservedBy) {
    this.quadrat_observed_by = this.quadratObservedBy;
  }

  if (!this.data_entered_by && this.dataEnteredBy) {
    this.data_entered_by = this.dataEnteredBy;
  }

  // Map species clump information
  if (!this.clumped_species_name && this.clumpedSpeciesName) {
    this.clumped_species_name = this.clumpedSpeciesName;
  }

  if (!this.clumped_where && this.clumpedWhere) {
    this.clumped_where = this.clumpedWhere;
  }

  if (!this.clumped_count && this.clumpedCount) {
    this.clumped_count = parseInt(this.clumpedCount) || 0;
  }

  // Map species seen clumped what
  if (!this.species_seen_clumped_what && this.speciesSeenClumpedWhat) {
    this.species_seen_clumped_what = this.speciesSeenClumpedWhat;
  }

  // Map species on root information
  if (!this.species_on_root_where && this.speciesOnRootWhere) {
    this.species_on_root_where = this.speciesOnRootWhere;
  }

  if (!this.species_on_root_what && this.speciesOnRootWhat) {
    this.species_on_root_what = this.speciesOnRootWhat;
  }

  // Map water information
  if (!this.in_water && this.isInWater) {
    this.in_water = this.isInWater;
    this.is_in_water = this.isInWater; // Also set the new field
  }

  // Map sampling method
  if (!this.sampling_method && this.samplingMethod) {
    this.sampling_method = this.samplingMethod;
  }

  // Map habitat information
  if (!this.plot_habitat_type && this.habitatType) {
    this.plot_habitat_type = this.habitatType;
  }

  // Map restoration year
  if (!this.if_restored_year_of_restoration && this.restorationYear) {
    this.if_restored_year_of_restoration = this.restorationYear;
  }

  // Map vegetation information
  if (!this.plot_vegetation && this.vegetation) {
    this.plot_vegetation = this.vegetation;
  }

  // Map microhabitat information
  if (!this.quadrat_microhabitat && this.microhabitat) {
    this.quadrat_microhabitat = this.microhabitat;
  }

  if (!this.custom_Microhabitat && this.customMicrohabitat) {
    this.custom_Microhabitat = this.customMicrohabitat;
  }

  next();
});

module.exports = mongoose.model("bivalviDetails", BivalviInfoSchema);