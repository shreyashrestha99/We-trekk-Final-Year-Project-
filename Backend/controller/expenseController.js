import Expense from "../models/Expense.js";

// POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      trekker_id: req.user.id
    });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/expenses/my
export const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ trekker_id: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/expenses/report
export const generateReport = async (req, res) => {
  try {
    const expenses = await Expense.find({ trekker_id: req.user.id });
    // In a real scenario, convert expenses to PDF. Returning JSON for now.
    res.json({ message: "PDF Report generated", expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
