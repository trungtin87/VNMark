import React from "react";

/**
 * Nếu có lỗi JavaScript xảy ra khi React đang vẽ giao diện (vd một
 * extension Tiptap lỗi, thiếu dữ liệu...), mặc định React sẽ chỉ để lại
 * màn hình trắng im lặng. Bọc <App/> trong Error Boundary này để luôn
 * hiện được thông báo lỗi cụ thể, giúp chẩn đoán nhanh thay vì đoán mò.
 */
export default class ManChanLoi extends React.Component {
  constructor(props) {
    super(props);
    this.state = { coLoi: false, loi: null };
  }

  static getDerivedStateFromError(loi) {
    return { coLoi: true, loi };
  }

  componentDidCatch(loi, thongTin) {
    console.error("VNMark — lỗi khi vẽ giao diện:", loi, thongTin);
  }

  render() {
    if (!this.state.coLoi) return this.props.children;
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.8rem",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
          background: "#fbfaf6",
          color: "#24261f",
        }}
      >
        <h2 style={{ margin: 0 }}>VNMark gặp lỗi khi khởi động</h2>
        <p style={{ maxWidth: 480, color: "#6b6a5e", fontSize: "0.9rem" }}>
          Vui lòng chụp lại thông báo lỗi bên dưới để báo cho người phát triển. Mở DevTools (Ctrl+Shift+I) để xem đầy
          đủ log.
        </p>
        <pre
          style={{
            maxWidth: "90vw",
            overflow: "auto",
            background: "#fff",
            border: "1px solid #dedad0",
            borderRadius: 8,
            padding: "1rem",
            fontSize: "0.78rem",
            textAlign: "left",
          }}
        >
          {String(this.state.loi?.stack || this.state.loi)}
        </pre>
        <button
          onClick={() => window.location.reload()}
          style={{
            border: "none",
            background: "#2f5d50",
            color: "#fff",
            padding: "0.5rem 1.1rem",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Tải lại
        </button>
      </div>
    );
  }
}
