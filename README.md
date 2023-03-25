# Excursia

Excursia is an itinerary generator web app that allows users to create a personalized travel plan based on their location, interests, and time constraints. By inputting preferences, users can generate an itinerary featuring local points of interest.

## Features

- Customizable search parameters, including location, search radius, and time constraints
- Drag-and-drop functionality to reorder activities
- Integration with Google Places API for detailed activity information

## Installation

Follow these steps to set up and run a local copy of Excursia on your machine:

### Prerequisites

- Node.js 14.x or later (https://nodejs.org/)
- npm 7.x or later (comes with Node.js)

### Clone the repository

First, clone the repository to your local machine:

```
git clone https://github.com/yourusername/excursia.git
cd excursia
```

### Install dependencies
Next, install the required dependencies:

```
npm install
```

### Configure environment variables
Create a ```.env.local file``` in the project's root directory and populate it with the necessary environment variables:
```
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key
MONGO_DB_URI=your_mongodb_connection_uri
DB_NAME=your_mongodb_database_name
```
Replace your_google_maps_api_key with your Google Maps API key, and your_mongodb_connection_uri and your_mongodb_database_name with your MongoDB connection URI and database name, respectively.

### Start the development server
Finally, start the development server:
```
npm run dev
```
Now you can access the app on your browser at http://localhost:3000.