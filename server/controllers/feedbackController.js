const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
    try {
        const {
            name,
            email,
            feedbackType,
            rating,
            message
        } = req.body 

        if(!feedbackType || !rating || !message) {
            return res.status(400).json({ error: 'Feedback type, rating, and message are required.' });
        }

        const feedback = new Feedback({
            name,
            email,
            feedbackType,
            rating,
            message
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while submitting feedback.' });
    }
}