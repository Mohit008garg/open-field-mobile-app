/** Placeholder content used across the post-login screens. */
import type {
  Academy,
  Connection,
  EventItem,
  Message,
  Opportunity,
  Player,
} from '@/types';

export const me = {
  name: 'Arjun Sharma',
  role: 'Football Player',
  location: 'Bengaluru, Karnataka',
  verified: true,
  stats: { matches: 45, goals: 23, assists: 12, height: "5'10\"", position: 'Midfielder' },
  about:
    'Passionate football player with a strong drive to improve and compete at the highest level. Looking for opportunities to join a professional academy and take my game to the next level.',
  details: {
    'Date of Birth': '12 May 2004',
    'Playing Level': 'State',
    'Preferred Foot': 'Right',
  },
};

export const recommendedPlayers: Player[] = [
  { name: 'Arjun Mehta', role: 'Midfielder', age: 19, location: 'Bengaluru, Karnataka' },
  { name: 'Rohan Das', role: 'Striker', age: 17, location: 'Mumbai, Maharashtra' },
  { name: 'Samar Khan', role: 'Goalkeeper', age: 18, location: 'Delhi' },
];

export const academies: Academy[] = [
  { name: 'Elite Football Academy', location: 'Bengaluru, Karnataka', rating: 4.8 },
  { name: 'Rising Stars Academy', location: 'Mumbai, Maharashtra', rating: 4.7 },
];

export const connections: Connection[] = [
  { name: 'Vikram Singh', role: 'Cricket Coach', status: 'Connected' },
  { name: 'Neha Patel', role: 'Football Player', status: 'Connected' },
  { name: 'Amit Verma', role: 'Scout', status: 'Connected' },
  { name: 'Rahul Verma', role: 'Football Player', status: 'Connected' },
  { name: 'Sneha Iyer', role: 'Athlete', status: 'Connected' },
  { name: 'Rohit Malhotra', role: 'Strength Coach', status: 'Connected' },
];

export const opportunities: Opportunity[] = [
  {
    title: 'U-19 Football Trials',
    org: 'Dream FC Academy',
    location: 'Bengaluru, Karnataka',
    date: '20 May 2024',
    tag: 'Trial',
  },
  {
    title: 'Sports Scholarship Program',
    org: 'National Sports Foundation',
    location: 'India (Remote)',
    date: '31 May 2024',
    tag: 'Scholarship',
  },
  {
    title: 'Assistant Coach — Youth Team',
    org: 'Elite Football Academy',
    location: 'Mumbai, Maharashtra',
    date: '10 Jun 2024',
    tag: 'Job',
  },
];

export const events: EventItem[] = [
  { month: 'MAY', day: '20', title: 'U-18 State Football Championship', location: 'Pune, Maharashtra', dates: '20 - 28 May 2024' },
  { month: 'JUN', day: '05', title: 'Youth Basketball Tournament', location: 'Bengaluru, Karnataka', dates: '5 - 7 June 2024' },
  { month: 'JUN', day: '15', title: 'Cricket Talent Hunt Camp', location: 'Pune, Maharashtra', dates: '15 - 17 June 2024' },
  { month: 'JUL', day: '01', title: 'National Athletics Meet', location: 'New Delhi', dates: '1 - 3 July 2024' },
];

export const messages: Message[] = [
  { name: 'Vikram Singh', text: "Thanks for connecting! Let's discuss…", time: '10:30 AM', unread: true },
  { name: 'Neha Patel', text: 'Great game yesterday!', time: '9:15 AM', unread: false },
  { name: 'Rahul Verma', text: 'Are you available for practice…', time: 'Yesterday', unread: false },
  { name: 'Amit Verma', text: 'We have a trial next week.', time: 'Yesterday', unread: false },
  { name: 'Coach Arvind', text: 'Please share your recent stats.', time: '2d ago', unread: false },
  { name: 'Sneha Iyer', text: "Let's catch up soon!", time: '3d ago', unread: false },
];
