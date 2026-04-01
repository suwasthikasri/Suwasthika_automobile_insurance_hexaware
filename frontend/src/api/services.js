import api, { BASE_URL } from './axiosConfig';
import axios from 'axios';

export const loginUser = (email, password) => {
  return api.post('/api/v1/users/login', { email, password });
};

export const registerUser = (userData) =>
  api.post('/api/v1/users/register', userData);

export const getUserById = (userId) =>
  api.get(`/api/v1/users/${userId}`);

export const getAllUsers = () =>
  api.get('/api/v1/users/all');

export const updateUser = (userData) =>
  api.put('/api/v1/users/update', userData);

export const findUserByEmail = (email) => {
  return api.get(`/api/v1/users/email/${email}`);
}; 

export const getAllPolicies = () =>
  api.get('/api/v1/policies/all');

export const getPolicyById = (policyId) =>
  api.get(`/api/v1/policies/${policyId}`);

export const getPoliciesByCategory = (category) =>
  api.get(`/api/v1/policies/category/${category}`);

export const addPolicy = (policyData) =>
  api.post('/api/v1/policies/add', policyData);

export const updatePolicy = (policyData) =>
  api.put('/api/v1/policies/update', policyData);

export const activatePolicy = (policyId) =>
  api.put(`/api/v1/policies/activate/${policyId}`);

export const deactivatePolicy = (policyId) =>
  api.put(`/api/v1/policies/deactivate/${policyId}`);


export const createProposal = (proposalData) =>
  api.post('/api/v1/proposals/create', proposalData);

export const getProposalById = (proposalId) =>
  api.get(`/api/v1/proposals/${proposalId}`);

export const getProposalsByUser = (userId) =>
  api.get(`/api/v1/proposals/user/${userId}`);

export const getAllProposals = () =>
  api.get('/api/v1/proposals/all');

export const approveProposal = (proposalId) =>
  api.put(`/api/v1/proposals/approve/${proposalId}`);

export const rejectProposal = (proposalId) =>
  api.put(`/api/v1/proposals/reject/${proposalId}`);

export const updateProposalStatus = (proposalId, status) =>
  api.put(`/api/v1/proposals/status/${proposalId}/${status}`);

export const getProposalsByStatus = (status) =>
  api.get(`/api/v1/proposals/status/${status}`);


export const makePayment = (paymentData) =>
  api.post('/api/v1/payments/pay', paymentData);

export const getPaymentByProposal = (proposalId) =>
  api.get(`/api/v1/payments/proposal/${proposalId}`);

export const getAllPayments = () =>
  api.get('/api/v1/payments/all');

export const getPaymentsByStatus = (status) =>
  api.get(`/api/v1/payments/status/${status}`);


export const fileClaim = (claimData) =>
  api.post('/api/v1/claims/file', claimData);

export const getClaimById = (claimId) =>
  api.get(`/api/v1/claims/${claimId}`);

export const getClaimsByUser = (userId) =>
  api.get(`/api/v1/claims/user/${userId}`);

export const getAllClaims = () =>
  api.get('/api/v1/claims/all');

export const approveClaim = (claimId) =>
  api.put(`/api/v1/claims/approve/${claimId}`);

export const rejectClaim = (claimId) =>
  api.put(`/api/v1/claims/reject/${claimId}`);

export const processClaimPayment = (claimId) =>
  api.put(`/api/v1/claims/process-payment/${claimId}`);

export const getClaimsByStatus = (status) =>
  api.get(`/api/v1/claims/status/${status}`);


export const getDocumentByProposal = (proposalId) =>
  api.get(`/api/v1/documents/proposal/${proposalId}`);

export const getDocumentsByUser = (userId) =>
  api.get(`/api/v1/documents/user/${userId}`);

export const getAllDocuments = () =>
  api.get('/api/v1/documents/all');

export const generateDocument = (docData) =>
  api.post('/api/v1/documents/generate', docData);


export const recordOfficerAction = (actionData) =>
  api.post('/api/v1/officer-actions/record', actionData);

export const getActionsByProposal = (proposalId) =>
  api.get(`/api/v1/officer-actions/proposal/${proposalId}`);


export const sendQuoteEmail = (proposalId) =>
  api.post(`/api/v1/email/send-quote/${proposalId}`);

export const sendPolicyEmail = (proposalId) =>
  api.post(`/api/v1/email/send-policy/${proposalId}`);

export const sendPremiumReminder = (proposalId) =>
  api.post(`/api/v1/email/premium-reminder/${proposalId}`);