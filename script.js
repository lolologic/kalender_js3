main();

// #############################################
// #                FUNCTIONS                  #
// #############################################

//              ###############
//              #     Main    #
//              ###############

function main() {
    const date = new Date();

    createCalendar(date);
    writeTextBlock(date);
}

//              ###############
//              #   GETTER    #
//              ###############

function getMonthName(i) {
    const monthNames = [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
    ];
    return monthNames[i];
}

function getWeekdayName(i) {
    const weekdayNames = [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag"
    ];
    return weekdayNames[i];
}

function getWeekdayOccurence(i) {
    const occurrenceNames = [
        "erste",
        "zweite",
        "dritte",
        "vierte",
        "fünfte"
    ];
    return occurrenceNames[i];
}

function getDaysPerMonth() {
    return [
        31, // Januar
        isLeapYear(year) ? 28 : 29, // Februar
        31, // März
        30, // April
        31, // Mai
        30, // Juni
        31, // Juli
        31, // August
        30, // September
        31, // Oktober
        30, // November
        31  // Dezember
    ];
}

// Bundesweiten Feiertag bestimmen
function getHolidayName(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // month + 1 for calendaric month.
    switch (true) {
        case month === 0 && day === 1:
            return "Neujahr";
        case month === 4 && day === 1:
            return "Tag der Arbeit";
        case month === 9 && day === 3:
            return "Tag der Deutschen Einheit";
        case month === 11 && day === 25:
            return "Erster Weihnachtstag";
        case month === 11 && day === 26:
            return "Zweiter Weihnachtstag";
        default:
            break;
    }

    // Ostersonntag berechnen
    const easterSunday = calculateEasterSunday(year);
    const easterSundayMonth = easterSunday.getMonth();
    const easterSundayDay = easterSunday.getDate();
    // Karfreitag
    const goodFriday = new Date(year, easterSundayMonth, easterSundayDay - 2);
    // Ostermontag
    const easterMonday = new Date(year, easterSundayMonth, easterSundayDay + 1);
    // Christi Himmelfahrt
    const ascensionDay = new Date(year, easterSundayMonth, easterSundayDay + 39);
    // Pfingstmontag
    const whitMonday = new Date(year, easterSundayMonth, easterSundayDay + 50);

    // Nun der switch Case, der die beweglichen Feiertage prüft.
    switch (true) {
        case month === goodFriday.getMonth() && day === goodFriday.getDate():
            return "Karfreitag";
        case month === easterSundayMonth && day === easterSundayDay:
            return "Ostersonntag";
        case month === easterMonday.getMonth() && day === easterMonday.getDate():
            return "Ostermontag";
        case month === ascensionDay.getMonth() && day === ascensionDay.getDate():
            return "Christi Himmelfahrt";
        case month === whitMonday.getMonth() && day === whitMonday.getDate():
            return "Pfingstmontag";
        case month === 11 && day === 26:
            return "Zweiter Weihnachtstag";
        default:
            return "";
    }
}

//              ###############
//              # CALCULATORS #
//              ###############

function calculateWeekdayOccurrence(dayOfMonth) {
    return Math.ceil(dayOfMonth / 7);
}

function calculateRemainingDaysOfYear(dayOfMonth, monthIndex, year) {
    const dayOfYear = calculateDayOfYear(dayOfMonth, monthIndex);
    let daysInYear = isLeapYear(year) ? 365 : 366;

    return daysInYear - dayOfYear;
}

function calculateDayOfYear(dayOfMonth, monthIndex) {
    const daysPerMonth = getDaysPerMonth();
    let dayOfYear = 0;

    for (let i = 0; i < monthIndex; i++) {
        dayOfYear += daysPerMonth[i];
    }

    dayOfYear += dayOfMonth;

    return dayOfYear;
}

function calculateEasterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const month =
        Math.floor((h + l - 7 * m + 114) / 31);

    const day =
        ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
}

//              ###############
//              #    WRITER   #
//              ###############

function writeTextBlock(date) {
    const weekdayIndex = date.getDay();
    const monthIndex = date.getMonth();
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    const formattedDateId = "formatted-date";
    const formattedDateText = formatDate(dayOfMonth, monthIndex, year);
    writeSingleElement(formattedDateId, formattedDateText);

    const headerId = "header-text";
    const headerText = `Kalenderblatt vom ${formattedDateText}`;
    writeSingleElement(headerId, headerText);
    document.title = headerText;

    const dayOfYearId = "day-of-year";
    const dayOfYearText = calculateDayOfYear(dayOfMonth, monthIndex);
    writeSingleElement(dayOfYearId, dayOfYearText);

    const yearId = "year";
    writeSingleElement(yearId, year);

    const daysRemainingId = "days-remaining";
    const daysRemainingText = calculateRemainingDaysOfYear(dayOfMonth, monthIndex, year);
    writeSingleElement(daysRemainingId, daysRemainingText);

    const daysInMonthId = "days-in-month";
    const daysInMonthText = getDaysPerMonth()[monthIndex];
    writeSingleElement(daysInMonthId, daysInMonthText);

    const holidayId = "holiday-text";
    const holidayName = getHolidayName(date);
    const holidayText = holidayName === ""
        ? "Heute ist kein gesetzlicher Feiertag."
        : `Heute ist ein gesetzlicher Feiertag: ${holidayName}.`;
    writeSingleElement(holidayId, holidayText);

    const weekDayOccurrenceId = "week-day-occurrence";
    const weekDayOccurrence = calculateWeekdayOccurrence(dayOfMonth);
    const weekDayOccurrenceText = getWeekdayOccurence(weekDayOccurrence - 1);
    writeSingleElement(weekDayOccurrenceId, weekDayOccurrenceText);

    const weekdayNameClass = "week-day-name";
    const weekDayNameText = getWeekdayName(weekdayIndex);
    writeClassOfElements(weekdayNameClass, weekDayNameText);

    const monthNameClass = "month-name";
    const monthNameText = getMonthName(monthIndex);
    writeClassOfElements(monthNameClass, monthNameText);
}

function writeSingleElement(elementId, elementText) {
    const e = document.getElementById(elementId);
    e.textContent = elementText;
}

function writeClassOfElements(elementsClass, elementsText) {
    const elements = document.getElementsByClassName(elementsClass);
    for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        e.textContent = elementsText;
    }
}

//              ###############
//              #    HELPER   #
//              ###############

function formatDate(dayOfMonth, monthIndex, year) {
    const month = getMonthName(monthIndex);

    return `${dayOfMonth}. ${month} ${year}`;
}

// Schaltjahr prüfen
function isLeapYear(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        return true;
    }

    return false;
}

//              ###############
//              #  CALENDAR   #
//              ###############

function createCalendar(date) {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const dayOfMonth = date.getDate();

    // Ersten Tag des Monats bestimmen
    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";

    // Ersten Tag des Monats bestimmen
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInCurrentMonth = getDaysPerMonth()[monthIndex];

    // Vorherigen Monat bestimmen
    let previousMonthIndex = monthIndex - 1;
    let previousMonthYear = year;

    if (previousMonthIndex < 0) {
        previousMonthIndex = 11;
        previousMonthYear--;
    }

    // Monatstage des vorherigen Jahres/Monats
    const previousMonthDays = [
        31,
        isLeapYear(previousMonthYear) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    const daysInPreviousMonth = previousMonthDays[previousMonthIndex];

    let currentDay = 1;
    let nextMonthDay = 1;

    // Maximal sechs Kalenderwochen erzeugen
    for (let week = 0; week < 6; week++) {
        const row = document.createElement("tr");

        // Sieben Wochentage erzeugen
        for (let weekDay = 0; weekDay < 7; weekDay++) {
            const cell = document.createElement("td");
            const cellIndex = week * 7 + weekDay;

            // Tage des vorherigen Monats
            if (cellIndex < firstWeekDay) {
                const day = daysInPreviousMonth - firstWeekDay + cellIndex + 1;

                cell.textContent = day;
                cell.classList.add("other-month");
            }

            // Tage des aktuellen Monats
            else if (currentDay <= daysInCurrentMonth) {
                cell.textContent = currentDay;

                // Heutigen Tag markieren
                if (currentDay === dayOfMonth) {
                    cell.classList.add("current-day");
                }

                // Feiertag prüfen
                const cellDate = new Date(year, monthIndex, currentDay);
                const holidayName = getHolidayName(cellDate);

                if (holidayName !== "") {
                    cell.classList.add("holiday");
                    cell.title = holidayName;
                }

                currentDay++;
            }

            // Tage des nächsten Monats
            else {
                cell.textContent = nextMonthDay;
                cell.classList.add("other-month");

                nextMonthDay++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);

        // Keine unnötige sechste Zeile erzeugen
        if (currentDay > daysInCurrentMonth && nextMonthDay > 7) {
            break;
        }
    }
}