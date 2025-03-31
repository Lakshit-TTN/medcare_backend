const DEFAULT_SLOTS = {
    morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"],
    afternoon: ["3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"],
  };
  
  export const getAvailableSlots = async (doctor_id) => {
      try {
          return { 
              morning: DEFAULT_SLOTS.morning, 
              afternoon: DEFAULT_SLOTS.afternoon
          };
      } catch (error) {
          console.error("Error fetching available slots:", error);
          throw error;
      }
  };
  