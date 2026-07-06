const express = require('express');
const cors = require('cors');

const testRoutes = require('./src/routes/test.routes');
const authRoutes = require("./src/routes/auth.routes");
const newsRoutes = require("./src/routes/news.routes");
const announcementRoutes = require("./src/routes/announcement.routes");
const managementRoutes = require("./src/routes/management.routes");
const companyRoutes = require("./src/routes/company.routes");
const legalityRoutes = require("./src/routes/legality.routes");
const uploadRoutes = require("./src/routes/upload.routes");
const simpananRoutes = require("./src/routes/simpanan.routes");
const penarikanRoutes = require("./src/routes/penarikan.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const anggotaRoutes = require("./src/routes/anggota.routes");
const transaksiRoutes = require("./src/routes/transaksi.routes");
const saldoRoutes = require("./src/routes/saldo.routes");
const adminRoutes = require("./src/routes/admin.routes");
const roleAdminRoutes = require("./src/routes/roleadmin.routes");
const tagihanRoutes = require("./src/routes/tagihan.routes");
const transaksiSetoranRoutes = require("./src/routes/transaksiSetoran.routes");
const settingTagihanRoutes = require("./src/routes/settingTagihan.routes");
const notificationRoutes = require("./src/routes/notification.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('KDKMP API Running');
});

app.use('/api', testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/managements", managementRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/legalities", legalityRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/simpanan", simpananRoutes);
app.use("/api/penarikan", penarikanRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/anggota", anggotaRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/saldo", saldoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/roleadmin", roleAdminRoutes);
app.use("/api/tagihan", tagihanRoutes);
app.use("/api/transaksi-setoran", transaksiSetoranRoutes);
app.use("/api/setting-tagihan", settingTagihanRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;