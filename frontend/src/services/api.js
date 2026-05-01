const BASE_URL = 'http://localhost:3001';

async function apiCall(endpoint, method = 'GET', body = null, userId = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (userId) headers['x-user-id'] = String(userId);
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const error = await response.json();
    const err = new Error(error.message || 'API Error');
    err.status = response.status;
    throw err;
  }
  return response.json();
}

export const walletAPI = {
  getByUser: (userId) => apiCall(`/wallets/user/${userId}`, 'GET', null, userId),
  fund: (userId, amount) => apiCall('/wallets/fund', 'POST', { user_id: userId, amount }, userId),
  tryGetByUser: async (userId) => {
    try {
      return await apiCall(`/wallets/user/${userId}`, 'GET', null, userId);
    } catch (e) {
      if (e?.status === 404) return null;
      throw e;
    }
  },
};

export const paymentMethodsAPI = {
  getAll: (userId) => apiCall(`/payment-methods?user_id=${userId}`),
  create: (userId, data) => apiCall('/payment-methods', 'POST', { ...data, user_id: userId }, userId),
  setDefault: (id, userId) => apiCall(`/payment-methods/${id}/set-default`, 'PATCH', { user_id: userId }, userId),
  delete: (id) => apiCall(`/payment-methods/${id}`, 'DELETE'),
};

export const withdrawalsAPI = {
  getAll: () => apiCall('/withdrawals'),
  getOne: (id) => apiCall(`/withdrawals/${id}`),
  create: (userId, data) => apiCall('/withdrawals', 'POST', data, userId),
  approve: (id, userId) => apiCall(`/withdrawals/${id}/approve`, 'PATCH', null, userId),
  reject: (id, userId, note) => apiCall(`/withdrawals/${id}/reject`, 'PATCH', { admin_note: note }, userId),
};

export const transactionsAPI = {
  getAll: (walletId) => apiCall(`/transactions?wallet_id=${walletId}`),
  getOne: (id) => apiCall(`/transactions/${id}`),
};

export const escrowAPI = {
  getAll: () => apiCall('/escrow'),
  getOne: (id) => apiCall(`/escrow/${id}`),
  getByProject: (projectId) => apiCall(`/escrow/project/${projectId}`),
  create: (userId, data) => apiCall('/escrow', 'POST', data, userId),
  fund: (id, userId, amount) => apiCall(`/escrow/${id}/fund`, 'POST', { amount }, userId),
  freeze: (id, userId) => apiCall(`/escrow/${id}/freeze`, 'POST', null, userId),
  close: (id, userId) => apiCall(`/escrow/${id}/close`, 'POST', null, userId),
};

export const milestonePaymentsAPI = {
  getAll: (escrowId) => apiCall(`/milestone-payments?escrow_id=${escrowId}`),
  getOne: (id) => apiCall(`/milestone-payments/${id}`),
  create: (userId, data) => apiCall('/milestone-payments', 'POST', data, userId),
  approve: (id, userId) => apiCall(`/milestone-payments/${id}/approve`, 'PATCH', null, userId),
  reject: (id, userId) => apiCall(`/milestone-payments/${id}/reject`, 'PATCH', null, userId),
  release: (id, userId) => apiCall(`/milestone-payments/${id}/release`, 'PATCH', null, userId),
};

export const invoicesAPI = {
  getAll: (userId) => apiCall(`/invoices?user_id=${userId}`),
  getOne: (id) => apiCall(`/invoices/${id}`),
  create: (data) => apiCall('/invoices', 'POST', data),
};

export const refundsAPI = {
  getAll: () => apiCall('/refunds'),
  getOne: (id) => apiCall(`/refunds/${id}`),
  create: (userId, data) => apiCall('/refunds', 'POST', data, userId),
  approve: (id, userId) => apiCall(`/refunds/${id}/approve`, 'PATCH', { admin_id: userId }, userId),
  reject: (id, userId) => apiCall(`/refunds/${id}/reject`, 'PATCH', { admin_id: userId }, userId),
};

export const currencyAPI = {
  getAll: () => apiCall('/currency'),
  getRate: (base, target) => apiCall(`/currency/rate?base=${base}&target=${target}`),
  create: (userId, data) => apiCall('/currency', 'POST', data, userId),
};

export const notificationsAPI = {
  getAll: (userId) => apiCall(`/notifications?recipient_id=${userId}`),
  markRead: (id) => apiCall(`/notifications/${id}/read`, 'PATCH'),
};