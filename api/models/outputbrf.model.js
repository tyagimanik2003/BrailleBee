import mongoose from 'mongoose';

const outputSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        pdfId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pdf',
            required: true
        },
        fileName: {
            type: String,
            required: true
        }, 
        filePath: {
            type: String,
            required: true
        },
    },
    {timestamps: true}
);

const BrfOutput = mongoose.model('BrfOutput', outputSchema);

export default BrfOutput;
