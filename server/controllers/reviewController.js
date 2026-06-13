import Review from '../models/Review.js';
import Request from '../models/Request.js';
import Service from '../models/Service.js';

export const createReview = async (req, res) => {
  try {
    const { serviceId, providerId, rating, comment, requestId } = req.body;

    console.log("📥 Incoming Review Payload:", { serviceId, providerId, rating, comment, requestId });

    if (!requestId) {
      return res.status(400).json({ message: 'Missing requestId in submission payload.' });
    }

    // Fetch the request and make sure we pull the raw customer ID from the document
    const requestVerification = await Request.findById(requestId);
    
    if (!requestVerification) {
      console.log(`❌ Order Request not found for ID: ${requestId}`);
      return res.status(400).json({ message: 'Order reference not found in database.' });
    }

    const currentStatus = requestVerification.status ? requestVerification.status.toLowerCase() : '';
    console.log(`🔄 Verifying Order Status. Database value is: "${requestVerification.status}"`);

    if (currentStatus !== 'completed' && currentStatus !== 'delivered') {
      return res.status(400).json({ 
        message: `You can only review services that are completed or delivered. Current status is: ${requestVerification.status}` 
      });
    }

    // 🛡️ SAFE EXTRACTION: Get IDs directly from the database request record
    const finalCustomerId = requestVerification.customer?._id || requestVerification.customer || req.user?.id || req.user?._id;
    const finalProviderId = providerId || requestVerification.provider?._id || requestVerification.provider;

    if (!finalCustomerId) {
      return res.status(400).json({ message: 'Could not isolate Customer ID from order reference.' });
    }

    if (!finalProviderId) {
      return res.status(400).json({ message: 'Could not isolate Provider ID from order reference.' });
    }

    // Create and commit review document
    const review = new Review({
      service: serviceId,
      customer: finalCustomerId,
      provider: finalProviderId,
      rating: Number(rating),
      comment
    });

    const savedReview = await review.save();
    console.log("💾 Review saved successfully into Mongoose collection.");

    // Recalculate average rating scores cleanly
    const allReviews = await Review.find({ service: serviceId });
    const reviewCount = allReviews.length;
    
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0.0";

    await Service.findByIdAndUpdate(serviceId, {
      averageRating: Number(averageRating),
      reviewCount: reviewCount
    });
    console.log(`⭐ Service ID ${serviceId} updated with average rating: ${averageRating}`);

    return res.status(201).json(savedReview);

  } catch (error) {
    console.error("💥 CRITICAL BACKEND ERROR IN CREATEREVIEW:", error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

export const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('customer', 'name avatar')
      .populate('provider', 'name avatar');
      
    return res.json(reviews);
  } catch (error) {
    console.error("💥 ERROR IN GETSERVICEREVIEWS:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};