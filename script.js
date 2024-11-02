let data = [];
let currentPage = 1;
const rowsPerPage = 5;

async function loadCSV() {
    try {
        const response = await fetch('becas.csv');
        const textData = await response.text();
        data = textData.split('\n').map(row => row.split(','));

        displayHeaders();
        displayPage(currentPage);
        document.getElementById('searchInput').addEventListener('input', searchTable);
    } catch (error) {
        console.error('Error al cargar el archivo CSV:', error);
    }
}

function displayHeaders() {
    const headerRow = document.getElementById('headerRow');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.trim();
        headerRow.appendChild(th);
    });
}

function displayPage(page) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    const start = (page - 1) * rowsPerPage + 1;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    pageData.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell.trim() || "Sin datos";  // Si la celda está vacía, muestra "Sin datos"
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    updatePaginationInfo();
}

function updatePaginationInfo() {
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${Math.ceil((data.length - 1) / rowsPerPage)}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= Math.ceil((data.length - 1) / rowsPerPage);
}

function changePage(direction) {
    currentPage += direction;
    displayPage(currentPage);
}

function searchTable(event) {
    const filter = event.target.value.toLowerCase();
    const filteredData = data.filter((row, index) => 
        index === 0 || row.some(cell => cell.toLowerCase().includes(filter))
    );
    data = filteredData.length ? filteredData : data;
    currentPage = 1;
    displayPage(currentPage);
}

loadCSV();
