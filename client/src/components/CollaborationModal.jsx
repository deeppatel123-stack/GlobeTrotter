import React, { useState } from 'react';
import Modal from './Modal';
import { Users, Mail, ThumbsUp, MessageSquare, Plus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CollaborationModal = ({ isOpen, onClose, trip, onTripUpdated }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  if (!trip) return null;

  const collaborators = trip.collaborators || [
    { email: 'priya.sharma@example.com', role: 'Editor', status: 'Accepted' },
    { email: 'rohan.mehta@example.com', role: 'Viewer', status: 'Accepted' },
  ];

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    toast.success(`Invitation sent to ${inviteEmail}!`);
    setInviteEmail('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trip Team Collaboration" size="md">
      <div className="collab-modal-body">
        {/* Header */}
        <div className="collab-header-box">
          <Users size={20} color="#0284c7" />
          <div>
            <h3>Plan Together — {trip.name}</h3>
            <p>Collaborators can suggest activities, vote on stays, and comment in real-time.</p>
          </div>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleInvite} className="collab-invite-form">
          <input
            type="email"
            className="form-input"
            placeholder="Friend's email address..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <select
            className="form-select"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            style={{ width: '110px' }}
          >
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <button type="submit" className="btn btn-primary btn-sm">
            <Plus size={16} /> Invite
          </button>
        </form>

        {/* Active Collaborators */}
        <div className="collaborators-list">
          <h4 className="list-heading">Active Collaborators ({collaborators.length})</h4>
          {collaborators.map((c, idx) => (
            <div key={idx} className="collaborator-item">
              <div className="collab-info">
                <Mail size={16} color="#64748b" />
                <span>{c.email}</span>
              </div>
              <div className="collab-pills">
                <span className="badge badge-primary">{c.role}</span>
                <span className="badge badge-success">{c.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sample Suggestions & Voting */}
        <div className="collab-proposals-box">
          <h4 className="list-heading">Activity Suggestions & Voting</h4>
          <div className="proposal-item">
            <div>
              <strong>Grand Island Scuba Diving</strong>
              <span className="proposal-author">Suggested by Priya</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => toast.success('Voted +1 for Scuba Diving!')}
            >
              <ThumbsUp size={14} /> +1 Vote
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .collab-modal-body { display: flex; flex-direction: column; gap: 1.25rem; }
        .collab-header-box { display: flex; align-items: center; gap: 0.75rem; background: #f0f9ff; padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; color: #0369a1; }
        .collab-invite-form { display: flex; gap: 0.5rem; }
        .collaborators-list { display: flex; flex-direction: column; gap: 0.65rem; }
        .list-heading { font-size: 0.88rem; font-weight: 800; color: #0f172a; }
        .collaborator-item { display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0.85rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); font-size: 0.85rem; }
        .collab-info { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
        .collab-pills { display: flex; gap: 0.35rem; }
        .collab-proposals-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 0.85rem 1rem; display: flex; flex-direction: column; gap: 0.65rem; }
        .proposal-item { display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; }
        .proposal-author { display: block; font-size: 0.75rem; color: #64748b; }
      `}</style>
    </Modal>
  );
};

export default CollaborationModal;
