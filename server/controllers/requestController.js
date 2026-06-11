import Request from '../models/Request.js';

export const createRequest = async (req, res) => {
  try {
    const { provider, service, requirements, budget, deadline } = req.body;

    const newRequest = new Request({
      customer: req.user.id,
      provider,
      service,
      requirements,
      budget,
      deadline
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'provider') {
      query.provider = req.user.id;
    } else {
      query.customer = req.user.id;
    }

    const requests = await Request.find(query)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title price');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const isCustomer = request.customer.toString() === req.user.id;
    const isProvider = request.provider.toString() === req.user.id;

    if (!isCustomer && !isProvider) {
      return res.status(401).json({ message: 'Not authorized to change this status' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};