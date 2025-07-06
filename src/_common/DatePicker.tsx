import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import CalendarIcon from '../assests/calender.svg';
import ChevronDownIcon from '../assests/chevron_down.svg';
import ChevronLeftIcon from '../assests/chevron_left.svg';
import ChevronRightIcon from '../assests/chevron_right.svg';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  time?: boolean;
  className?: string;
  timeZone?: string;
  disableDates?: (date: Date) => boolean;
  label?: string;
}


const to12HourFormat = (time: string): string => {
  if (!time) return "Set time";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const to24HourFormat = (time: string): string => {
  if (time === "Set time") return "00:00";
  const [timePart, period] = time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours;
  return `${adjustedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};


const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  minDate, 
  maxDate, 
  time = true, 
  className = "w-full", 
  timeZone,
  disableDates,
  label
}) => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (value) {
      return new Date(value);
    }
    return currentDate;
  });
  const [isOpen, setIsOpen] = useState(false);

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value).getMonth() : currentDate.getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    value ? new Date(value).getFullYear() : new Date().getFullYear()
  );

  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    if (value) {
      const date = moment(value).tz(timeZone || "Asia/Kolkata");
      return to12HourFormat(date.format("HH:mm"));
    }
    return "Set time";
  });

  const [hasInteracted, setHasInteracted] = useState(false);
  const [showError, setShowError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parseIsoDate = (dateString?: string): Date | null => {
    if (!dateString) return null;
    try {
      return new Date(dateString);
    } catch (e) {
      return null;
    }
  };

  const parsedMinDate = minDate ? parseIsoDate(minDate) : null;
  const parsedMaxDate = maxDate ? parseIsoDate(maxDate) : null;

 

  const handleOptionClick = (time: string) => {
    setSelectedTime(time);
    setShowTimeOptions(false); 
  };

  
  const adjustPosition = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom > viewportHeight) {
        ref.current.style.top = `${-rect.height}px`;
      } else {
        ref.current.style.top = "100%"; 
      }
    }
  };

  const generateCalendar = (year: number, month: number) => {
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    let week: (number | null)[] = Array(startDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7 || day === daysInMonth) {
        calendar.push(week);
        week = [];
      }
    }

    return calendar;
  };

 
  const isDateDisabled = (date: Date): boolean => {
    if (disableDates && disableDates(date)) {
      return true;
    }

    const dateToCheck = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateToCheck > today) {
      return true;
    }


    if (!parsedMinDate && !parsedMaxDate) return false;

   
    const minDateTime = parsedMinDate ? new Date(
      parsedMinDate.getFullYear(),
      parsedMinDate.getMonth(),
      parsedMinDate.getDate()
    ).getTime() : null;

  
    const maxDateTime = parsedMaxDate ? new Date(
      parsedMaxDate.getFullYear(),
      parsedMaxDate.getMonth(),
      parsedMaxDate.getDate()
    ).getTime() : null;

    const dateTime = dateToCheck.getTime();

    return (minDateTime !== null && dateTime < minDateTime) ||
      (maxDateTime !== null && dateTime > maxDateTime);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    
  
    if (isDateDisabled(newDate)) {
      return;
    }

   
    setSelectedDate(newDate);
    
    
    const newDateValue = moment(newDate).format('YYYY-MM-DD');
    const timeValue = selectedTime !== 'Set time' 
      ? moment(`${newDateValue} ${to24HourFormat(selectedTime)}`).format()
      : moment(newDateValue).format();
    
    onChange(timeValue);
    
   
    setIsCalendarVisible(false);
  };


  const isPreviousMonthDisabled = (): boolean => {
    if (!parsedMinDate) return false;
    
    const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    return firstDayOfCurrentMonth <= new Date(
      parsedMinDate.getFullYear(),
      parsedMinDate.getMonth(),
      1
    );
  };

  const isNextMonthDisabled = (): boolean => {
  
    if (parsedMaxDate) {
      const maxDateMonthYear = parsedMaxDate.getMonth() + (parsedMaxDate.getFullYear() * 12);
      const nextMonthYear = (currentMonth === 11 ? currentYear + 1 : currentYear) * 12 + 
                           (currentMonth === 11 ? 0 : currentMonth + 1);
      
      return nextMonthYear > maxDateMonthYear;
    }
    

    const today = new Date();
    const currentMonthYear = today.getMonth() + (today.getFullYear() * 12);
    const nextMonthYear = (currentMonth === 11 ? currentYear + 1 : currentYear) * 12 + 
                         (currentMonth === 11 ? 0 : currentMonth + 1);
    
    return nextMonthYear > currentMonthYear;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = prevMonth === 0 ? 11 : prevMonth - 1;
      const newYear = prevMonth === 0 ? currentYear - 1 : currentYear;
  
      if (parsedMinDate) {
        const firstDayOfNewMonth = new Date(newYear, newMonth, 1);
        const lastDayOfMinMonth = new Date(
          parsedMinDate.getFullYear(), 
          parsedMinDate.getMonth() + 1, 
          0
        );
        
       
        if (firstDayOfNewMonth < lastDayOfMinMonth) {
          setCurrentYear(parsedMinDate.getFullYear());
          return parsedMinDate.getMonth();
        }
      }
      
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = prevMonth === 11 ? 0 : prevMonth + 1;
      const newYear = prevMonth === 11 ? currentYear + 1 : currentYear;
      
      if (parsedMaxDate) {
        const maxDateMonthYear = parsedMaxDate.getMonth() + (parsedMaxDate.getFullYear() * 12);
        const newMonthYear = newMonth + (newYear * 12);
        
        if (newMonthYear > maxDateMonthYear) {
          return prevMonth; 
        }
      } else {
      
        const today = new Date();
        const currentMonthYear = today.getMonth() + (today.getFullYear() * 12);
        const newMonthYear = newMonth + (newYear * 12);
        
        if (newMonthYear > currentMonthYear) {
          return prevMonth; 
        }
      }
      
      setCurrentYear(newYear);
      return newMonth;
    });
  };

  const formatDateTime = (date: Date | null, timeStr: string): string => {
    if (!date) return "";

    const [hours, minutes] = to24HourFormat(timeStr).split(":").map(Number);

    
    const tz = timeZone || "Asia/Kolkata";
    const dateInTz = moment.tz(date, tz)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0);

    return dateInTz.toISOString();
  };

 
  const calendar = generateCalendar(currentYear, currentMonth);


  const renderCalendarDay = (day: number | null, i: number, j: number) => {
    if (day === null) {
      return <div key={`${i}-${j}`} className="p-2"></div>;
    }
  
    const cellDate = new Date(currentYear, currentMonth, day);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
  
    const selectedLocalDate = selectedDate
      ? new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      : null;
  
    const isDisabled = isDateDisabled(cellDate);
    const isSelected =
      selectedLocalDate && cellDate.getTime() === selectedLocalDate.getTime();
    const isToday = cellDate.getTime() === todayDate.getTime();
  
    return (
      <div
        key={`${i}-${j}`}
        className={`p-2 rounded-full text-xs font-normal ${
          isDisabled
            ? "text-gray-300 cursor-not-allowed"
            : isSelected
            ? "bg-blue-600 text-white border border-blue-600 cursor-pointer"
            : isToday
            ? "border-2 border-blue-500 text-gray-800 hover:border-blue-200 hover:bg-blue-200 cursor-pointer"
            : "hover:border-blue-200 hover:bg-blue-200 cursor-pointer"
        }`}
        onClick={(e) => {
          if (!isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            handleDateClick(day);
          }
        }}
      >
        {day}
      </div>
    );
  };
  

  const formatDisplayDateTime = (date: Date | null, timeStr: string): string => {
    if (!date) return label || "Date/time";

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const getBorderColor = () => {
    if (showError) return 'border-red-500';
    if (isCalendarVisible) return 'border-blue-400';
    return 'border-gray-300';
  };

  useEffect(() => {
    if (showTimeOptions) {
      adjustPosition(timeRef);
      window.addEventListener("resize", () => adjustPosition(timeRef));
    } else {
      window.removeEventListener("resize", () => adjustPosition(timeRef));
    }

    return () => {
      window.removeEventListener("resize", () => adjustPosition(timeRef));
    };
  }, [showTimeOptions]);
  
  useEffect(() => {
    if (selectedDate) {
      if (parsedMinDate && selectedDate < parsedMinDate) {
        setSelectedDate(new Date(parsedMinDate));
        setCurrentMonth(parsedMinDate.getMonth());
        setCurrentYear(parsedMinDate.getFullYear());
      } else if (parsedMaxDate && selectedDate > parsedMaxDate) {
        setSelectedDate(new Date(parsedMaxDate));
        setCurrentMonth(parsedMaxDate.getMonth());
        setCurrentYear(parsedMaxDate.getFullYear());
      }
    }
  }, [minDate, maxDate, parsedMinDate, parsedMaxDate]);

  useEffect(() => {
    if (value) {
      const date = moment(value).tz(timeZone || "Asia/Kolkata");
      setSelectedDate(new Date(date.format()));

      if (date.month() !== currentMonth || date.year() !== currentYear) {
        setCurrentMonth(date.month());
        setCurrentYear(date.year());
      }

   
      setSelectedTime(to12HourFormat(date.format("HH:mm")));
    }
  }, [value, timeZone]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (hasInteracted && !selectedDate) {
          setShowError(true);
        }
        setIsCalendarVisible(false);
      }
    };

    if (isCalendarVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarVisible, hasInteracted, selectedDate]);


  useEffect(() => {
    if (isCalendarVisible) {
      adjustPosition(calendarRef);
      window.addEventListener("resize", () => adjustPosition(calendarRef));
    } else {
      window.removeEventListener("resize", () => adjustPosition(calendarRef));
    }

    return () => {
      window.removeEventListener("resize", () => adjustPosition(calendarRef));
    };
  }, [isCalendarVisible]);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex items-center justify-between border h-[37px] px-3 py-1 rounded-md ${className} text-sm cursor-pointer ${getBorderColor()}`}
        onClick={() => {
          setIsCalendarVisible((prev) => !prev);
          setHasInteracted(true);
        }}
      >
     
        <div className="flex items-center gap-3">
          <img
            src={CalendarIcon}
            alt="Calendar"
            className="w-4 h-4 cursor-pointer select-none"
          />
          <p className={`text-gray-800 text-lg ${showError ? 'text-red-500' : ''}`}>
            {formatDisplayDateTime(selectedDate, selectedTime)}
          </p>
        </div>
        
    
        <img
          src={ChevronDownIcon}
          alt="dropdown icon"
          className={`w-4 h-4 cursor-pointer transition-transform duration-200 select-none ${isCalendarVisible ? 'rotate-180' : ''}`}
          style={{ filter: showError ? 'invert(39%) sepia(56%) saturate(2000%) hue-rotate(340deg) brightness(90%) contrast(90%)' : '' }}
        />
      </div>

      {isCalendarVisible && (
        <div
          ref={calendarRef}
          className="absolute bg-white rounded-xl shadow-lg px-3 pb-3 z-50 w-[16rem] select-none focus:outline-none"
        >
          <div className="flex justify-between items-center mb-4">
          <div 
              className={`inline-flex rounded-full items-center justify-center w-12 h-12 hover:bg-blue-100 cursor-pointer select-none focus:outline-none active:bg-transparent ${
                isPreviousMonthDisabled() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (!isPreviousMonthDisabled()) {
                  handlePreviousMonth();
                }
              }}
              onMouseDown={(e)=>e.preventDefault()}
            >
              <img
                src={ChevronLeftIcon}
                alt="Left Arrow"
                className={`w-4 h-4 select-none ${
                  isPreviousMonthDisabled() ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>

            <span className="font-medium text-sm">
              {`${new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
              })} ${currentYear}`}
            </span>

            <div 
              className={`inline-flex rounded-full items-center justify-center w-12 h-12 hover:bg-blue-100 cursor-pointer select-none focus:outline-none active:bg-transparent  ${
                isNextMonthDisabled() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (!isNextMonthDisabled()) {
                  handleNextMonth();
                }
              }}
              onMouseDown={(e)=>e.preventDefault()}
            >
              <img
                src={ChevronRightIcon}
                alt="Right arrow"
                className={`w-4 h-4 select-none ${
                  isNextMonthDisabled() ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-600">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={`day-header-${index}`} className="py-1">
                {day.charAt(0)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-6 text-center text-black">
            {calendar.map((week, i) => (
              <React.Fragment key={`week-${i}`}>
                {week.map((day, j) => renderCalendarDay(day, i, j))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;