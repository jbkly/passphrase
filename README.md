# Passphrase

Quickly generate a secure, random passphrase

## What is this?

[Why passphrases are better than passwords](https://xkcd.com/936/)

I created this tool to generate individual passwords that are random and hard to crack with password dictionaries, but also easy to remember (temporarily) and type when needed. Hopefully you're using a password manager and will rarely need to type these, but if your bank login page [disables autofill](https://i.imgur.com/YL52aPq.gif), or you have to login to an app on your gaming console, you might appreciate not choosing `4NxaVh2d7Q32JTy#R1LHv%` as your password. 

It uses the [10,000 most commonly used English words](https://github.com/first20hours/google-10000-english) from Google Ngram (minus a few offensive ones). You can generate random combinations and/or customize your passphrase a bit (more customization options are on my todo list).

The phrase is automatically copied to your clipboard as you generate or type it (if your browser supports it). Your selected options are saved to `localstorage` for repeat visits.

## Development

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000) with live reloading.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder, bundles React in production mode and optimizes the build for the best performance.

### `npm run deploy`

Builds and deploys the app to the `gh-pages` branch for Github Pages
