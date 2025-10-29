import  mongoose  from 'mongoose';

const treatmentFeeSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service Name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    rate: {
        type: Number,
        required: [true, 'Rate is required'],
        min: [0, 'Rate cannot be negative']
    },
    currency: {
        type: String,
        default: 'EUR'
    }
}, {
    timestamps: true
});

const TreatmentFee = mongoose.model('TreatmentFee', treatmentFeeSchema);

export default  TreatmentFee;