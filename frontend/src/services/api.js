import apiClient from './apiClient';

const unwrap = (response) => response?.data;

export const fetchStocks = (params = {}) =>
  apiClient.get('/stocks', { params }).then(unwrap);

export const fetchContestLeaderboard = (contestId) =>
  apiClient.get(`/leaderboard/${contestId}`).then(unwrap);

export const fetchMyContests = () =>
  apiClient.get('/contests/user').then(unwrap);

export const fetchTeamsByContest = (contestId) =>
  apiClient.get(`/contests/${contestId}/teams`).then(unwrap);

export const fetchTeamById = (teamId) =>
  apiClient.get(`/teams/${teamId}`).then(unwrap);
