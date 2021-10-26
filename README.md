# EDGAR Filing Scraper API

This is a small, simple API for the SEC's EDGAR system. It supports gathering the most recent filings as well as filings from specific companies. You can also further narrow your search by specifying a statement type (i.e. '10-K', 4).

All endpoints are JSON formatted.

#### Getting Started

Grab / Pull / Download the code and get started by running `npm run start` and a server should open up on port 8000. This port is specified in the `index.js` file so you can change it at will.

The address will be: `localhost:8000/`

#### Looking at Filings

To access the most recent filings got to:

`localhost:8000/filings`

To access the most recent filings from a certain company:

`localhost:8000/filings/%ticker%`

Example: `localhost:8000/filings/AAPL`

To access the most recent filings from a certain company for a certain statement type:

`localhost:8000/filings/%ticker%/%statement%`

Example: `localhost:8000/filings/AAPL/10-K`
