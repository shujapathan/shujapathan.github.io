const csvUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTznPwMCDQUfnvxg0gWlbMgaR5RnoR14DfPA343riMLSq4sRNrp-LbO9S9AiotDfRfvffT-zP2J2WPF/pub?output=csv";

let currentWeekStart = 0;
let allDates = [];
let weekData = {};

fetch(csvUrl)
.then(res => res.text())
.then(csv => {

    const rows = csv.trim().split("\n").slice(1);

    rows.forEach(row => {

        const cols = row.split(",");

        if(cols.length < 4) return;

        const date = cols[0].trim();
        const day = cols[1].trim();
        const time = cols[2].trim();
        const status = cols[3].trim();

        if(!allDates.includes(date)){
            allDates.push(date);
        }

        if(!weekData[time]){
            weekData[time] = {};
        }

        weekData[time][date] = {
            day,
            status
        };

    });

    allDates.sort((a,b) => new Date(a) - new Date(b));

    const today = new Date();
    today.setHours(0,0,0,0);

    currentWeekStart = allDates.findIndex(date => {

        const d = new Date(date);
        d.setHours(0,0,0,0);

        return d >= today;

    });

    if(currentWeekStart < 0){
        currentWeekStart = 0;
    }

    renderWeek();

    const nextBtn = document.getElementById("nextWeek");
    const prevBtn = document.getElementById("prevWeek");

    if(nextBtn){
        nextBtn.addEventListener("click", () => {

            if(currentWeekStart + 7 < allDates.length){

                currentWeekStart += 7;
                renderWeek();

            }

        });
    }

    if(prevBtn){
        prevBtn.addEventListener("click", () => {

            if(currentWeekStart - 7 >= 0){

                currentWeekStart -= 7;
                renderWeek();

            }

        });
    }

})
.catch(error => {
    console.error("Error loading CSV:", error);
});

function renderWeek(){

    const dates =
        allDates.slice(
            currentWeekStart,
            currentWeekStart + 7
        );

    const tableHead =
        document.getElementById("tableHead");

    let header =
        "<tr><th>Time</th>";

    dates.forEach(date => {

        let sample = null;

        for(const time in weekData){

            if(weekData[time][date]){

                sample =
                    weekData[time][date];

                break;
            }
        }

        if(sample){

            const today = new Date();
            today.setHours(0,0,0,0);

            const currentDate =
                new Date(date);

            currentDate.setHours(0,0,0,0);

            const dayLabel =
                currentDate.getTime() === today.getTime()
                ? "Today"
                : sample.day.substring(0,3);

            header += `
            <th>
                ${dayLabel}
                <br>
                ${date}
            </th>`;
        }

    });

    header += "</tr>";

    tableHead.innerHTML = header;

    const tbody =
        document.querySelector(
            "#scheduleTable tbody"
        );

    tbody.innerHTML = "";

    Object.keys(weekData).forEach(time => {

        let row =
            `<tr><td>${time}</td>`;

        dates.forEach(date => {

            const slot =
                weekData[time][date];

            if(!slot){

                row += "<td>-</td>";

            }
            else if(
                slot.status.toLowerCase()
                === "available"
            )
            {

                row +=
                `<td class="available-cell">🟢</td>`;

            }
            else{

                row +=
                `<td class="booked-cell">🔴</td>`;

            }

        });

        row += "</tr>";

        tbody.innerHTML += row;

    });

}
