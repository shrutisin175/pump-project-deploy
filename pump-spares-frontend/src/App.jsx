import React, { useState } from 'react';
import ProductCard from './components/ProductCard';
import PumpSparesTable from './components/PumpSparesTable';
import pumpSparesData from './data/pumpSparesData';

const App = () => {
    const [showTable, setShowTable] = useState(false);

    const handleCardClick = () => {
        setShowTable(true);
    };

    return (
        <div>
            <h1>Product Section</h1>
            <ProductCard onClick={handleCardClick} />
            {showTable && <PumpSparesTable data={pumpSparesData} />}
        </div>
    );
};

export default App;