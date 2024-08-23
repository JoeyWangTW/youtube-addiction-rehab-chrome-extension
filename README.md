<div align="center">
<img src="chrome-extension/public/logo.png" alt="logo" width="128" height="128"/>
<h1> Youtube Addiction Rehab

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/build-zip.yml/badge.svg)

<a href="https://chromewebstore.google.com/detail/youtube-addiction-rehab/egjcbfpcghillmioipjehaikmekemilk"><img src="demo/avaliable_in_chrome_web_store.png" alt="Get Youtube Addiciton Rehab for Chromium" width="300px"></a>

<img src="demo/hero.jpeg" alt="hero" width="100%" />
</div>

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Install](#install)
  - [Chrome](#chrome)
  - [Firefox](#firefox)
  - [Safari](#safari)
- [Notes](#notes)
- [Reference](#reference)

## Intro <a name="intro"></a>
YouTube Addiction Rehab is your digital ally against compulsive video watching on YouTube. Utilizing LLM AI technology, this extension curates your viewing experience based on your personal preferences and goals. It helps establish boundaries, promote healthier viewing habits, and minimize distractions from irrelevant content. Gain control and enhance your digital wellbeing with YouTube Addiction Rehab.

> [!NOTE] 
> Packaged version is available on [Chrome Web Store](https://chromewebstore.google.com/detail/youtube-addiction-rehab/egjcbfpcghillmioipjehaikmekemilk).
> Checkout more info on [YouTubeAddiction.Rehab](https://youtubeaddiction.rehab).
## Features <a name="features"></a>

- AI Focus Filter: Automatically filters out non-essential recommended content based on your preferences.
- AI Smart Blocker: Automatically blocks distracting videos based on your preferences.
- Hide shorts: Automatically hides shorts from your recommended feed.

## Prerequisites <a name="prerequisites"></a>

1. Clone this repo: `git clone https://github.com/Jonghakseo/youtube-addiction-rehab.git`
2. Install [Node.js](https://nodejs.org/en/) (check your node version >= 18.12.0) 
3. Install [pnpm](https://pnpm.io/) 
  a. Install pnpm globally: `npm install -g pnpm`
  b. Run `pnpm install`
4. Get API key from [OpenAI](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key) or [Anthropic](https://docs.anthropic.com/en/api/getting-started), recommend upgrade to paid plan for higher rate limit.

## Install <a name="install"></a>

1. Run:
   - Dev: `pnpm dev` (it's run parallel with `pnpm dev-server` automatically)
     - When you run with Windows, you should run as
       administrator. [(Issue#456)](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/456)
   - Prod: `pnpm build`
2. Open in browser - `chrome://extensions`
3. Check - `Developer mode`
4. Find and Click - `Load unpacked extension`
5. Select - `dist` folder at root

### For Firefox: <a name="firefox"></a>

1. Run:
   - Dev: `pnpm dev:firefox` (it's run parallel with `pnpm dev-server` automatically)
   - Prod: `pnpm build:firefox`
2. Open in browser - `about:debugging#/runtime/this-firefox`
3. Find and Click - `Load Temporary Add-on...`
4. Select - `manifest.json` from `dist` folder at root

<i>Remember in firefox you add plugin in temporary mode, that's mean it's disappear after close browser, you must do it again, on next launch.</i>

### For Safari: <a name="safari"></a>
  Follow this [guide](https://developer.apple.com/documentation/safariservices/converting-a-web-extension-for-safari) to convert this extension to Safari.

## Notes 

This extension is still work in progress. Feel free to open an issue or pull request if you want to contribute. If you want to provide feedback, please fill out this [feedback form](https://forms.gle/dvffa7NFtxXDfLw6A).

## Reference <a name="reference"></a>

This extension is based on [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)