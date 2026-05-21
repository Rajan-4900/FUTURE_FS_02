import Contact from '../models/Contact.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ owner: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, count: contacts.length, data: contacts });
});

export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });

  if (!contact) {
    return res.status(404).json({ success: false, message: 'Contact not found' });
  }

  res.status(200).json({ success: true, data: contact });
});

export const createContact = asyncHandler(async (req, res) => {
  req.body.owner = req.user._id;
  const contact = await Contact.create(req.body);
  res.status(201).json({ success: true, data: contact });
});

export const updateContact = asyncHandler(async (req, res) => {
  let contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });

  if (!contact) {
    return res.status(404).json({ success: false, message: 'Contact not found' });
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: contact });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });

  if (!contact) {
    return res.status(404).json({ success: false, message: 'Contact not found' });
  }

  await contact.deleteOne();
  res.status(200).json({ success: true, message: 'Contact removed' });
});
