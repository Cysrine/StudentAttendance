// Example: CSV Handling in JavaScript

// Sample CSV string
const csvData = `Name,Age,City\nAlice,30,New York\nBob,25,Los Angeles\nCharlie,35,Chicago`;

// Function to parse CSV into an array of objects
function parseCSV(csvString) {
    const [headerLine, ...lines] = csvString.split("\n");
    const headers = headerLine.split(",");
    return lines.map(line => {
        const values = line.split(",");
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}

// Function to convert an array of objects back to CSV
function convertToCSV(dataArray) {
    const headers = Object.keys(dataArray[0]);
    const rows = dataArray.map(obj => headers.map(header => obj[header]).join(","));
    return [headers.join(","), ...rows].join("\n");
}

// Function to add a new row to CSV data
function addRow(csvString, newRow) {
    const dataArray = parseCSV(csvString);
    dataArray.push(newRow);
    return convertToCSV(dataArray);
}

// Function to filter CSV data based on a condition
function filterCSV(csvString, filterCallback) {
    const dataArray = parseCSV(csvString);
    const filteredData = dataArray.filter(filterCallback);
    return convertToCSV(filteredData);
}

// Usage examples

// Parse CSV
const parsedData = parseCSV(csvData);
console.log("Parsed Data:", parsedData);

// Convert data back to CSV
const csvString = convertToCSV(parsedData);
console.log("CSV String:", csvString);

// Add a new row
const newRow = { Name: "Diana", Age: "28", City: "Houston" };
const updatedCSV = addRow(csvData, newRow);
console.log("Updated CSV:", updatedCSV);

// Filter CSV data (e.g., people older than 30)
const filteredCSV = filterCSV(csvData, row => parseInt(row.Age) > 30);
console.log("Filtered CSV:", filteredCSV);
