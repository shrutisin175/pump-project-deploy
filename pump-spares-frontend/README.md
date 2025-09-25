# Pump Spares Frontend

## Overview
This project is a frontend application designed to display pump spare parts. It features a user-friendly interface that allows users to view detailed information about various pump spares when they interact with the "Pump Spares" card.

## Project Structure
The project consists of the following main directories and files:

```
pump-spares-frontend
├── src
│   ├── components
│   │   ├── PumpSparesTable.jsx      # Component to display pump spares in a table format
│   │   └── ProductCard.jsx           # Component representing the "Pump Spares" product card
│   ├── data
│   │   └── pumpSparesData.js         # Data file containing pump spares information
│   ├── App.jsx                        # Main application component
│   └── index.js                      # Entry point of the application
├── package.json                       # NPM configuration file
└── README.md                          # Project documentation
```

## Components

### PumpSparesTable
- **File:** `src/components/PumpSparesTable.jsx`
- **Description:** This component renders a table displaying the pump spares data. It receives data as props and maps through it to create rows for each spare part. The table includes the following columns:
  - Pump Make
  - Model
  - Size
  - Part No
  - Part Name
  - MOC
  - Qty Available
  - Unit Price
  - Drg
  - Ref Part List
  - Add to Cart (button)

### ProductCard
- **File:** `src/components/ProductCard.jsx`
- **Description:** This component represents the card for the "Pump Spares" product. It includes an onClick event that triggers the display of the `PumpSparesTable` when the card is clicked.

## Data
- **File:** `src/data/pumpSparesData.js`
- **Description:** This file exports an array of objects containing the pump spares data for KSB. Each object includes properties corresponding to the columns mentioned above.

## Application
- **File:** `src/App.jsx`
- **Description:** The main application component that imports `ProductCard` and `PumpSparesTable`. It manages the state for displaying the table and conditionally renders the `PumpSparesTable` based on user interaction with the `ProductCard`.

## Entry Point
- **File:** `src/index.js`
- **Description:** This file serves as the entry point of the application, rendering the `App` component into the root DOM element.

## Installation
To install the necessary dependencies, run the following command in the project directory:

```
npm install
```

## Usage
To start the application, use the following command:

```
npm start
```

This will launch the application in your default web browser.

## License
This project is licensed under the MIT License.