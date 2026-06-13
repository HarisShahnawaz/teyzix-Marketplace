import User from '../models/User.js';
import Service from '../models/Service.js';
import Request from '../models/Request.js';

export const getAdminStats = async (req, res) => {
  try {
    // User Statistics
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });

    // Service Statistics
    const totalServices = await Service.countDocuments();

    // Project Statistics
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'Pending' });
    const acceptedRequests = await Request.countDocuments({ status: 'Accepted' });
    const completedRequests = await Request.countDocuments({ status: 'Completed' });
    const deliveredRequests = await Request.countDocuments({ status: 'Delivered' });

    res.json({
      users: {
        total: totalUsers,
        customers: totalCustomers,
        providers: totalProviders
      },
      services: {
        total: totalServices
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        accepted: acceptedRequests,
        completed: completedRequests,
        delivered: deliveredRequests
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
