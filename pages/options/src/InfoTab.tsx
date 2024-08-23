import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';

const InfoTab = () => {
  return (
    <div className="p-4 max-w-[1200px]">
      <h1 className="text-3xl font-bold mb-8">Extension Information</h1>
      <p className="mt-2 text-white">
        YouTube Addiction Rehab helps foster healthier viewing habits, reducing the time
        spent on distracting or irrelevant content.
      </p>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:pr-4 mb-8 md:mb-0">
          <h2 className="mt-4 mb-2 text-lg font-semibold text-white">Features</h2>
          <div className='flex flex-col gap-4'>
            <div className="flex flex-row gap-4">
              <div className="flex-1 p-4 border border-gray-600 rounded-md">
                <h3 className="text-lg font-semibold text-white">AI Goal Keeper</h3>
                <p className="text-sm text-gray-300">
                  A smart blocker that stops you from wasting time on distracting content. Block videos that are not relevant to your goals.
                </p>
              </div>

              <div className="flex-1 p-4 border border-gray-600 rounded-md">
                <h3 className="text-lg font-semibold text-white">AI Focus Filter</h3>
                <p className="text-sm text-gray-300">
                  A smart filter that helps you focus on the important stuff. Hide anything that can be a distraction.
                </p>
              </div>

            </div>
            <div className="flex-1 p-4 border border-gray-600 rounded-md">
              <h3 className="text-lg font-semibold text-white">No Shorts!</h3>
              <p className="text-sm text-gray-300">
                Shorts are attention black holes. You have the option to hide them all.
              </p>
            </div>
          </div>
          <div className="mt-4">
            We are continuously improving. If you have any feedback, please let us know. &nbsp;
            <a className="text-white underline" target="_blank" href="https://forms.gle/QMjP9kuUTyBndYYL6">
              Leave feedback
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 md:pl-4">
          <h2 className="mt-4 mb-2 text-lg font-semibold text-white">Video Walkthrough</h2>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <iframe
              src="https://www.youtube.com/embed/9ySAWZmxvCc"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', aspectRatio: '1592 / 1080' }}
            ></iframe>
          </div>
        </div>
      </div>

      <div className='mt-4 max-w-[600px]'>
        <h2 className="mt-4 mb-2 text-lg font-semibold text-white">How to Setup Extension with your own API key</h2>
        <p className='mb-2'>
          If you want to use the version that doesn't require an API key, you can
          <a className='text-blue-500' href="https://chromewebstore.google.com/detail/youtube-addiction-rehab/egjcbfpcghillmioipjehaikmekemilk"> install from Chrome Web Store.</a>
        </p>
        <ol className="list-decimal list-inside text-sm text-white">
          <li className='mb-2'>
            <strong>Setup API Key:</strong>
            <p className='mt-2'>
              AI evaluation requires an LLM provider API key to function.
              <br />Get your API key from these providers:
              <ul className='list-disc list-inside my-2'>
                <li>
                  <a className='text-blue-500' href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key">OpenAI</a>
                </li>
                <li>
                  <a className='text-blue-500' href="https://docs.anthropic.com/en/api/getting-started"> Anthropic </a>
                </li>
                <li>
                  <a className='text-blue-500' href="https://console.groq.com/keys"> Groq </a>
                </li>
              </ul>
              Remember to set a quota for the API key to prevent overusage.
            </p>
          </li>
          <li className='mb-2'>
            <strong>Choose AI Model:</strong>
            <p className='mt-2'>
              Go to the settings tab. Enter the API key you got from the previous step.
              <br />Choose an LLM model that you want to use for evaluation.
            </p>
          </li>

          <div className='flex flex-row items-center mb-4 p-2 w-128 border border-gray-600 rounded-md max-w-[500px]'>
            <div className='mr-2'>⚡</div>
            <p className='text-sm text-gray-300'>
              <strong>Recommend starting with smaller models such as Claude 3 Haiku, GPT-4o mini, LLaMA 3.1 70B.</strong>
              <br />They are cheap and fast, with good enough results.
              <br />If you want super low latency, go with Groq LLaMA 3.1 70B.
            </p>
          </div>
          <li className='mb-2'>
            <strong>Other Settings:</strong>
            <p className='mt-2'>
              <ul className='list-disc list-inside'>
                <li>
                  Setup feature you want to turn on the Settings tab.
                </li>
                <li>
                  Setup your goals on the Goals tab.
                </li>
                <li>
                  Once done, you can start watching YouTube. The extension will filter and block content based on your goals and preferences.
                </li>
              </ul>
            </p>
          </li>
        </ol>
        <h2 className="mt-4 mb-2 text-lg font-semibold text-white">Developer's Note</h2>
        <p className="my-2 text-white">
          This extension is still work in progress. If you want to provide feedback or report bugs,
          please fill out this
          <a className='text-blue-500' target='_blank' href="https://forms.gle/dvffa7NFtxXDfLw6A"> form</a>.
        </p>
        <p>
          If you want to contribute to the project, here's the <a className='text-blue-500' target='_blank'
            href="https://github.com/JoeyWangTW/youtube-addiction-rehab-chrome-extension">GitHub Repo</a>.
        </p>
      </div>
    </div >
  );
};

export default withErrorBoundary(withSuspense(InfoTab, <div>Loading...</div>), <div>Error Occurred</div>);
