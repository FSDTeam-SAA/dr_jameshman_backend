import FAQ from "../models/faq.model.js";

// create faq
export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        status: false,
        message: "Question and answer are required",
        data: null,
      });
    }

    const existingFAQ = await FAQ.findOne({ question });
    if (existingFAQ) {
      return res.status(400).json({
        status: false,
        message: "This question already exists",
        data: null,
      });
    }

    const newFAQ = new FAQ({
      question,
      answer,
    });

    await newFAQ.save();

    return res.status(201).json({
      status: true,
      message: "FAQ created successfully",
      data: newFAQ,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
      data: null,
    });
  }
};

//  get all faqs
export const getAllFAQs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const faqs = await FAQ.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalFAQs = await FAQ.countDocuments();

    const totalPages = Math.ceil(totalFAQs / limit);

    return res.status(200).json({
      status: true,
      message: "FAQs fetched successfully",
      data: faqs,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalFAQs: totalFAQs,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
      data: null,
    });
  }
};

//  get single faq
export const getSingleFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;

    const faq = await FAQ.findById(faqId);

    if (!faq) {
      return res
        .status(404)
        .json({ status: false, message: "FAQ not found", data: null });
    }

    return res.status(200).json({
      status: true,
      message: "FAQ fetched successfully",
      faq: faq,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
      data: null,
    });
  }
};

// edit faq
export const editFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ status: false, message: "Question and answer are required" });
    }

    const faq = await FAQ.findById(faqId);
    if (!faq) {
      return res
        .status(404)
        .json({ status: false, message: "FAQ not found", data: null });
    }

    faq.question = question;
    faq.answer = answer;

    await faq.save();

    return res.status(200).json({
      status: true,
      message: "FAQ updated successfully",
      faq: faq,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
      data: null,
    });
  }
};

//  delete faq
export const deleteFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;

    const faq = await FAQ.findByIdAndDelete(faqId);
    if (!faq) {
      return res
        .status(404)
        .json({ status: false, message: "FAQ not found", data: null });
    }

    return res.status(200).json({
      status: true,
      message: "FAQ deleted successfully",
      data: false,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
      data: null,
    });
  }
};
