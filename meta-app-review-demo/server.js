const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const state = {
  connected: false,
  profile: null,
  selectedPage: null,
  leads: [],
};

const mockProfile = {
  id: "10215012345678901",
  name: "Carlos Méndez",
  picture:
    "https://api.dicebear.com/7.x/initials/svg?seed=Carlos%20Mendez&backgroundColor=ff5a1f&textColor=ffffff",
};

const mockPages = [
  {
    id: "100123456789",
    name: "Inmobiliaria Méndez Propiedades",
    category: "Real Estate Agency",
    fan_count: 4820,
    picture:
      "https://api.dicebear.com/7.x/shapes/svg?seed=mendez&backgroundColor=0a0a0a",
  },
  {
    id: "100987654321",
    name: "Méndez Alquileres",
    category: "Real Estate Service",
    fan_count: 1240,
    picture:
      "https://api.dicebear.com/7.x/shapes/svg?seed=alquileres&backgroundColor=2a2a2a",
  },
  {
    id: "100555444333",
    name: "Loteos Costa Atlántica",
    category: "Real Estate Developer",
    fan_count: 670,
    picture:
      "https://api.dicebear.com/7.x/shapes/svg?seed=loteos&backgroundColor=6b6b6b",
  },
];

const incomingLeads = [
  {
    id: "lead_7720981234",
    form_id: "form_consulta_propiedad_v2",
    ad_id: "23854012345670123",
    campaign_id: "23854012345660098",
    created_time: null,
    full_name: "Lucía Fernández",
    email: "lucia.fernandez@example.com",
    phone: "+54 9 223 555 1234",
    field_data: [
      { name: "tipo_propiedad", value: "Departamento 2 ambientes" },
      { name: "zona", value: "Playa Grande, Mar del Plata" },
      { name: "presupuesto", value: "USD 80.000 — 110.000" },
      { name: "horario_contacto", value: "Tarde" },
    ],
    assigned_to: { name: "Sofía Pereyra", email: "sofia@mendez-propiedades.com" },
    email_sent: true,
  },
  {
    id: "lead_7720981235",
    form_id: "form_consulta_propiedad_v2",
    ad_id: "23854012345670456",
    campaign_id: "23854012345660098",
    created_time: null,
    full_name: "Martín Rodríguez",
    email: "mrodriguez@example.com",
    phone: "+54 9 223 555 5678",
    field_data: [
      { name: "tipo_propiedad", value: "Casa 3 ambientes con patio" },
      { name: "zona", value: "Constitución, Mar del Plata" },
      { name: "presupuesto", value: "USD 150.000 — 200.000" },
      { name: "horario_contacto", value: "Mañana" },
    ],
    assigned_to: { name: "Diego Álvarez", email: "diego@mendez-propiedades.com" },
    email_sent: true,
  },
  {
    id: "lead_7720981236",
    form_id: "form_consulta_alquiler_v1",
    ad_id: "23854012345670789",
    campaign_id: "23854012345660099",
    created_time: null,
    full_name: "Camila Torres",
    email: "camila.torres@example.com",
    phone: "+54 9 223 555 9012",
    field_data: [
      { name: "tipo_propiedad", value: "Monoambiente para alquilar" },
      { name: "zona", value: "Centro, Mar del Plata" },
      { name: "presupuesto", value: "AR$ 350.000 / mes" },
      { name: "horario_contacto", value: "Indistinto" },
    ],
    assigned_to: { name: "Sofía Pereyra", email: "sofia@mendez-propiedades.com" },
    email_sent: true,
  },
];

// --- OAuth flow (simulated) -----------------------------------------------

app.get("/api/oauth/start", (req, res) => {
  res.redirect("/oauth-consent.html");
});

app.post("/api/oauth/callback", (req, res) => {
  state.connected = true;
  state.profile = { ...mockProfile };
  state.selectedPage = null;
  state.leads = [];
  res.json({ ok: true });
});

// --- Profile (public_profile) ---------------------------------------------

app.get("/api/me", (req, res) => {
  if (!state.connected) return res.status(401).json({ error: "not_connected" });
  res.json(state.profile);
});

// --- Pages list (pages_show_list) -----------------------------------------

app.get("/api/pages", (req, res) => {
  if (!state.connected) return res.status(401).json({ error: "not_connected" });
  res.json({ data: mockPages });
});

app.post("/api/pages/select", (req, res) => {
  const { pageId } = req.body;
  const page = mockPages.find((p) => p.id === pageId);
  if (!page) return res.status(404).json({ error: "page_not_found" });
  state.selectedPage = page;
  state.leads = [];
  res.json({ ok: true, page });
});

app.get("/api/pages/selected", (req, res) => {
  res.json({ page: state.selectedPage });
});

// --- Leads webhook + retrieval (leads_retrieval) --------------------------

app.post("/api/webhook/lead", (req, res) => {
  if (!state.selectedPage) return res.status(400).json({ error: "no_page_selected" });
  const next = incomingLeads[state.leads.length % incomingLeads.length];
  const lead = {
    ...next,
    id: `${next.id}_${Date.now()}`,
    created_time: new Date().toISOString(),
    page_id: state.selectedPage.id,
    page_name: state.selectedPage.name,
  };
  state.leads.unshift(lead);
  res.json({ ok: true, lead });
});

app.get("/api/leads", (req, res) => {
  res.json({ data: state.leads });
});

app.get("/api/leads/:id", (req, res) => {
  const lead = state.leads.find((l) => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: "not_found" });
  res.json(lead);
});

// --- Disconnect -----------------------------------------------------------

app.post("/api/disconnect", (req, res) => {
  state.connected = false;
  state.profile = null;
  state.selectedPage = null;
  state.leads = [];
  res.json({ ok: true });
});

// --- Reset (for re-recording the video) -----------------------------------

app.post("/api/reset", (req, res) => {
  state.connected = false;
  state.profile = null;
  state.selectedPage = null;
  state.leads = [];
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`\nQuasor demo running on http://localhost:${PORT}`);
  console.log("Open that URL in your browser and follow README.md to record the video.\n");
});
