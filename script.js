const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAipwcbilCrIQhJIhrYH0qyKJKvGgzj2Go-WjaTO3fUZIc1dLaL46mLQovdNM-jYduib_z-ZRZ3DUH/pub?gid=0&single=true&output=csv";

fetch(csvUrl)
.then(response => response.text())
.then(csv => {

    const rows = csv.split("\n").slice(1);

    const data = {};

    rows.forEach(row => {

        const cols = row.split(",");

        if(cols.length < 3) return;

        const day = cols[0].trim();
        const time = cols[1].trim();
        const status = cols[2].trim();

        if(!data[time]){
            data[time] = {};
        }

        data[time][day] = status;
    });

    const tbody = document.querySelector("#scheduleTable tbody");

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    Object.keys(data).forEach(time => {

        const tr = document.createElement("tr");

        let row = `<td>${time}</td>`;

        days.forEach(day => {

            const status = data[time][day] || "";

            if(status.toLowerCase() === "available"){
                row += `<td class="available-cell">🟢</td>`;
            }
            else if(status.toLowerCase() === "booked"){
                row += `<td class="booked-cell">🔴</td>`;
            }
            else{
                row += `<td>-</td>`;
            }
        });

        tr.innerHTML = row;
        tbody.appendChild(tr);

    });

});