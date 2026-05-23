export type ExportFormat = "csv" | "json";

function escapeCsvCell(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToJson<T extends Record<string, unknown>>(
  rows: T[],
  filename: string
): void {
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, `${filename}.json`);
}

export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  if (rows.length === 0) {
    const blob = new Blob([""], { type: "text/csv" });
    downloadBlob(blob, `${filename}.csv`);
    return;
  }

  const cols =
    columns ??
    (Object.keys(rows[0]) as (keyof T)[]).map((key) => ({
      key,
      label: String(key),
    }));

  const header = cols.map((c) => escapeCsvCell(c.label)).join(",");
  const body = rows
    .map((row) =>
      cols.map((c) => escapeCsvCell(row[c.key])).join(",")
    )
    .join("\n");

  const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportData<T extends Record<string, unknown>>(
  format: ExportFormat,
  rows: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  if (format === "json") {
    exportToJson(rows, filename);
  } else {
    exportToCsv(rows, filename, columns);
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
