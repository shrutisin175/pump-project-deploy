import React from 'react';
import PumpSparesTable from './PumpSparesTable';
import { useState } from 'react';
import pumpSparesData from '../data/pumpSparesData';

const ProductCard = () => {
    const [showTable, setShowTable] = useState(false);

    const handleCardClick = () => {
        setShowTable(!showTable);
    };

    return (
        <div>
            <div className="product-card" onClick={handleCardClick}>
                <h2>Pump Spares</h2>
                <p>Click to view available pump spares.</p>
            </div>
            {showTable && <PumpSparesTable data={pumpSparesData} />}
        </div>
    );
};

export default ProductCard;