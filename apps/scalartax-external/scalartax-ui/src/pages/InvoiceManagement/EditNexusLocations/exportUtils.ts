import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Papa from "papaparse";

// Function to export CSV
export const exportToCSV = (region: any) => {
    if (!region) return;

    const csvData = [
        ["ID", "Name", "Jurisdiction Type", "Nexus Type", "Region Code", "Effective Date", "Expiration Date"],
        [
            region.id,
            region.name,
            region.jurisdiction_type,
            region.nexus_type,
            region.region_code,
            region.effective_date || "N/A",
            region.expiration_date || "N/A",
        ],
        ...region.locals.counties.map((county: any) => [
            county.id,
            county.name,
            county.jurisdiction_type,
            county.nexus_type,
            county.region_code,
            county.effective_date || "N/A",
            county.expiration_date || "N/A",
        ]),
        ...region.locals.cities.map((city: any) => [
            city.id,
            city.name,
            city.jurisdiction_type,
            city.nexus_type,
            city.region_code,
            city.effective_date || "N/A",
            city.expiration_date || "N/A",
        ]),
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "region_data.csv");
};

// Function to export Excel
export const exportToExcel = (region: any) => {
    if (!region) return;

    const excelData = [
        ["ID", "Name", "Jurisdiction Type", "Nexus Type", "Region Code", "Effective Date", "Expiration Date"],
        [
            region.id,
            region.name,
            region.jurisdiction_type,
            region.nexus_type,
            region.region_code,
            region.effective_date || "N/A",
            region.expiration_date || "N/A",
        ],
        ...region.locals.counties.map((county: any) => [
            county.id,
            county.name,
            county.jurisdiction_type,
            county.nexus_type,
            county.region_code,
            county.effective_date || "N/A",
            county.expiration_date || "N/A",
        ]),
        ...region.locals.cities.map((city: any) => [
            city.id,
            city.name,
            city.jurisdiction_type,
            city.nexus_type,
            city.region_code,
            city.effective_date || "N/A",
            city.expiration_date || "N/A",
        ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Region Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "region_data.xlsx");
};
