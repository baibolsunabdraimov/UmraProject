/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Flight, 
  UmrahGroup, 
  Pilgrim, 
  Meeting, 
  SalesStatsDto, 
  PilgrimsStatsDto, 
  GroupOccupancyDto,
  UserRequest,
  RequestStatus,
  Leader
} from '../types';

// Setup custom Axios client configured with base URL
const apiClient = axios.create({
  baseURL: 'https://localhost:61013', // Relative requests are routed to same server
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================================
// API CLIENT FUNCTIONS
// ==========================================================

export const api = {

  approveUserRequest: async (id: number): Promise<void> => {
    // Мы стучимся в специальный эндпоинт /approve, который мы создали на бекенде
    await apiClient.post(`/api/UserRequests/${id}/approve`);
  },
  // Stats
  getSalesStats: async (): Promise<SalesStatsDto> => {
    const res = await apiClient.get<SalesStatsDto>('/api/Stats/sales');
    return res.data;
  },
  getPilgrimsStats: async (): Promise<PilgrimsStatsDto> => {
    const res = await apiClient.get<PilgrimsStatsDto>('/api/Stats/pilgrims');
    return res.data;
  },
  getGroupOccupancy: async (): Promise<GroupOccupancyDto[]> => {
    const res = await apiClient.get<GroupOccupancyDto[]>('/api/Stats/group-occupancy');
    return res.data;
  },

  // Groups
  getGroups: async (): Promise<UmrahGroup[]> => {
    const res = await apiClient.get<UmrahGroup[]>('/api/Groups');
    return res.data;
  },
  createGroup: async (group: Partial<UmrahGroup>): Promise<UmrahGroup> => {
    const res = await apiClient.post<UmrahGroup>('/api/Groups', group);
    return res.data;
  },
  updateGroup: async (id: number, group: Partial<UmrahGroup>): Promise<UmrahGroup> => {
    const res = await apiClient.put<UmrahGroup>(`/api/Groups/${id}`, group);
    return res.data;
  },
  deleteGroup: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Groups/${id}`);
  },
  addPilgrimToGroup: async (groupId: number, pilgrimId: number): Promise<Pilgrim> => {
    const res = await apiClient.post<Pilgrim>(`/api/Groups/${groupId}/pilgrims/${pilgrimId}`);
    return res.data;
  },
  getGroupAvailableSeats: async (id: number): Promise<number> => {
    const res = await apiClient.get<number>(`/api/Groups/${id}/available-seats`);
    return res.data;
  },

  // Flights
  getFlights: async (): Promise<Flight[]> => {
    const res = await apiClient.get<Flight[]>('/api/Flights');
    return res.data;
  },
  getAvailableFlights: async (): Promise<Flight[]> => {
    const res = await apiClient.get<Flight[]>('/api/Flights/available');
    return res.data;
  },
  createFlight: async (flight: Partial<Flight>): Promise<Flight> => {
    const res = await apiClient.post<Flight>('/api/Flights', flight);
    return res.data;
  },
  updateFlight: async (id: number, flight: Partial<Flight>): Promise<Flight> => {
    const res = await apiClient.put<Flight>(`/api/Flights/${id}`, flight);
    return res.data;
  },
  deleteFlight: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Flights/${id}`);
  },

  // Pilgrims
  getPilgrims: async (): Promise<Pilgrim[]> => {
    const res = await apiClient.get<Pilgrim[]>('/api/Pilgrims');
    return res.data;
  },
  getPilgrimsByGroup: async (groupId: number): Promise<Pilgrim[]> => {
    const res = await apiClient.get<Pilgrim[]>(`/api/Pilgrims/group/${groupId}`);
    return res.data;
  },
  createPilgrim: async (pilgrim: Partial<Pilgrim>): Promise<Pilgrim> => {
    const res = await apiClient.post<Pilgrim>('/api/Pilgrims', pilgrim);
    return res.data;
  },
  updatePilgrim: async (id: number, pilgrim: Partial<Pilgrim>): Promise<Pilgrim> => {
    const res = await apiClient.put<Pilgrim>(`/api/Pilgrims/${id}`, pilgrim);
    return res.data;
  },
  deletePilgrim: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Pilgrims/${id}`);
  },
  assignFlightToPilgrim: async (payload: { pilgrimId: number; flightId: number }): Promise<Pilgrim> => {
    const res = await apiClient.post<Pilgrim>(`/api/Pilgrims/${payload.pilgrimId}/assign-flight/${payload.flightId}`);
    return res.data;
  },
  removeFlightFromPilgrim: async (pilgrimId: number): Promise<Pilgrim> => {
    const res = await apiClient.post<Pilgrim>(`/api/Pilgrims/${pilgrimId}/remove-flight`);
    return res.data;
  },

  // Meetings
  getMeetings: async (): Promise<Meeting[]> => {
    const res = await apiClient.get<Meeting[]>('/api/Meetings');
    return res.data;
  },
  createMeeting: async (meeting: Partial<Meeting>): Promise<Meeting> => {
    const res = await apiClient.post<Meeting>('/api/Meetings', meeting);
    return res.data;
  },
  updateMeeting: async (id: number, meeting: Partial<Meeting>): Promise<Meeting> => {
    const res = await apiClient.put<Meeting>(`/api/Meetings/${id}`, meeting);
    return res.data;
  },
  deleteMeeting: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Meetings/${id}`);
  },

  // User Requests
  getUserRequests: async (): Promise<UserRequest[]> => {
    const res = await apiClient.get<UserRequest[]>('/api/UserRequests');
    return res.data;
  },
  createUserRequest: async (req: Partial<UserRequest>): Promise<UserRequest> => {
    const res = await apiClient.post<UserRequest>('/api/UserRequests', req);
    return res.data;
  },
  updateUserRequestStatus: async (payload: { id: number; status: RequestStatus }): Promise<UserRequest> => {
    const res = await apiClient.put<UserRequest>(`/api/UserRequests/${payload.id}/status`, { status: payload.status });
    return res.data;
  },
  deleteUserRequest: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/UserRequests/${id}`);
  },
  // Leaders (Ажы башчы)
  getLeaders: async (): Promise<Leader[]> => {
    const res = await apiClient.get<Leader[]>('/api/Leaders');
    return res.data;
  },
  createLeader: async (leader: Partial<Leader>): Promise<Leader> => {
    const res = await apiClient.post<Leader>('/api/Leaders', leader);
    return res.data;
  },
  updateLeader: async (payload: { id: number; data: Partial<Leader> }): Promise<Leader> => {
    const res = await apiClient.put<Leader>(`/api/Leaders/${payload.id}`, payload.data);
    return res.data;
  },
  deleteLeader: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Leaders/${id}`);
  },
};

// ==========================================================
// TANSTACK REACT QUERY CUSTOM HOOKS
// ==========================================================

// Stats hooks
export function useSalesStats() {
  return useQuery({
    queryKey: ['stats', 'sales'],
    queryFn: api.getSalesStats,
  });
}

export function usePilgrimsStats() {
  return useQuery({
    queryKey: ['stats', 'pilgrims'],
    queryFn: api.getPilgrimsStats,
  });
}

export function useGroupOccupancy() {
  return useQuery({
    queryKey: ['stats', 'occupancy'],
    queryFn: api.getGroupOccupancy,
  });
}

// Groups hooks
export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: api.getGroups,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: Partial<UmrahGroup> }) => 
      api.updateGroup(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Flights hooks
export function useFlights() {
  return useQuery({
    queryKey: ['flights'],
    queryFn: api.getFlights,
  });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: Partial<Flight> }) => 
      api.updateFlight(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
    },
  });
}

export function useDeleteFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Pilgrims hooks
export function usePilgrims() {
  return useQuery({
    queryKey: ['pilgrims'],
    queryFn: api.getPilgrims,
  });
}

export function useCreatePilgrim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createPilgrim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdatePilgrim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: Partial<Pilgrim> }) => 
      api.updatePilgrim(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeletePilgrim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deletePilgrim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useAssignFlightToPilgrim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.assignFlightToPilgrim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useRemoveFlightFromPilgrim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.removeFlightFromPilgrim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Meetings hooks
export function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: api.getMeetings,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

// UserRequests hooks
export function useUserRequests() {
  return useQuery({
    queryKey: ['userRequests'],
    queryFn: api.getUserRequests,
  });
}

export function useCreateUserRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
    },
  });
}
export function useApproveUserRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.approveUserRequest,
    onSuccess: () => {
      // Обновляем всё: и заявки, и список паломников, и статистику (графики)
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateUserRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateUserRequestStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pilgrims'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeleteUserRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
    },
  });
}

// Leaders hooks
export function useLeaders() {
  return useQuery({
    queryKey: ['leaders'],
    queryFn: api.getLeaders,
  });
}

export function useCreateLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createLeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaders'] });
    },
  });
}

export function useUpdateLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateLeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaders'] });
      // Обновляем группы, так как там отображаются имена лидеров
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useDeleteLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteLeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaders'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
