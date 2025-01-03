
# AEHSTweet - Frontend for PWA Project [Semester 7]

<b>AEHSTweet</b> is a <i>Progressive Web App (PWA)</i> built using <b>React.js</b> that allows users to post tweets, interact with tweets, and view posts from other users. The app supports offline functionality and provides a smooth user experience for both mobile and desktop users.

## Features
- User registration and login
- Post and view tweets
- Post tweets images by either uploading or capturing from device camera
- Speech to Text feature using device Microphone
- Offline functionality via Service Worker (SW)
- App can be installed on both Desktop and Mobile devices
- Keep tracks of the current user location in the cache
- Clean and responsive design


## <a href="https://aehs-tweet-client.onrender.com/">Live Demo</a>
## <a href='https://github.com/javokhirbek1999/uehs-tweet-backend' target='_blank'>Backend repository</a>



## Prerequisites

Ensure that the following tools are installed on your local development machine:

1. **Node.js** (v23.4 or higher)  
   You can download it from [Node.js official site](https://nodejs.org/).

2. **Yarn** (optional but recommended)  
   Yarn is used for package management in this project. You can install it from [Yarn official site](https://classic.yarnpkg.com/lang/en/docs/install/).

3. **React (v19.0.0)**  
   React is the main library used for the frontend development.

## Getting Started

Follow these steps to install and run the AEHSTweet project locally.

### 1. Clone the repository

Clone the AEHSTweet repository to your local machine:

`git clone https://github.com/javokhirbek1999/aehs-tweet-client`  
`cd aehs-tweet-client`

### 2. Install dependencies

Navigate to the project folder and install the required dependencies using Yarn:

`yarn install`

If you don't have Yarn installed, you can use `npm` instead:

`npm install`

### 3. Set up the environment

Before running the app, you may need to configure a few environment variables to connect to the backend API (e.g., `localhost:8000`).

Make sure to clone and run the <a href="https://github.com/javokhirbek1999/uehs-tweet-backend" target="_blank">backend</a>.
Once the backend is running in your `localhost:8000`, you need to set the `API_URL` point to `localhost:8000/api` in `src/api.js`.

### 4. Run the app locally

To run the app locally in development mode, use the following command:

`yarn start`

Or with npm:

`npm start`

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

### 5. Build for production

To build the app for production (optimized for performance and ready for deployment), run:

`yarn build`

Or with npm:

`npm run build`

This will create a `build` directory with all the compiled files that are ready to be served by a web server.

### 6. Test Offline Capabilities

To test the offline capabilities of the Progressive Web App, follow these steps:

1. Open the app in your browser.
2. Turn off your internet connection.

## Contributing

We welcome contributions! Please fork the repository, create a feature branch, and submit a pull request for any improvements or fixes. Be sure to include tests for any new features or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
