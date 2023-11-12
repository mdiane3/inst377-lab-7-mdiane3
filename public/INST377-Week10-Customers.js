async function loadCustomerData() {
    var test = await fetch('http://localhost:3000/customers')
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            const element = document.getElementById("customerInfo");
            if (element) {
                element.remove();
            }

            var table = document.createElement('table');
            table.setAttribute('id', 'customerInfo')

            var tableRow = document.createElement('tr');

            var tableHeading1 = document.createElement('th');
            tableHeading1.innerHTML = "First Name"
            tableRow.appendChild(tableHeading1)

            var tableHeading2 = document.createElement('th');
            tableHeading2.innerHTML = "Last Name"
            tableRow.appendChild(tableHeading2)

            var tableHeading3 = document.createElement('th');
            tableHeading3.innerHTML = "State"
            tableRow.appendChild(tableHeading3)

            table.appendChild(tableRow)
            var cutoff = document.getElementById('cutoff');
            cutoff.insertAdjacentElement("beforebegin", table)
            for (i = 0; i < res.length; i++) {
                var customerRow = document.createElement('tr');
                var customerFirstName = document.createElement('td');
                var customerLastName = document.createElement('td');
                var customerState = document.createElement('td');

                customerFirstName.innerHTML = res[i].cust_first_name;
                customerLastName.innerHTML = res[i].cust_last_name;
                customerState.innerHTML = res[i].cust_state;

                customerRow.appendChild(customerFirstName);
                customerRow.appendChild(customerLastName);
                customerRow.appendChild(customerState);

                table.appendChild(customerRow);
            }
        })
}

async function createCustomer() {
    console.log('Creating Customer')
    var test = await fetch('http://localhost:3000/customer', {
        method: 'POST',
        body: JSON.stringify({
            "firstName": `${document.getElementById("firstName").value}`,
            "lastName": `${document.getElementById("lastName").value}`,
            "state": `${document.getElementById("state").value}`
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((res) => {
            console.log(res)
            const element = document.getElementById("errorBox");
            if (element) {
                element.remove();
            }

            console.log('Status:', res.status)
            if (res.status != 200 && res.status != 304) {
                throw new Error(JSON.stringify(res.json()));
            } else {
                res.json()
            }
        })
        .catch((error) => {
            console.log('Error:', error)
            var div = document.createElement('div')
            div.setAttribute('class', 'errorBox')
            div.setAttribute('id', 'errorBox')

            var h1 = document.createElement('h1')
            h1.innerHTML = `Error Occurred:`

            var p = document.createElement('p')
            p.innerHTML = `${JSON.parse(error.message).message}`

            div.appendChild(h1)
            div.appendChild(p)
            document.body.appendChild(div)
            return false;
        })
    await loadCustomerData();
}

window.onload = loadCustomerData;