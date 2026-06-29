export type EventType = "private" | "corporate" | "class";

export interface EventEstimate {
  bartenders: number;
  serviceHours: number;
  barStyle: string;
  guestRange: string;
}

export function estimateEvent(guestCount: number, eventType: EventType): EventEstimate {
  if (eventType === "class") {
    return {
      bartenders: 1,
      serviceHours: 2,
      barStyle: "Instructional bar setup with tasting stations",
      guestRange: `${guestCount} participants`,
    };
  }

  if (eventType === "corporate") {
    const bartenders = guestCount <= 75 ? 2 : guestCount <= 150 ? 3 : 4;
    const hours = guestCount <= 50 ? 3 : guestCount <= 100 ? 4 : 5;
    return {
      bartenders,
      serviceHours: hours,
      barStyle: "Premium branded bar with signature cocktails",
      guestRange: `${guestCount} guests`,
    };
  }

  // private
  const bartenders = guestCount <= 40 ? 1 : guestCount <= 80 ? 2 : 3;
  const hours = guestCount <= 30 ? 3 : guestCount <= 60 ? 4 : 5;
  return {
    bartenders,
    serviceHours: hours,
    barStyle: guestCount <= 40 ? "Intimate craft cocktail bar" : "Full mobile bar experience",
    guestRange: `${guestCount} guests`,
  };
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  private: "Private Party",
  corporate: "Corporate Event",
  class: "Cocktail Class",
};
