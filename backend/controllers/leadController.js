const catchAsyncError = require('../middleware/catchAsyncError');
const Lead = require('../models/leadModel');

// Get all leads for authenticated business
exports.getOwnerLeads = catchAsyncError(async (req, res, next) => {
  const chatbotId = req.user._id;

  const leads = await Lead.find({ chatbotId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: leads.length,
    leads,
  });
});

// Export leads as CSV
exports.exportLeadsCSV = catchAsyncError(async (req, res, next) => {
  const chatbotId = req.user._id;

  const leads = await Lead.find({ chatbotId }).sort({ createdAt: -1 });

  let csv = "Lead ID,Name,Email,Phone,Source,Status,Message,Captured Date\n";

  for (const lead of leads) {
    const escapedMsg = (lead.message || "").replace(/"/g, '""');
    csv += `"${lead._id}","${lead.name}","${lead.email}","${lead.phone || ''}","${lead.source}","${lead.status}","${escapedMsg}","${lead.createdAt.toISOString()}"\n`;
  }

  res.header("Content-Type", "text/csv");
  res.attachment(`leads_export_${Date.now()}.csv`);
  return res.send(csv);
});

// Delete lead
exports.deleteLead = catchAsyncError(async (req, res, next) => {
  const chatbotId = req.user._id;
  const { id } = req.params;

  const lead = await Lead.findById(id);
  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead not found" });
  }

  if (lead.chatbotId.toString() !== chatbotId.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  await Lead.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Lead deleted successfully",
  });
});
