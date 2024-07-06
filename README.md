<div align="center">
<img src="chrome-extension/public/logo.png" alt="logo" width="128" height="128"/>
<h1> Youtube Addiction Rehab

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/build-zip.yml/badge.svg)

</div>

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Install](#install)
  - [Chrome](#chrome)
  - [Firefox](#firefox)
- [Notes](#notes)
- [Reference](#reference)

## Intro <a name="intro"></a>
YouTube Addiction Rehab is your digital ally against compulsive video watching on YouTube. Utilizing LLM AI technology, this extension curates your viewing experience based on your personal preferences and goals. It helps establish boundaries, promote healthier viewing habits, and minimize distractions from irrelevant content. Gain control and enhance your digital wellbeing with YouTube Addiction Rehab.

> [!NOTE] 
> Join [waitlist](https://forms.gle/93Ew9HLtuBnAUuqF8) to get early access to the packaged version on chrome web store (no pre-requisite intallation and API key needed).

## Features <a name="features"></a>

- AI Content Evaluation: Evaluates the relevance of the recommended content based on your preferences.
- AI Content Filtering: Automatically filters out non-essential recommended content based on your preferences.
- AI Video Blocker: Automatically blocks distracting videos based on your preferences.

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

## Notes 

This extension is still work in progress. Feel free to open an issue or pull request if you want to contribute. If you want to provide feedback, please fill out this [feedback form](https://forms.gle/dvffa7NFtxXDfLw6A).

## Reference <a name="reference"></a>

This extension is based on [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)