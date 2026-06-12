const csvUrl =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTznPwMCDQUfnvxg0gWlbMgaR5RnoR14DfPA343riMLSq4sRNrp-LbO9S9AiotDfRfvffT-zP2J2WPF/pub?output=csv";

fetch(csvUrl)
.then(res => res.text())
.then(csv => {

    const rows = csv.split("\n").slice(1);

    const weekData = {};
    const dates = [];

    rows.forEach(row => {

        const cols = row.split(",");

        if(cols.length < 4) return;

        const date = cols[0].trim();
        const day = cols[1].trim();
        const time = cols[2].trim();
        const status = cols[3].trim();

        if(!dates.includes(date) && dates.length < 7){
            dates.push(date);
        }

        if(!weekData[time]){
            weekData[time] = {};
        }

        weekData[time][date] = {
            day,
            status
        };
    });

    const tableHead =
    document.getElementById("tableHead");

    let header =
    "<tr><th>Time</th>";

    dates.forEach(date => {

        const sample =
        Object.values(weekData)[0][date];

        header += `
        <th>
            ${sample.day.substring(0,3)}
            <br>
            ${date}
        </th>`;
    });

    header += "</tr>";

    tableHead.innerHTML = header;

    const tbody =
    document.querySelector("#scheduleTable tbody");

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
            === "available"){

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

});
