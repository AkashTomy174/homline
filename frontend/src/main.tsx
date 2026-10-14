import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { AppProvider } from './app';
import Layout from './components/Layout';
import { NotFound } from './lib';
import { PanelForm, PanelHome, PanelLayout, PanelList } from './panel/Panel';
import About from './pages/About';
import { Complaint, ComplaintReceived } from './pages/Complaint';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import { Login, Signup } from './pages/Auth';
import Faqs from './pages/Faqs';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Membership from './pages/Membership';
import Policy from './pages/Policy';
import { MembershipCard, Receipt } from './pages/Print';
import RequestPage from './pages/RequestPage';
import ServiceDetail from './pages/ServiceDetail';
import ServicesList from './pages/ServicesList';
import Track from './pages/Track';
import { UpdateDetail, UpdatesList } from './pages/Updates';

// /panel/:key/:id is shared by every section; users have their own form (password + role).
const SectionForm = () => (useParams().key === 'users' ? <PanelForm users /> : <PanelForm />);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="receipt/:requestId" element={<Receipt />} />
          <Route path="membership/card/:code" element={<MembershipCard />} />
          <Route path="panel" element={<PanelLayout />}>
            <Route index element={<PanelHome />} />
            <Route path=":key" element={<PanelList />} />
            <Route path=":key/new" element={<SectionForm />} />
            <Route path=":key/:id" element={<SectionForm />} />
          </Route>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="membership" element={<Membership />} />
            <Route path="updates" element={<UpdatesList />} />
            <Route path="updates/:slug" element={<UpdateDetail />} />
            <Route path="faqs" element={<Faqs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="track" element={<Track />} />
            <Route path="track/:requestId" element={<Track />} />
            <Route path="request" element={<RequestPage />} />
            <Route path="policy/:name" element={<Policy />} />
            <Route path="complaint-suggestion" element={<Complaint />} />
            <Route path="complaint-suggestion/received/:ref" element={<ComplaintReceived />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
