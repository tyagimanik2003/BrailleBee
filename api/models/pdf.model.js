import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fileName: {
            type: String,
            required: true  
        },
        filePath: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true,
        },
        language: {
            type: String,
            required: true,
        }
    },
    {timestamps: true}
)

const Pdf = mongoose.model('Pdf', pdfSchema);

export default Pdf;