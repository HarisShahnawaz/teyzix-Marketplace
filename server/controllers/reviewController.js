import Review from '../models/Review.js';
import Request from '../models/Request.js';

export const createReview = async (req, res) => {
  try {
    const { serviceId, providerId, rating, comment, requestId } = req.body;

    const requestVerification = await Request.findById(requestId);
    if (!requestVerification || requestVerification.status !== 'Delivered') {
      return res.status(400).json({ message: 'You can only review services that have been officially delivered' });
    }

    const review = new Review({
      service: serviceId,
      customer: req.user.id,
      provider: providerId,
      rating,
      comment
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('customer', 'name avatar');
      
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};