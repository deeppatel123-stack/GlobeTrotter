import React, { useState } from 'react';
import Modal from './Modal';
import { DollarSign, Tag, Calendar, FileText } from 'lucide-react';

const AddExpenseModal = ({ isOpen, onClose, onAddExpense, stopName = '', tripCurrency = 'INR' }) => {
  const [category, setCategory] = useState('stay');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddExpense({
        category,
        description: description.trim(),
        amount: Number(amount),
        currency: tripCurrency,
        date: date || new Date(),
      });
      setDescription('');
      setAmount('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Expense${stopName ? ` for ${stopName}` : ''}`}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!description.trim() || !amount || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Add Expense'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <Tag size={15} /> Expense Category
          </label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="stay">Stay & Hotel</option>
            <option value="transport">Transport (Flights / Trains / Cabs)</option>
            <option value="meals">Meals & Food</option>
            <option value="activities">Activities & Entry Tickets</option>
            <option value="other">Other / Shopping / Miscellaneous</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <FileText size={15} /> Description
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 3 Nights Boutique Hotel, Metro Card, Dinner"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={15} /> Amount ({tripCurrency})
            </label>
            <input
              type="number"
              min="1"
              className="form-input"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <Calendar size={15} /> Date
            </label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
