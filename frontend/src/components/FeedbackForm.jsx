import { useState } from 'react';
import { HiStar } from 'react-icons/hi2';
import './FeedbackForm.css';

export default function FeedbackForm({ onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };

  return (
    <form className="feedback-form glass-card" onSubmit={handleSubmit}>
      <h3 className="feedback-form__title">Rate Your Experience</h3>
      <p className="feedback-form__desc">How satisfied are you with the resolution?</p>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star} type="button"
            className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <HiStar />
          </button>
        ))}
        <span className="star-label">
          {rating > 0 ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating] : 'Select rating'}
        </span>
      </div>
      <textarea
        className="form-textarea"
        placeholder="Share your feedback (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <button type="submit" className="btn btn-primary btn-lg" disabled={rating === 0 || loading}
        style={{ width: '100%', marginTop: 'var(--space-md)' }}>
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
