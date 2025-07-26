import api from './api';

// Get all polls
export const getPolls = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.active !== undefined) {
      queryParams.append('active', params.active);
    }
    
    const url = queryParams.toString() ? `/polls?${queryParams.toString()}` : '/polls';
    console.log('Calling polls API:', url);
    const response = await api.get(url);
    console.log('Polls API response:', response);
    return response;
  } catch (error) {
    console.error('Polls API error:', error);
    throw error;
  }
};

// Get single poll
export const getPoll = async (id) => {
  return api.get(`/polls/${id}`);
};

// Get poll results
export const getPollResults = async (id) => {
  return api.get(`/polls/${id}/results`);
};

// Vote on a poll
export const voteOnPoll = async (pollId, optionIndex) => {
  return api.post(`/polls/${pollId}/vote`, { optionIndex });
};

// Create a new poll (Admin only)
export const createPoll = async (pollData) => {
  return api.post('/polls', pollData);
};

// Update a poll (Admin only)
export const updatePoll = async (id, pollData) => {
  return api.put(`/polls/${id}`, pollData);
};

// Delete a poll (Admin only)
export const deletePoll = async (id) => {
  return api.delete(`/polls/${id}`);
};
