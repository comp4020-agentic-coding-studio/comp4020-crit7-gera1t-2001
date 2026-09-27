// Fixed lists shared by the booking form and the API route's validation, so
// they can't drift apart.
export const ROOMS = ["Chifley 2.01", "Chifley 2.02", "Hancock 3.11"] as const;
export const SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00"] as const;
