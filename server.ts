import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { PaymentStatus, GroupStatus, Flight, UmrahGroup, Meeting, Pilgrim, RequestStatus, UserRequest } from './src/types';

const app = express();
app.use(express.json());

const PORT = 3000;

// Pre-seeded database state
let flights: Flight[] = [
  {
    id: 1,
    airline: 'Saudia',
    flightNumber: 'SV-340',
    departureTime: '2026-06-18T09:30:00.000Z',
    arrivalTime: '2026-06-18T14:45:00.000Z',
    ticketPrice: 850
  },
  {
    id: 2,
    airline: 'Turkish Airlines',
    flightNumber: 'TK-421',
    departureTime: '2026-06-20T11:15:00.000Z',
    arrivalTime: '2026-06-20T18:30:00.000Z',
    ticketPrice: 920
  },
  {
    id: 3,
    airline: 'flynas',
    flightNumber: 'XY-215',
    departureTime: '2026-07-02T16:00:00.000Z',
    arrivalTime: '2026-07-02T21:10:00.000Z',
    ticketPrice: 680
  },
  {
    id: 4,
    airline: 'Qatar Airways',
    flightNumber: 'QR-312',
    departureTime: '2026-07-10T22:45:00.000Z',
    arrivalTime: '2026-07-11T05:30:00.000Z',
    ticketPrice: 890
  },
  {
    id: 5,
    airline: 'Air Astana',
    flightNumber: 'KC-133',
    departureTime: '2026-08-05T04:20:00.000Z',
    arrivalTime: '2026-08-05T10:50:00.000Z',
    ticketPrice: 750
  }
];

let groups: UmrahGroup[] = [
  {
    id: 1,
    name: 'Ихсан Июнь (Saudia)',
    departureDate: '2026-06-18T00:00:00.000Z',
    returnDate: '2026-07-02T00:00:00.000Z',
    leaderId: 101,
    status: GroupStatus.Active,
    maxSeats: 25
  },
  {
    id: 2,
    name: 'Ан-Нур Весна (TK)',
    departureDate: '2026-06-20T00:00:00.000Z',
    returnDate: '2026-07-04T00:00:00.000Z',
    leaderId: 102,
    status: GroupStatus.Active,
    maxSeats: 30
  },
  {
    id: 3,
    name: 'Умра Рамадан flynas',
    departureDate: '2026-07-02T00:00:00.000Z',
    returnDate: '2026-07-16T00:00:00.000Z',
    leaderId: 103,
    status: GroupStatus.Planning,
    maxSeats: 20
  },
  {
    id: 4,
    name: 'Караван Медиа Август',
    departureDate: '2026-08-05T00:00:00.000Z',
    returnDate: '2026-08-20T00:00:00.000Z',
    leaderId: 104,
    status: GroupStatus.Planning,
    maxSeats: 15
  }
];

let pilgrims: Pilgrim[] = [
  {
    id: 1,
    fullName: 'Абдуллах Саидов',
    passportNumber: 'AC1234567',
    phoneNumber: '+996 555 123 456',
    groupId: 1,
    flightId: 1,
    paymentStatus: PaymentStatus.Paid
  },
  {
    id: 2,
    fullName: 'Алибек Маматов',
    passportNumber: 'AC7654321',
    phoneNumber: '+996 707 987 654',
    groupId: 1,
    flightId: 1,
    paymentStatus: PaymentStatus.Paid
  },
  {
    id: 3,
    fullName: 'Аиша Осмонова',
    passportNumber: 'AC2233445',
    phoneNumber: '+996 500 445 566',
    groupId: 1,
    flightId: 1,
    paymentStatus: PaymentStatus.PartiallyPaid
  },
  {
    id: 4,
    fullName: 'Сулейман Шерматов',
    passportNumber: 'AC8899001',
    phoneNumber: '+996 777 554 433',
    groupId: 1,
    flightId: null,
    paymentStatus: PaymentStatus.Unpaid
  },
  {
    id: 5,
    fullName: 'Фатима Юсупова',
    passportNumber: 'AC9988112',
    phoneNumber: '+996 701 112 233',
    groupId: 2,
    flightId: 2,
    paymentStatus: PaymentStatus.Paid
  },
  {
    id: 6,
    fullName: 'Рустам Каримов',
    passportNumber: 'AC5544332',
    phoneNumber: '+996 550 998 877',
    groupId: 2,
    flightId: 2,
    paymentStatus: PaymentStatus.PartiallyPaid
  },
  {
    id: 7,
    fullName: 'Мухаммад Садыков',
    passportNumber: 'AC1122334',
    phoneNumber: '+996 700 334 455',
    groupId: 2,
    flightId: null,
    paymentStatus: PaymentStatus.Paid
  },
  {
    id: 8,
    fullName: 'Зарина Бакирова',
    passportNumber: 'AC7788992',
    phoneNumber: '+996 505 556 677',
    groupId: 2,
    flightId: 2,
    paymentStatus: PaymentStatus.Unpaid
  },
  {
    id: 9,
    fullName: 'Данияр Исаев',
    passportNumber: 'AC4455667',
    phoneNumber: '+996 709 887 766',
    groupId: 3,
    flightId: 3,
    paymentStatus: PaymentStatus.Paid
  },
  {
    id: 10,
    fullName: 'Нурислам Осмонов',
    passportNumber: 'AC3322114',
    phoneNumber: '+996 772 121 212',
    groupId: 3,
    flightId: null,
    paymentStatus: PaymentStatus.Unpaid
  },
  {
    id: 11,
    fullName: 'Гульбара Салиева',
    passportNumber: 'AC1020304',
    phoneNumber: '+996 552 405 060',
    groupId: 4,
    flightId: null,
    paymentStatus: PaymentStatus.PartiallyPaid
  },
  {
    id: 12,
    fullName: 'Бакытбек Асанов',
    passportNumber: 'AC1203948',
    phoneNumber: '+996 704 203 104',
    groupId: 4,
    flightId: null,
    paymentStatus: PaymentStatus.Unpaid
  }
];

let meetings: Meeting[] = [
  {
    id: 1,
    title: 'Инструктаж перед вылетом (Офис)',
    date: '2026-06-16T15:00:00.000Z',
    location: 'Основной конференц-зал, г. Бишкек',
    groupId: 1
  },
  {
    id: 2,
    title: 'Выдача паспортов и виз',
    date: '2026-06-17T10:00:00.000Z',
    location: 'Филиал Восток, ул. Киевская 112',
    groupId: 1
  },
  {
    id: 3,
    title: 'Сбор паломников в аэропорту Манас',
    date: '2026-06-18T05:30:00.000Z',
    location: 'Аэропорт Манас, терминал 2',
    groupId: 1
  },
  {
    id: 4,
    title: 'Организационная встреча группы TK',
    date: '2026-06-19T14:00:00.000Z',
    location: 'Офис Ихсан, каб. 302',
    groupId: 2
  }
];

let userRequests: UserRequest[] = [
  {
    id: 1,
    fullName: 'Марат Оспанов',
    passportNumber: 'AC8811223',
    phoneNumber: '+996 700 889 900',
    groupId: 3,
    status: RequestStatus.Pending,
    createdAt: '2026-06-14T09:00:00.000Z'
  },
  {
    id: 2,
    fullName: 'Динара Кадырова',
    passportNumber: 'AC5566778',
    phoneNumber: '+996 550 443 322',
    groupId: 4,
    status: RequestStatus.Pending,
    createdAt: '2026-06-15T08:30:00.000Z'
  }
];

function hydrateUserRequest(req: UserRequest): UserRequest {
  const group = groups.find(g => g.id === req.groupId);
  return {
    ...req,
    group: group ? { id: group.id, name: group.name, departureDate: group.departureDate, returnDate: group.returnDate, leaderId: group.leaderId, status: group.status, maxSeats: group.maxSeats } : undefined
  };
}

// Helper to hydrate Pilgrim relationships
function hydratePilgrim(pilgrim: Pilgrim): Pilgrim {
  const group = groups.find(g => g.id === pilgrim.groupId);
  const flight = flights.find(f => f.id === pilgrim.flightId);
  return {
    ...pilgrim,
    group: group ? { id: group.id, name: group.name, departureDate: group.departureDate, returnDate: group.returnDate, leaderId: group.leaderId, status: group.status, maxSeats: group.maxSeats } : undefined,
    flight: flight ? { id: flight.id, airline: flight.airline, flightNumber: flight.flightNumber, departureTime: flight.departureTime, arrivalTime: flight.arrivalTime, ticketPrice: flight.ticketPrice } : undefined
  };
}

// ----------------------------------------------------
// FLIGHTS API
// ----------------------------------------------------
app.get('/api/Flights', (req, res) => {
  const response = flights.map(f => ({
    ...f,
    pilgrims: pilgrims.filter(p => p.flightId === f.id).map(hydratePilgrim)
  }));
  res.json(response);
});

app.post('/api/Flights', (req, res) => {
  const { airline, flightNumber, departureTime, arrivalTime, ticketPrice } = req.body;
  const newFlight: Flight = {
    id: flights.length > 0 ? Math.max(...flights.map(f => f.id)) + 1 : 1,
    airline: airline || 'Unknown',
    flightNumber: flightNumber || 'FN-000',
    departureTime: departureTime || new Date().toISOString(),
    arrivalTime: arrivalTime || new Date().toISOString(),
    ticketPrice: Number(ticketPrice) || 0
  };
  flights.push(newFlight);
  res.status(201).json(newFlight);
});

app.get('/api/Flights/available', (req, res) => {
  // All flights are available for booking in our context
  res.json(flights);
});

app.get('/api/Flights/:id', (req, res) => {
  const flight = flights.find(f => f.id === Number(req.params.id));
  if (!flight) return res.status(404).json({ message: 'Flight not found' });
  res.json({
    ...flight,
    pilgrims: pilgrims.filter(p => p.flightId === flight.id).map(hydratePilgrim)
  });
});

app.put('/api/Flights/:id', (req, res) => {
  const flightId = Number(req.params.id);
  const index = flights.findIndex(f => f.id === flightId);
  if (index === -1) return res.status(404).json({ message: 'Flight not found' });

  const { airline, flightNumber, departureTime, arrivalTime, ticketPrice } = req.body;
  flights[index] = {
    ...flights[index],
    airline: airline !== undefined ? airline : flights[index].airline,
    flightNumber: flightNumber !== undefined ? flightNumber : flights[index].flightNumber,
    departureTime: departureTime !== undefined ? departureTime : flights[index].departureTime,
    arrivalTime: arrivalTime !== undefined ? arrivalTime : flights[index].arrivalTime,
    ticketPrice: ticketPrice !== undefined ? Number(ticketPrice) : flights[index].ticketPrice
  };
  res.json(flights[index]);
});

app.delete('/api/Flights/:id', (req, res) => {
  const flightId = Number(req.params.id);
  const index = flights.findIndex(f => f.id === flightId);
  if (index === -1) return res.status(404).json({ message: 'Flight not found' });
  
  // Detach flight from pilgrims
  pilgrims = pilgrims.map(p => p.flightId === flightId ? { ...p, flightId: null } : p);
  flights.splice(index, 1);
  res.json({ message: 'Flight deleted successfully' });
});

// ----------------------------------------------------
// GROUPS API
// ----------------------------------------------------
app.get('/api/Groups', (req, res) => {
  const response = groups.map(g => ({
    ...g,
    pilgrims: pilgrims.filter(p => p.groupId === g.id).map(hydratePilgrim),
    meetings: meetings.filter(m => m.groupId === g.id)
  }));
  res.json(response);
});

app.post('/api/Groups', (req, res) => {
  const { name, departureDate, returnDate, leaderId, status, maxSeats } = req.body;
  const newGroup: UmrahGroup = {
    id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
    name: name || 'Новая группа',
    departureDate: departureDate || new Date().toISOString(),
    returnDate: returnDate || new Date().toISOString(),
    leaderId: Number(leaderId) || 101,
    status: status !== undefined ? Number(status) : GroupStatus.Planning,
    maxSeats: Number(maxSeats) || 20
  };
  groups.push(newGroup);
  res.status(201).json(newGroup);
});

app.get('/api/Groups/:id', (req, res) => {
  const group = groups.find(g => g.id === Number(req.params.id));
  if (!group) return res.status(404).json({ message: 'Group not found' });
  res.json({
    ...group,
    pilgrims: pilgrims.filter(p => p.groupId === group.id).map(hydratePilgrim),
    meetings: meetings.filter(m => m.groupId === group.id)
  });
});

app.put('/api/Groups/:id', (req, res) => {
  const groupId = Number(req.params.id);
  const index = groups.findIndex(g => g.id === groupId);
  if (index === -1) return res.status(404).json({ message: 'Group not found' });

  const { name, departureDate, returnDate, leaderId, status, maxSeats } = req.body;
  groups[index] = {
    ...groups[index],
    name: name !== undefined ? name : groups[index].name,
    departureDate: departureDate !== undefined ? departureDate : groups[index].departureDate,
    returnDate: returnDate !== undefined ? returnDate : groups[index].returnDate,
    leaderId: leaderId !== undefined ? Number(leaderId) : groups[index].leaderId,
    status: status !== undefined ? Number(status) : groups[index].status,
    maxSeats: maxSeats !== undefined ? Number(maxSeats) : groups[index].maxSeats
  };
  res.json(groups[index]);
});

app.delete('/api/Groups/:id', (req, res) => {
  const groupId = Number(req.params.id);
  const index = groups.findIndex(g => g.id === groupId);
  if (index === -1) return res.status(404).json({ message: 'Group not found' });

  // Move pilgrims in this group to first group or delete?
  // We'll delete pilgrims or set groupId to null if wanted. Let's filter out or keep pilgrims.
  // We will reassign them to a dummy group or delete their group reference.
  pilgrims = pilgrims.filter(p => p.groupId !== groupId);
  meetings = meetings.filter(m => m.groupId !== groupId);
  groups.splice(index, 1);
  res.json({ message: 'Group deleted successfully' });
});

app.post('/api/Groups/:groupId/pilgrims/:pilgrimId', (req, res) => {
  const groupId = Number(req.params.groupId);
  const pilgrimId = Number(req.params.pilgrimId);
  const pilgrim = pilgrims.find(p => p.id === pilgrimId);
  const group = groups.find(g => g.id === groupId);

  if (!pilgrim) return res.status(404).json({ message: 'Pilgrim not found' });
  if (!group) return res.status(404).json({ message: 'Group not found' });

  const occupied = pilgrims.filter(p => p.groupId === groupId).length;
  if (occupied >= group.maxSeats) {
    return res.status(400).json({ message: 'Группа уже заполнена' });
  }

  pilgrim.groupId = groupId;
  res.json(hydratePilgrim(pilgrim));
});

app.get('/api/Groups/:id/available-seats', (req, res) => {
  const group = groups.find(g => g.id === Number(req.params.id));
  if (!group) return res.status(404).json({ message: 'Group not found' });
  const occupied = pilgrims.filter(p => p.groupId === group.id).length;
  res.json(Math.max(0, group.maxSeats - occupied));
});

// ----------------------------------------------------
// MEETINGS API
// ----------------------------------------------------
app.get('/api/Meetings', (req, res) => {
  const response = meetings.map(m => ({
    ...m,
    group: groups.find(g => g.id === m.groupId)
  }));
  res.json(response);
});

app.post('/api/Meetings', (req, res) => {
  const { title, date, location, groupId } = req.body;
  const newMeeting: Meeting = {
    id: meetings.length > 0 ? Math.max(...meetings.map(m => m.id)) + 1 : 1,
    title: title || 'Новая встреча',
    date: date || new Date().toISOString(),
    location: location || 'Офис компании',
    groupId: Number(groupId) || 1
  };
  meetings.push(newMeeting);
  res.status(201).json(newMeeting);
});

app.get('/api/Meetings/:id', (req, res) => {
  const meeting = meetings.find(m => m.id === Number(req.params.id));
  if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
  res.json({
    ...meeting,
    group: groups.find(g => g.id === meeting.groupId)
  });
});

app.put('/api/Meetings/:id', (req, res) => {
  const meetingId = Number(req.params.id);
  const index = meetings.findIndex(m => m.id === meetingId);
  if (index === -1) return res.status(404).json({ message: 'Meeting not found' });

  const { title, date, location, groupId } = req.body;
  meetings[index] = {
    ...meetings[index],
    title: title !== undefined ? title : meetings[index].title,
    date: date !== undefined ? date : meetings[index].date,
    location: location !== undefined ? location : meetings[index].location,
    groupId: groupId !== undefined ? Number(groupId) : meetings[index].groupId
  };
  res.json(meetings[index]);
});

app.delete('/api/Meetings/:id', (req, res) => {
  const meetingId = Number(req.params.id);
  const index = meetings.findIndex(m => m.id === meetingId);
  if (index === -1) return res.status(404).json({ message: 'Meeting not found' });
  meetings.splice(index, 1);
  res.json({ message: 'Meeting deleted successfully' });
});

app.get('/api/Meetings/group/:groupId', (req, res) => {
  const gId = Number(req.params.groupId);
  const groupMeetings = meetings.filter(m => m.groupId === gId).map(m => ({
    ...m,
    group: groups.find(g => g.id === m.groupId)
  }));
  res.json(groupMeetings);
});

// ----------------------------------------------------
// PILGRIMS API
// ----------------------------------------------------
app.get('/api/Pilgrims', (req, res) => {
  res.json(pilgrims.map(hydratePilgrim));
});

app.post('/api/Pilgrims', (req, res) => {
  const { fullName, passportNumber, phoneNumber, groupId, flightId, paymentStatus } = req.body;
  const newPilgrim: Pilgrim = {
    id: pilgrims.length > 0 ? Math.max(...pilgrims.map(p => p.id)) + 1 : 1,
    fullName: fullName || 'Новый Паломник',
    passportNumber: passportNumber || 'AC0000000',
    phoneNumber: phoneNumber || '+996 555 000 000',
    groupId: Number(groupId) || 1,
    flightId: flightId ? Number(flightId) : null,
    paymentStatus: paymentStatus !== undefined ? Number(paymentStatus) : PaymentStatus.Unpaid
  };
  pilgrims.push(newPilgrim);
  res.status(201).json(hydratePilgrim(newPilgrim));
});

app.get('/api/Pilgrims/group/:groupId', (req, res) => {
  const gId = Number(req.params.groupId);
  res.json(pilgrims.filter(p => p.groupId === gId).map(hydratePilgrim));
});

app.get('/api/Pilgrims/:id', (req, res) => {
  const pilgrim = pilgrims.find(p => p.id === Number(req.params.id));
  if (!pilgrim) return res.status(404).json({ message: 'Pilgrim not found' });
  res.json(hydratePilgrim(pilgrim));
});

app.put('/api/Pilgrims/:id', (req, res) => {
  const pId = Number(req.params.id);
  const index = pilgrims.findIndex(p => p.id === pId);
  if (index === -1) return res.status(404).json({ message: 'Pilgrim not found' });

  const { fullName, passportNumber, phoneNumber, groupId, flightId, paymentStatus } = req.body;
  pilgrims[index] = {
    ...pilgrims[index],
    fullName: fullName !== undefined ? fullName : pilgrims[index].fullName,
    passportNumber: passportNumber !== undefined ? passportNumber : pilgrims[index].passportNumber,
    phoneNumber: phoneNumber !== undefined ? phoneNumber : pilgrims[index].phoneNumber,
    groupId: groupId !== undefined ? Number(groupId) : pilgrims[index].groupId,
    flightId: flightId !== undefined ? (flightId ? Number(flightId) : null) : pilgrims[index].flightId,
    paymentStatus: paymentStatus !== undefined ? Number(paymentStatus) : pilgrims[index].paymentStatus
  };
  res.json(hydratePilgrim(pilgrims[index]));
});

app.delete('/api/Pilgrims/:id', (req, res) => {
  const pId = Number(req.params.id);
  const index = pilgrims.findIndex(p => p.id === pId);
  if (index === -1) return res.status(404).json({ message: 'Pilgrim not found' });
  pilgrims.splice(index, 1);
  res.json({ message: 'Pilgrim deleted' });
});

app.post('/api/Pilgrims/:pilgrimId/assign-flight/:flightId', (req, res) => {
  const pilgrimId = Number(req.params.pilgrimId);
  const flightId = Number(req.params.flightId);
  
  const pilgrim = pilgrims.find(p => p.id === pilgrimId);
  const flight = flights.find(f => f.id === flightId);

  if (!pilgrim) return res.status(404).json({ message: 'Pilgrim not found' });
  if (!flight) return res.status(404).json({ message: 'Flight not found' });

  pilgrim.flightId = flightId;
  res.json(hydratePilgrim(pilgrim));
});

app.post('/api/Pilgrims/:pilgrimId/remove-flight', (req, res) => {
  const pilgrimId = Number(req.params.pilgrimId);
  const pilgrim = pilgrims.find(p => p.id === pilgrimId);

  if (!pilgrim) return res.status(404).json({ message: 'Pilgrim not found' });

  pilgrim.flightId = null;
  res.json(hydratePilgrim(pilgrim));
});

// ----------------------------------------------------
// USER REQUESTS API
// ----------------------------------------------------
app.get('/api/UserRequests', (req, res) => {
  res.json(userRequests.map(hydrateUserRequest));
});

app.post('/api/UserRequests', (req, res) => {
  const { fullName, passportNumber, phoneNumber, groupId } = req.body;
  if (!fullName || !passportNumber || !phoneNumber || !groupId) {
    return res.status(400).json({ message: 'Пожалуйста, заполните все обязательные поля' });
  }

  const newRequest: UserRequest = {
    id: userRequests.length > 0 ? Math.max(...userRequests.map(r => r.id)) + 1 : 1,
    fullName: fullName,
    passportNumber: (passportNumber || '').trim().toUpperCase(),
    phoneNumber: phoneNumber || '+996 555 000 000',
    groupId: Number(groupId) || 1,
    status: RequestStatus.Pending,
    createdAt: new Date().toISOString()
  };
  userRequests.push(newRequest);
  res.status(201).json(hydrateUserRequest(newRequest));
});

app.put('/api/UserRequests/:id/status', (req, res) => {
  const rId = Number(req.params.id);
  const index = userRequests.findIndex(r => r.id === rId);
  if (index === -1) return res.status(404).json({ message: 'Request not found' });

  const { status } = req.body; // Approved = 1, Rejected = 2
  userRequests[index].status = Number(status);

  // If Approved, automatically register as an official pilgrim if group seats are available
  if (Number(status) === RequestStatus.Approved) {
    const userReq = userRequests[index];
    const group = groups.find(g => g.id === userReq.groupId);
    if (group) {
      const occupied = pilgrims.filter(p => p.groupId === userReq.groupId).length;
      if (occupied >= group.maxSeats) {
        return res.status(400).json({ message: 'Группа заполнена! Не удается одобрить заявку.' });
      }

      // Check if this pilgrim is already registered
      const exists = pilgrims.some(p => p.passportNumber.toUpperCase() === userReq.passportNumber.toUpperCase());
      if (!exists) {
        const newPilgrim: Pilgrim = {
          id: pilgrims.length > 0 ? Math.max(...pilgrims.map(p => p.id)) + 1 : 1,
          fullName: userReq.fullName,
          passportNumber: userReq.passportNumber,
          phoneNumber: userReq.phoneNumber,
          groupId: userReq.groupId,
          flightId: null,
          paymentStatus: PaymentStatus.Unpaid
        };
        pilgrims.push(newPilgrim);
      }
    }
  }

  res.json(hydrateUserRequest(userRequests[index]));
});

app.delete('/api/UserRequests/:id', (req, res) => {
  const rId = Number(req.params.id);
  const index = userRequests.findIndex(r => r.id === rId);
  if (index === -1) return res.status(404).json({ message: 'Request not found' });
  userRequests.splice(index, 1);
  res.json({ message: 'Request deleted' });
});

// ----------------------------------------------------
// STATS API
// ----------------------------------------------------
app.get('/api/Stats/sales', (req, res) => {
  // Generate robust sales stats based on assigned flights/tickets & payments.
  // Each pilgrim with a flight brings revenue = flight.ticketPrice.
  // Let's create monthly sales based on group departureDates.
  // Month names: Июнь (6), Июль (7), Август (8)
  const monthlyDataMap: { [key: string]: { revenue: number, count: number, monthNum: number, yearNum: number } } = {
    'Июнь': { revenue: 0, count: 0, monthNum: 6, yearNum: 2026 },
    'Июль': { revenue: 0, count: 0, monthNum: 7, yearNum: 2026 },
    'Август': { revenue: 0, count: 0, monthNum: 8, yearNum: 2026 }
  };

  // Sum real tickets
  pilgrims.forEach(p => {
    if (p.flightId) {
      const flight = flights.find(f => f.id === p.flightId);
      if (flight) {
        // Find group to attribute month
        const group = groups.find(g => g.id === p.groupId);
        if (group) {
          const depDate = new Date(group.departureDate);
          const monthIndex = depDate.getMonth(); // 0-based
          let mName = 'Июнь';
          if (monthIndex === 6) mName = 'Июль';
          if (monthIndex === 7) mName = 'Август';
          
          monthlyDataMap[mName].revenue += flight.ticketPrice;
          monthlyDataMap[mName].count += 1;
        }
      }
    }
  });

  // Convert to DTO
  const monthlySales = Object.entries(monthlyDataMap).map(([monthName, val]) => ({
    month: val.monthNum,
    year: val.yearNum,
    monthName: monthName,
    revenue: val.revenue,
    ticketCount: val.count
  }));

  const totalRevenue = monthlySales.reduce((sum, item) => sum + item.revenue, 0);

  res.json({
    monthlySales,
    totalRevenue
  });
});

app.get('/api/Stats/pilgrims', (req, res) => {
  // Number of pilgrims per month
  const monthlyPilgrimsMap: { [key: string]: { count: number, monthNum: number, yearNum: number } } = {
    'Июнь': { count: 0, monthNum: 6, yearNum: 2026 },
    'Июль': { count: 0, monthNum: 7, yearNum: 2026 },
    'Август': { count: 0, monthNum: 8, yearNum: 2026 }
  };

  pilgrims.forEach(p => {
    const group = groups.find(g => g.id === p.groupId);
    if (group) {
      const depDate = new Date(group.departureDate);
      const monthIndex = depDate.getMonth();
      let mName = 'Июнь';
      if (monthIndex === 6) mName = 'Июль';
      if (monthIndex === 7) mName = 'Август';
      monthlyPilgrimsMap[mName].count += 1;
    }
  });

  const monthlyPilgrims = Object.entries(monthlyPilgrimsMap).map(([monthName, val]) => ({
    month: val.monthNum,
    year: val.yearNum,
    monthName: monthName,
    count: val.count
  }));

  res.json({
    monthlyPilgrims,
    totalPilgrims: pilgrims.length
  });
});

app.get('/api/Stats/group-occupancy', (req, res) => {
  const list = groups.map(g => {
    const occupied = pilgrims.filter(p => p.groupId === g.id).length;
    return {
      groupId: g.id,
      groupName: g.name,
      totalSeats: g.maxSeats,
      occupiedSeats: occupied,
      occupancyPercentage: Math.round((occupied / g.maxSeats) * 100)
    };
  });
  res.json(list);
});

// Serve assets in development vs production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
