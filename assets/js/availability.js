const polishHolidays2025 = [
  '2025-01-01', // Nowy Rok
  '2025-01-06', // Trzech Króli
  '2025-04-20', // Wielkanoc
  '2025-04-21', // Poniedziałek Wielkanocny
  '2025-05-01', // Święto Pracy
  '2025-05-03', // Święto Konstytucji 3 Maja
  '2025-06-08', // Zielone Świątki
  '2025-06-19', // Boże Ciało
  '2025-08-15', // Wniebowzięcie NMP
  '2025-11-01', // Wszystkich Świętych
  '2025-11-11', // Święto Niepodległości
  '2025-12-24', // Wigilia
  '2025-12-25', // Boże Narodzenie I dzień
  '2025-12-26'  // Boże Narodzenie II dzień
];

function isPolishHoliday(date) {
    const dateString = date.toISOString().split('T')[0];
    return polishHolidays2025.includes(dateString);
}

function getNextWorkingDay(date) {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    while (isPolishHoliday(nextDay) || nextDay.getDay() === 0 || nextDay.getDay() === 6) {
        nextDay.setDate(nextDay.getDate() + 1);
    }
    const days = ['niedzielę', 'poniedziałek', 'wtorek', 'środę', 'czwartek', 'piątek', 'sobotę'];
    return days[nextDay.getDay()];
}

function getCurrentStatus() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();

    // KROK 1: Sprawdź czy to święto
    if (isPolishHoliday(now)) {
        const nextWorkingDay = getNextWorkingDay(now);
        return {
            status: 'red',
            text: `Święto - odpowiem w ${nextWorkingDay}`
        };
    }

    // KROK 2: Sprawdź czy to weekend
    if (dayOfWeek === 6) { // Sobota
        if (hour >= 8 && hour < 16) {
            return { status: 'yellow', text: 'Dostępny w weekend do 16:00' };
        } else {
            return { status: 'red', text: 'Odpowiem w poniedziałek o 6:00' };
        }
    }
    if (dayOfWeek === 0) { // Niedziela
        return { status: 'red', text: 'Odpowiem w poniedziałek o 6:00' };
    }

    // KROK 3: Dni robocze (Pon-Pt)
    if (hour >= 6 && hour < 22) {
        return { status: 'green', text: 'Dostępny teraz do 22:00' };
    } else {
        if (dayOfWeek === 5) { // Piątek po 22:00
             return { status: 'yellow', text: 'Odpowiem w poniedziałek o 6:00' };
        }
        return { status: 'yellow', text: 'Odpowiem jutro o 6:00' };
    }
}