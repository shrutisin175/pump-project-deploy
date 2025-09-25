import React from 'react';

const PumpSparesTable = ({ data }) => {
    return (
        <div>
            <h2>Pump Spares</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pump Make</th>
                        <th>Model</th>
                        <th>Size</th>
                        <th>Part No</th>
                        <th>Part Name</th>
                        <th>MOC</th>
                        <th>Qty Available</th>
                        <th>Unit Price</th>
                        <th>Drg</th>
                        <th>Ref Part List</th>
                        <th>Add to Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((spare, index) => (
                        <tr key={index}>
                            <td>{spare.pumpMake}</td>
                            <td>{spare.model}</td>
                            <td>{spare.size}</td>
                            <td>{spare.partNo}</td>
                            <td>{spare.partName}</td>
                            <td>{spare.moc}</td>
                            <td>{spare.qtyAvailable}</td>
                            <td>{spare.unitPrice}</td>
                            <td>{spare.drg}</td>
                            <td>{spare.refPartList}</td>
                            <td>
                                <button>Add to Cart</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PumpSparesTable;