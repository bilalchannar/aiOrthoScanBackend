
export const uploadPatientData= async (req,res,next)=>{
    console.log(req.body);
    console.log(req.file);
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const details = req.body.relevantData;

      console.log(file);         // file metadata
      console.log(file.buffer);  // actual image data (important)
      console.log(details);

      res.status(200).json({
        success: true,
        message: "Image received in memory",
        data: {
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          relevantData: details ? JSON.parse(details) : null
        }
      });

    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
}