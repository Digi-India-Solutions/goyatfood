import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import numberToWords from "number-to-words";

const GetAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 20;


const generateInvoicePDF = (order, preview = false) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("GOYAT TRADING CO.", margin, y);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  y += 8;
  doc.text("GSTIN: 03AUWPV0689E1Z2", margin, y);
  y += 6;
  doc.text("Email: info@goyattrading.shop", margin, y);
  y += 6;
  doc.text("Address: Ground Floor, Sco No.20, Vasant Vihar Phase-1,", margin, y);
  y += 6;
  doc.text("Sas Nagar, Patiala, Punjab, 140603", margin, y);
  y += 6;
  doc.text("Website: www.goyattrading.shop", margin, y);

  // === Invoice Info ===
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TAX INVOICE", margin, y);

  doc.setFont("helvetica", "normal");
  y += 7;
  const today = new Date();
  const invoiceDate = today.toLocaleDateString("en-GB");
  doc.text(`Invoice No: #${order.orderUniqueId}`, margin, y);
  doc.text(`Invoice Date: ${invoiceDate}`, pageWidth / 2, y);
  y += 6;
  doc.text(`Bill To: ${order.name}`, margin, y);
  doc.text(`Place of Supply: Punjab`, pageWidth / 2, y);
  y += 6;
  doc.text(`Ship To: ${order.name}`, margin, y);

  // === Table Data ===
  const tableStartY = y + 10;
  const tableData = order.items.map((item, index) => {
    return [
      index + 1,
      item.productName,
      `${item.quantity}`,
      item.grams,
      `Rs.${item.price}`,
    ];
  });

  autoTable(doc, {
    head: [["No", "Item", "QTY", "Weight", "Total"]],
    body: tableData,
    startY: tableStartY,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [30, 144, 255], textColor: 255 },
  });

  // === Totals Box ===
  const taxableAmount = order.items.reduce(
    (acc, item) => acc + item.price / 1.05,
    0
  );
  const cgst = taxableAmount * 0.025;
  const sgst = taxableAmount * 0.025;
  const totalAmount = order.totalAmount;
  const discount = 0.03;
  const balance = 0;

 const summaryLines = [
  { label: "Taxable Amount", value: `Rs.${taxableAmount.toFixed(2)}` },
  { label: "CGST @2.5%", value: `Rs.${cgst.toFixed(2)}` },
  { label: "SGST @2.5%", value: `Rs.${sgst.toFixed(2)}` },
  { label: "Discount -", value: `Rs.${discount.toFixed(2)}` },
  { label: "Total Amount", value: `Rs.${totalAmount.toFixed(2)}` },
  { label: "Received Amount", value: `Rs.${totalAmount.toFixed(2)}` },
  { label: "Balance", value: `Rs.${balance.toFixed(2)}` },
];

 const boxMarginTop = 10;
const boxPadding = 5;
const lineHeight = 6;
const boxY = doc.lastAutoTable.finalY + boxMarginTop;
const boxHeight = summaryLines.length * lineHeight + boxPadding * 2;
const boxWidth = pageWidth - margin * 2;

  // Draw box
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, boxY, boxWidth, boxHeight);

  // Text inside box
 doc.setFont("helvetica", "normal");
doc.setFontSize(10);

  let sy = boxY + boxPadding + 2;

 summaryLines.forEach(({ label, value }) => {
  // Left-aligned label
  doc.text(label, margin + 5, sy);

  // Right-aligned value
  const valueWidth = doc.getTextWidth(value);
  doc.text(value, margin + boxWidth - 5 - valueWidth, sy);

  sy += lineHeight;
});

 const [rs, ps = "00"] = totalAmount.toFixed(2).split(".");
const inWords = `${numberToWords
  .toWords(+rs)
  .replace(/\b\w/g, (l) => l.toUpperCase())} Rupees and ${numberToWords
  .toWords(+ps)
  .replace(/\b\w/g, (l) => l.toUpperCase())} Paise`;

// Set helvetica italic before text
sy += 10;

doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text("Total Amount (in words):", margin, sy);
doc.text(inWords, margin, sy + 6);

  

  // === Preview or Save ===
  if (preview) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save(`${order.orderUniqueId}.pdf`);
  }
};


  const fetchOrders = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.goyattrading.shop/api/get-all-orders?page=${page}&limit=${limit}`
      );
      if (response.status === 200) {
        const { data, totalCount } = response.data;
        setOrders(data || []);
        setTotalPages(Math.ceil(totalCount / limit));
      } else {
        toast.error("Failed to fetch orders!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Error fetching orders!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, limit);
  }, [currentPage, limit]);

  const handleDelete = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `https://api.goyattrading.shop/api/delete-upload-order/${orderId}`
        );
        if (response.status === 200) {
          toast.success("Order deleted successfully!");
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order._id !== orderId)
          );
          //   fetchOrders(currentPage, limit);
        } else {
          toast.error("Failed to delete order.");
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the order.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage, limit });
    }
  };

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>All Orders</h4> 
        <Link to="/upload-orders" className="btn btn-primary">
          <i className="fa-solid fa-file-import me-2"></i> Upload Orders
        </Link>
      </div>

      <section>
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>UPI ID</th>
              <th>Products</th>
              <th>Pdf</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{(currentPage - 1) * limit + index + 1}</td>
                  <td>{order.orderUniqueId}</td>
                  <td>{order.name}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.upiId || "-"}</td>
                  <td>
                    {order.items?.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            {item.productName} – {item.quantity} qty,{" "}
                            {item.grams}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No items"
                    )}
                  </td>
                 <td className="text-nowrap">
  <div className="d-flex gap-2">
    <button
      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
      onClick={() => generateInvoicePDF(order, true)}
    >
      <i className="fa-solid fa-eye"></i> Preview
    </button>

    <button
      className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
      onClick={() => generateInvoicePDF(order, false)}
    >
      <i className="fa-solid fa-download"></i> Download
    </button>
  </div>
</td>

                  <td>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← Prev
          </button>

          {/* Page numbers with ellipsis */}
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .reduce((acc, page, i, arr) => {
              if (i > 0 && page - arr[i - 1] > 1) {
                acc.push("ellipsis");
              }
              acc.push(page);
              return acc;
            }, [])
            .map((page, index) =>
              page === "ellipsis" ? (
                <span key={index} className="mx-2">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`btn btn-sm ${
                    currentPage === page
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}

          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      </section>
    </>
  );
};

export default GetAllOrders;
