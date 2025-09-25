import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import SalesContainer from "./Website/SalesContainer";
import EnergySavingExpertise from "./Website/EnergySavingExpertise";

import PrecisionPumpRepair from "./Website/PrecisionPumpRepair";
import ReverseEngineeringPage from "./Website/ReverseEngineeringPage";
import ReverseEngineeringDocs from "./Website/ReverseEngineeringDocs";
import ReverseEngineeringContent from "./Website/ReverseEngineeringContent";
import InventoryMinimizationContent from "./Website/InventoryMinimizationContent";
import EnergyOptimization from "./Website/EnergyOptimization";
import OperationalPhilosophy from "./Website/OperationalPhilosophy";

import EnergySavingPage from "./Website/EnergySavingPage";
import EnergyAudit from "./Website/EnergyAudit";
import InventoryMinimization from "./Website/InventoryMinimization";
import InventoryDetails from "./Website/InventoryDetails";
import LoginRegister from "./Website/LoginRegister";
import UserProfile from "./Website/UserProfile";
import AboutUs from "./Website/AboutUs";
import ContactUs from "./Website/ContactUs";
import PumpPartsForm from "./Website/PumpPartsForm";
import PumpDetailsForm from "./Website/PumpDetailsForm";
import EnergyOptimizationForm from "./Website/EnergyOptimizationForm";
import EnergyOptimizationResultsPage from "./Website/EnergyOptimizationResultsPage";
import SimpleTestForm from "./Website/SimpleTestForm";
import TermsConditions from "./Website/TermsConditions";
import PrivacyPolicy from "./Website/PrivacyPolicy";
import Products from "./Website/Products";
import Services from "./Website/Services";
import PumpSpares from "./Website/PumpSpares";
import CentrifugalPumps from "./Website/CentrifugalPumps";
import AlliedProducts from "./Website/AlliedProducts";
import Cart from "./Website/Cart";


function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SalesContainer />} />
          <Route
            path="/energy-saving-expertise"
            element={<Navigate to="/services" replace />}
          />
          <Route
            path="/reliable-rebuilds"
            element={<Navigate to="/reverse-engineering" replace />}
          />
          <Route
            path="/precision-pump-repair"
            element={<Navigate to="/Products" replace />}
          />
          <Route
            path="/reverse-engineering"
            element={<ReverseEngineeringPage />}
          />
          <Route
            path="/reverse-engineering-docs"
            element={<ReverseEngineeringDocs />}
          />
          <Route
            path="/reverse-engineering-content"
            element={<ReverseEngineeringContent />}
          />
          <Route path="/energy-saving" element={<EnergySavingPage />} />
          <Route path="/energy-audit" element={<EnergyAudit />} />
          <Route path="/energy-optimization" element={<EnergyOptimization />} />
          <Route path="/operational-philosophy" element={<OperationalPhilosophy />} />
          <Route path="/inventory-minimization" element={<InventoryMinimization/>}/>
          <Route path="/inventory-minimization-content" element={<InventoryMinimizationContent />} />
          <Route path="/inventory-details" element={<InventoryDetails />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/pump-parts" element={<PumpPartsForm />} />
          <Route path="/pump-details-form" element={<PumpDetailsForm />} />
          <Route path="/energy-optimization-form" element={<EnergyOptimizationForm />} />
          <Route path="/energy-optimization-results" element={<EnergyOptimizationResultsPage />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pump-spares" element={<PumpSpares />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/centrifugal-pumps" element={<CentrifugalPumps />} />
          <Route path="/allied-products" element={<AlliedProducts />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
