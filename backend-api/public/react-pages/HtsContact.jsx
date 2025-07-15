const { useEffect, useState } = React;

const HtsContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/common/get-hts-contact")
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const exportToExcel = () => {
    setExporting(true);

    setTimeout(() => {
      const exportData = contacts.map(item => ({
        "Created At": new Date(item.created_at).toLocaleString(),
        Name: item.name,
        "Contact Number": item.contact_number,
        Email: item.email,
        Message: item.message
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      XLSX.writeFile(workbook, "contacts.xlsx");

      setExporting(false);
    }, 300); // slight delay for UX feel
  };

  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#f3f4f6",
      minHeight: "100vh",
      fontFamily: "Segoe UI, sans-serif"
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "16px"
    },
    exportBtn: {
      padding: "10px 16px",
      backgroundColor: exporting ? "#9ca3af" : "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: exporting ? "not-allowed" : "pointer",
      marginBottom: "16px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    spinner: {
      width: "14px",
      height: "14px",
      border: "2px solid #fff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    },
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    },
    tableWrapper: {
      overflowX: "auto",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed"
    },
    thead: {
      backgroundColor: "#f9fafb"
    },
    th: {
      padding: "12px 16px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "600",
      color: "#6b7280",
      textTransform: "uppercase",
      borderBottom: "1px solid #e5e7eb",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    td: {
      padding: "12px 16px",
      fontSize: "14px",
      color: "#374151",
      borderBottom: "1px solid #f3f4f6",
      verticalAlign: "top",
      overflowWrap: "break-word"
    },
    email: {
      color: "#2563eb",
      wordBreak: "break-all"
    },
    message: {
      whiteSpace: "pre-wrap"
    },
    loading: {
      textAlign: "center",
      color: "#6b7280"
    },
    empty: {
      padding: "16px",
      textAlign: "center",
      color: "#9ca3af"
    },
    colWidths: {
      createdAt: { width: "180px" },
      name: { width: "120px" },
      contact: { width: "150px" },
      email: { width: "200px" },
      message: { width: "100%" }
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={styles.title}>Contact Submissions</h2>

        <button style={styles.exportBtn} onClick={exportToExcel} disabled={exporting}>
          {exporting && <span style={styles.spinner}></span>}
          {exporting ? "Exporting..." : "Export to Excel"}
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={{ ...styles.th, ...styles.colWidths.createdAt }}>Created At</th>
                <th style={{ ...styles.th, ...styles.colWidths.name }}>Name</th>
                <th style={{ ...styles.th, ...styles.colWidths.contact }}>Contact Number</th>
                <th style={{ ...styles.th, ...styles.colWidths.email }}>Email</th>
                <th style={{ ...styles.th, ...styles.colWidths.message }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((item, index) => (
                <tr key={index}>
                  <td style={{ ...styles.td, ...styles.colWidths.createdAt }}>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td style={{ ...styles.td, ...styles.colWidths.name }}>{item.name}</td>
                  <td style={{ ...styles.td, ...styles.colWidths.contact }}>{item.contact_number}</td>
                  <td style={{ ...styles.td, ...styles.colWidths.email, ...styles.email }}>
                    {item.email}
                  </td>
                  <td style={{ ...styles.td, ...styles.colWidths.message, ...styles.message }}>
                    {item.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {contacts.length === 0 && (
            <div style={styles.empty}>No contact records found.</div>
          )}
        </div>
      )}
    </div>
  );
};
