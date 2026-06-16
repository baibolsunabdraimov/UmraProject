/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PaymentStatus {
  Unpaid = 0,
  PartiallyPaid = 1,
  Paid = 2
}

export enum GroupStatus {
  Planning = 0,
  Active = 1,
  Completed = 2
}

export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  ticketPrice: number;
  pilgrims?: Pilgrim[];
}

export interface UmrahGroup {
  id: number;
  name: string;
  departureDate: string;
  returnDate: string;
  leaderId: number;
  status: GroupStatus;
  maxSeats: number;
  pilgrims?: Pilgrim[];
  meetings?: Meeting[];
}

export interface Meeting {
  id: number;
  title: string;
  date: string;
  location: string;
  groupId: number;
  group?: UmrahGroup;
}

export interface Pilgrim {
  id: number;
  fullName: string;
  passportNumber: string;
  phoneNumber: string;
  groupId: number;
  flightId: number | null;
  paymentStatus: PaymentStatus;
  group?: UmrahGroup;
  flight?: Flight;
}

// DTO and Stats Types
export interface MonthlySales {
  month: number;
  year: number;
  monthName: string;
  revenue: number;
  ticketCount: number;
}

export interface SalesStatsDto {
  monthlySales: MonthlySales[];
  totalRevenue: number;
}

export interface MonthlyPilgrims {
  month: number;
  year: number;
  monthName: string;
  count: number;
}

export interface PilgrimsStatsDto {
  monthlyPilgrims: MonthlyPilgrims[];
  totalPilgrims: number;
}

export interface GroupOccupancyDto {
  groupId: number;
  groupName: string;
  totalSeats: number;
  occupiedSeats: number;
  occupancyPercentage: number;
}

export interface Leader {
  id: number;
  name: string;
  phoneNumber: string;
  experience?: string;
}

export enum RequestStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

export interface UserRequest {
  id: number;
  fullName: string;
  passportNumber: string;
  phoneNumber: string;
  groupId: number;
  status: RequestStatus;
  createdAt: string;
  group?: UmrahGroup;
}
