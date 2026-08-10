main();

// #############################################
// #                FUNCTIONS                  #
// #############################################

//              ###############
//              #     Main    #
//              ###############

// Einstiegspunkt des Programms.
// Erstellt das aktuelle Datum und startet die Kalender-
// sowie Textausgabe.
function main() {
    const date = new Date();

    createCalendar(date);
    writeTextBlock(date);
}

//              ###############
//              #   GETTER    #
//              ###############

// Gibt den Monatsnamen zum übergebenen Monatsindex zurück.
// JavaScript verwendet Monatsindizes von 0 bis 11.
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

// Gibt den Namen des Wochentags zum Index von Date.getDay() zurück.
// Date.getDay(): 0 = Sonntag bis 6 = Samstag.
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

// Wandelt das Vorkommen eines Wochentags im Monat
// in die passende ausgeschriebene Form um.
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

// Gibt ein Array mit der Anzahl der Tage aller zwölf Monate zurück.
// Der Februar wird abhängig vom Schaltjahr angepasst.
function getDaysPerMonth(year) {
    return [
        31, // Januar
        isLeapYear(year) ? 29 : 28, // Februar
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

// Bestimmt den Namen eines bundesweiten Feiertags.
// Wird kein Feiertag gefunden, wird ein leerer String zurückgegeben.
function getHolidayName(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Feste Feiertage anhand von Monat und Tag prüfen.
    // month arbeitet hier direkt mit dem JavaScript-Index 0 bis 11.
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

    // Ostersonntag dient als Ausgangspunkt für alle
    // davon abhängigen beweglichen Feiertage.
    const easterSunday = calculateEasterSunday(year);
    const easterSundayMonth = easterSunday.getMonth();
    const easterSundayDay = easterSunday.getDate();

    // Bewegliche Feiertage durch Verschieben des Osterdatums berechnen.

    // Karfreitag: zwei Tage vor Ostersonntag.
    const goodFriday = new Date(year, easterSundayMonth, easterSundayDay - 2);
    // Ostermontag: ein Tag nach Ostersonntag.
    const easterMonday = new Date(year, easterSundayMonth, easterSundayDay + 1);
    // Christi Himmelfahrt: 39 Tage nach Ostersonntag.
    const ascensionDay = new Date(year, easterSundayMonth, easterSundayDay + 39);
    // Pfingstmontag: 50 Tage nach Ostersonntag.
    const whitMonday = new Date(year, easterSundayMonth, easterSundayDay + 50);

    // Aktuelles Datum mit den berechneten beweglichen Feiertagen vergleichen.
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
        default:
            return "";
    }
}

//              ###############
//              # CALCULATORS #
//              ###############

// Berechnet, das wievielte Vorkommen eines Wochentags
// innerhalb des Monats vorliegt.
function calculateWeekdayOccurrence(dayOfMonth) {
    return Math.ceil(dayOfMonth / 7);
}

// Berechnet anhand des aktuellen Tags des Jahres,
// wie viele Tage bis zum Jahresende verbleiben.
function calculateRemainingDaysOfYear(dayOfMonth, monthIndex, year) {
    const dayOfYear = calculateDayOfYear(dayOfMonth, monthIndex, year);
    const daysInYear = isLeapYear(year) ? 366 : 365;

    return daysInYear - dayOfYear;
}

// Addiert die Tage aller vollständig vergangenen Monate
// und anschließend den aktuellen Tag des Monats.
function calculateDayOfYear(dayOfMonth, monthIndex, year) {
    const daysPerMonth = getDaysPerMonth(year);
    let dayOfYear = 0;

    for (let i = 0; i < monthIndex; i++) {
        dayOfYear += daysPerMonth[i];
    }

    dayOfYear += dayOfMonth;

    return dayOfYear;
}

// Berechnet anhand eines bekannten Osteralgorithmus
// den Ostersonntag des übergebenen Jahres.
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
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    // Date erwartet den Monatsindex 0 bis 11,
    // der Algorithmus liefert dagegen die Monatszahl 1 bis 12.
    return new Date(year, month - 1, day);
}

//              ###############
//              #    WRITER   #
//              ###############

// Bereitet alle dynamischen Texte für den aktuellen Tag auf
// und schreibt sie in die vorgesehenen HTML-Elemente.
function writeTextBlock(date) {
    const weekdayIndex = date.getDay();
    const monthIndex = date.getMonth();
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    // Formatiertes Datum ausgeben.
    const formattedDateId = "formatted-date";
    const formattedDateText = formatDate(dayOfMonth, monthIndex, year);
    writeSingleElement(formattedDateId, formattedDateText);

    // Überschrift und Browser-Titel aktualisieren.
    const headerId = "header-text";
    const headerText = `Kalenderblatt vom ${formattedDateText}`;
    writeSingleElement(headerId, headerText);
    document.title = headerText;

    // Aktuellen Tag des Jahres ausgeben.
    const dayOfYearId = "day-of-year";
    const dayOfYearText = calculateDayOfYear(dayOfMonth, monthIndex, year);
    writeSingleElement(dayOfYearId, dayOfYearText);

    // Aktuelles Jahr ausgeben.
    const yearId = "year";
    writeSingleElement(yearId, year);

    // Verbleibende Tage bis zum Jahresende ausgeben.
    const daysRemainingId = "days-remaining";
    const daysRemainingText = calculateRemainingDaysOfYear(dayOfMonth, monthIndex, year);
    writeSingleElement(daysRemainingId, daysRemainingText);

    // Anzahl der Tage des aktuellen Monats ausgeben.
    const daysInMonthId = "days-in-month";
    const daysInMonthText = getDaysPerMonth(year)[monthIndex];
    writeSingleElement(daysInMonthId, daysInMonthText);

    // Feiertag für das aktuelle Datum bestimmen und Text ausgeben.
    const holidayId = "holiday-text";
    const holidayName = getHolidayName(date);
    const holidayText = holidayName === ""
        ? "Heute ist kein gesetzlicher Feiertag."
        : `Heute ist ein gesetzlicher Feiertag: ${holidayName}.`;
    writeSingleElement(holidayId, holidayText);

    // Bestimmen, das wievielte Auftreten des Wochentags
    // im aktuellen Monat vorliegt.
    const weekDayOccurrenceId = "week-day-occurrence";
    const weekDayOccurrence = calculateWeekdayOccurrence(dayOfMonth);
    const weekDayOccurrenceText = getWeekdayOccurence(weekDayOccurrence - 1);
    writeSingleElement(weekDayOccurrenceId, weekDayOccurrenceText);

    // Wochentagsnamen in alle Elemente der entsprechenden Klasse schreiben.
    const weekdayNameClass = "week-day-name";
    const weekDayNameText = getWeekdayName(weekdayIndex);
    writeClassOfElements(weekdayNameClass, weekDayNameText);

    // Monatsnamen in alle dafür vorgesehenen Elemente schreiben.
    const monthNameClass = "month-name";
    const monthNameText = getMonthName(monthIndex);
    writeClassOfElements(monthNameClass, monthNameText);
}

// Schreibt einen Textwert in ein einzelnes HTML-Element,
// das über seine ID angesprochen wird.
function writeSingleElement(elementId, elementText) {
    const e = document.getElementById(elementId);
    e.textContent = elementText;
}

// Schreibt denselben Text in alle HTML-Elemente
// einer bestimmten CSS-Klasse.
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

// Baut aus Tag, Monatsindex und Jahr
// einen lesbaren deutschen Datumsstring.
function formatDate(dayOfMonth, monthIndex, year) {
    const month = getMonthName(monthIndex);

    return `${dayOfMonth}. ${month} ${year}`;
}

// Prüft, ob das übergebene Jahr ein Schaltjahr ist.
function isLeapYear(year) {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        return true;
    }

    return false;
}

//              ###############
//              #  CALENDAR   #
//              ###############

// Erzeugt das vollständige Kalenderblatt für den Monat
// des übergebenen Datums.
function createCalendar(date) {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const dayOfMonth = date.getDate();

    // Tabellenkörper holen und eventuell vorhandene
    // Kalenderzeilen entfernen.
    const calendarBody = document.getElementById("calendar-body");
    calendarBody.innerHTML = "";

    // Ersten Tag des Monats bestimmen.
    const firstDayOfMonth = new Date(year, monthIndex, 1);

    // getDay() beginnt mit Sonntag = 0.
    // Durch die Umrechnung beginnt unser Kalender mit Montag = 0.
    const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7;

    // Anzahl der Tage des aktuellen Monats bestimmen.
    const daysInCurrentMonth = getDaysPerMonth(year)[monthIndex];

    // Vorherigen Monat bestimmen.
    // Januar benötigt einen Wechsel zu Dezember des Vorjahres.
    let previousMonthIndex = monthIndex - 1;
    let previousMonthYear = year;

    if (previousMonthIndex < 0) {
        previousMonthIndex = 11;
        previousMonthYear--;
    }

    // Monatstage des vorherigen Jahres bestimmen,
    // damit auch der Februar eines Schaltjahres korrekt ist.
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

    // Zähler für die Tage des aktuellen
    // und des folgenden Monats.
    let currentDay = 1;
    let nextMonthDay = 1;

    // Ein Monatskalender benötigt höchstens sechs Zeilen.
    for (let week = 0; week < 6; week++) {
        const row = document.createElement("tr");

        // Für jede Woche sieben Tabellenzellen erzeugen.
        for (let weekDay = 0; weekDay < 7; weekDay++) {
            const cell = document.createElement("td");

            // Laufende Position der Zelle im gesamten Kalender.
            const cellIndex = week * 7 + weekDay;

            // Liegt die Zelle vor dem ersten Tag des aktuellen Monats,
            // wird ein Tag des vorherigen Monats angezeigt.
            if (cellIndex < firstWeekDay) {
                const day = daysInPreviousMonth - firstWeekDay + cellIndex + 1;

                cell.textContent = day;
                cell.classList.add("other-month");
            }

            // Solange noch Tage des aktuellen Monats vorhanden sind,
            // werden diese ausgegeben.
            else if (currentDay <= daysInCurrentMonth) {
                cell.textContent = currentDay;

                // Aktuellen Tag optisch hervorheben.
                if (currentDay === dayOfMonth) {
                    cell.classList.add("current-day");
                }

                // Für jeden Kalendertag prüfen,
                // ob es sich um einen Feiertag handelt.
                const cellDate = new Date(year, monthIndex, currentDay);
                const holidayName = getHolidayName(cellDate);

                if (holidayName !== "") {
                    cell.classList.add("holiday");

                    // Feiertagsname beim Überfahren
                    // der Zelle als Tooltip anzeigen.
                    cell.title = holidayName;
                }

                currentDay++;
            }

            // Nach dem letzten Tag des aktuellen Monats
            // bereits die ersten Tage des Folgemonats anzeigen.
            else {
                cell.textContent = nextMonthDay;
                cell.classList.add("other-month");

                nextMonthDay++;
            }

            // Fertige Tageszelle an die aktuelle Kalenderwoche anhängen.
            row.appendChild(cell);
        }

        // Fertige Kalenderwoche in den Tabellenkörper einfügen.
        calendarBody.appendChild(row);

        // Schleife beenden, sobald der aktuelle Monat vollständig
        // dargestellt wurde und genügend Folgetage eingefügt sind.
        if (currentDay > daysInCurrentMonth && nextMonthDay > 7) {
            break;
        }
    }
}