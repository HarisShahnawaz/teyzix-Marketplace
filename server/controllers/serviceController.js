import Service from '../models/Service.js';

export const createService = async (req, res) => {
  try {
    const { title, description, category, price, deliveryTime } = req.body;

    const service = new Service({
      title,
      description,
      category,
      price,
      deliveryTime,
      createdBy: req.user.id
    });

    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query).populate('createdBy', 'name email avatar');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service listing not found' });
    }

    if (service.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this listing' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service listing not found' });
    }

    if (service.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this listing' });
    }

    await service.deleteOne();
    res.json({ message: 'Service listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};