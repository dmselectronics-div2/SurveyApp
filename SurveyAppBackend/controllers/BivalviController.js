const BivalviInfo = require("../models/BivalviSurvey");

// Save new entry
const saveBivalviInfo = async (req, res) => {
    try {
        const formData = req.body;
        console.log("Received form data:", JSON.stringify(formData, null, 2));
        
        // Check if the request body is empty
        if (!formData) {
            return res.status(400).json({ message: "Form data is required" });
        }

        // Process date fields properly if they exist
        if (formData.select_date && typeof formData.select_date === 'string') {
            formData.select_date = new Date(formData.select_date);
        }
        
        // Process numeric fields to ensure they're stored as numbers
        const numericFields = [
            'latitude', 'longitude', 'quadrat_size_m', 'area_of_quadrat_size',
            'water_depth', 'count', 'countBivalvi', 'clumped_count',
            // Add all species fields that should be numeric
            'ellobium_gangeticum_eg', 'melampus_ceylonicus_mc', 'melampus_fasciatus_mf',
            'pythia_plicata_pp', 'littoraria_scabra_lc', 'nerita_polita_np',
            'cerithidea_quoyii_cq', 'pirenella_cingulata_pc1', 'pirinella_conica_pc2', 
            'telescopium_telescopium_tr', 'terebralia_palustris_tp', 'haminoea_crocata_hc', 
            'faunus_ater_fa', 'family_onchidiidae', 'corbicula_solida_cs', 
            'meretrix_casta_mc', 'gelonia_coaxans_gc', 'magallana_belcheri_mb1', 
            'magallana_bilineata_mb2', 'saccostrea_scyphophilla_ss', 'saccostrea_cucullata_sc', 
            'martesia_striata_ms', 'ballanus_sp_b', 'mytella_strigata_ms2'
        ];
        
        numericFields.forEach(field => {
            if (field in formData) {
                if (typeof formData[field] === 'string') {
                    const parsed = parseFloat(formData[field]);
                    if (!isNaN(parsed)) {
                        formData[field] = parsed;
                    } else {
                        formData[field] = 0; // Default to 0 if parsing fails
                    }
                }
            }
        });

        // Create a new entry using the model
        const newEntry = new BivalviInfo(formData);
        console.log("Prepared data for database:", JSON.stringify(newEntry, null, 2));

        // Save to MongoDB
        await newEntry.save();
        console.log("Data saved successfully with ID:", newEntry._id);

        res.status(201).json({ 
            message: "Form submitted successfully", 
            entry_id: newEntry._id,
            survey_no: newEntry.survey_no
        });
    } catch (error) {
        console.error("Error saving form data:", error);
        
        // More descriptive error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all entries
const getAllBivalviInfo = async (req, res) => {
    try {
        // Support for pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        
        // Support for filtering
        const filter = {};
        
        // Add filters based on query parameters
        if (req.query.location) {
            filter.Location = { $regex: req.query.location, $options: 'i' };
        }
        
        if (req.query.habitat) {
            filter.plot_habitat_type = { $regex: req.query.habitat, $options: 'i' };
        }
        
        if (req.query.from_date && req.query.to_date) {
            filter.select_date = { 
                $gte: new Date(req.query.from_date), 
                $lte: new Date(req.query.to_date) 
            };
        } else if (req.query.from_date) {
            filter.select_date = { $gte: new Date(req.query.from_date) };
        } else if (req.query.to_date) {
            filter.select_date = { $lte: new Date(req.query.to_date) };
        }
        
        // Get total count for pagination info
        const totalEntries = await BivalviInfo.countDocuments(filter);
        
        // Fetch entries with pagination and filtering
        const entries = await BivalviInfo.find(filter)
            .sort({ select_date: -1 })  // Sort by date, newest first
            .skip(skip)
            .limit(limit);
        
        // Check if any entries exist
        if (entries.length === 0) {
            return res.status(200).json({ 
                message: "No entries found", 
                data: [],
                pagination: {
                    total: totalEntries,
                    page,
                    limit,
                    pages: Math.ceil(totalEntries / limit)
                }
            });
        }

        // Return entries with pagination info
        res.status(200).json({ 
            message: "Entries retrieved successfully", 
            count: entries.length,
            data: entries,
            pagination: {
                total: totalEntries,
                page,
                limit,
                pages: Math.ceil(totalEntries / limit)
            }
        });
    } catch (error) {
        console.error("Error retrieving form data:", error);
        
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get a single entry by ID
const getBivalviInfoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if id is provided
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }
        
        // Find the entry
        const entry = await BivalviInfo.findById(id);
        
        // If no entry was found with the given ID
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        
        // Return the entry
        res.status(200).json({ 
            message: "Entry retrieved successfully", 
            data: entry 
        });
    } catch (error) {
        console.error("Error retrieving entry:", error);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid ID format",
                error: error.message
            });
        }
        
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete an entry
const deleteBivalviInfo = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if id is provided
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }
        
        // Find and delete the entry
        const deletedEntry = await BivalviInfo.findByIdAndDelete(id);
        
        // If no entry was found with the given ID
        if (!deletedEntry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        
        // Return success response
        res.status(200).json({ 
            message: "Entry deleted successfully", 
            deletedEntry 
        });
    } catch (error) {
        console.error("Error deleting form data:", error);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid ID format",
                error: error.message
            });
        }
        
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update an entry
const updateBivalviInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        console.log("Update request for ID:", id);
        console.log("Update data received:", JSON.stringify(updateData, null, 2));
        
        // Check if id is provided
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }
        
        // Check if update data is provided
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Update data is required" });
        }
        
        // Process date fields properly if they exist in the update data
        if (updateData.select_date && typeof updateData.select_date === 'string') {
            updateData.select_date = new Date(updateData.select_date);
        }
        
        // Process numeric fields to ensure they're stored as numbers
        const numericFields = [
            'latitude', 'longitude', 'quadrat_size_m', 'area_of_quadrat_size',
            'water_depth', 'count', 'countBivalvi', 'clumped_count',
            // Add all species fields that should be numeric
            'ellobium_gangeticum_eg', 'melampus_ceylonicus_mc', 'melampus_fasciatus_mf',
            'pythia_plicata_pp', 'littoraria_scabra_lc', 'nerita_polita_np',
            'cerithidea_quoyii_cq', 'pirenella_cingulata_pc1', 'pirinella_conica_pc2', 
            'telescopium_telescopium_tr', 'terebralia_palustris_tp', 'haminoea_crocata_hc', 
            'faunus_ater_fa', 'family_onchidiidae', 'corbicula_solida_cs', 
            'meretrix_casta_mc', 'gelonia_coaxans_gc', 'magallana_belcheri_mb1', 
            'magallana_bilineata_mb2', 'saccostrea_scyphophilla_ss', 'saccostrea_cucullata_sc', 
            'martesia_striata_ms', 'ballanus_sp_b', 'mytella_strigata_ms2'
        ];
        
        numericFields.forEach(field => {
            if (field in updateData) {
                if (typeof updateData[field] === 'string') {
                    const parsed = parseFloat(updateData[field]);
                    if (!isNaN(parsed)) {
                        updateData[field] = parsed;
                    } else {
                        updateData[field] = 0; // Default to 0 if parsing fails
                    }
                }
            }
        });
        
        console.log("Processed update data:", JSON.stringify(updateData, null, 2));
        
        // Find and update the entry
        const updatedEntry = await BivalviInfo.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true,       // Return the updated document
                runValidators: true, // Run schema validators
                upsert: false    // Don't create if it doesn't exist
            }
        );
        
        // If no entry was found with the given ID
        if (!updatedEntry) {
            console.log("No document found with ID:", id);
            return res.status(404).json({ message: "Entry not found" });
        }
        
        console.log("Update successful for ID:", id);
        
        // Return success response
        res.status(200).json({ 
            message: "Entry updated successfully", 
            updatedEntry 
        });
    } catch (error) {
        console.error("Error updating form data:", error);
        
        // More detailed error handling
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid ID format",
                error: error.message
            });
        } else if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.message
            });
        }
        
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = { 
    saveBivalviInfo, 
    getAllBivalviInfo, 
    getBivalviInfoById,
    deleteBivalviInfo, 
    updateBivalviInfo 
};