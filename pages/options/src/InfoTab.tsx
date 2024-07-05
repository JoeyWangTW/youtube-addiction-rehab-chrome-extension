import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';

const InfoTab = () => {
  return (
    <div className="p-4 max-w-[600px]">
      <h1 className="text-3xl font-bold mb-8">Extension Information</h1>
      <p className="mt-2 text-white">
        YouTube Addiction Rehab is your digital ally in combating excessive and compulsive video watching habits on YouTube.
        Designed to intervene in the mechanisms that promote addictive behavior, this extension uses LLM AI technology
        to curate and control the influx of content based on your personal preferences and goals. By empowering users to set
        boundaries around what they watch, YouTube Addiction Rehab helps foster healthier viewing habits, reducing the time
        spent on distracting or irrelevant content.
      </p>

      <h2 className="mt-4 mb-2 text-lg font-semibold text-white">Key Features</h2>
      <ul className="list-disc text-sm list-inside text-white">
        <li className='mb-2'>
          <strong>AI Content Evaluation:</strong> Evaluates the relevance of the recommended content based on your preferences.
        </li>
        <li className='mb-2'>
          <strong>AI Content Filtering:</strong> Automatically filters out non-essential recommended content based on your
          preferences.
        </li>
        <li>
          <strong>AI Video Blocker:</strong> Automatically blocks distracting videos based on your preferences.
        </li>
      </ul>

      <h2 className="mt-4 mb-2 text-lg font-semibold text-white">How to Use</h2>
      <ol className="list-decimal list-inside text-sm text-white">
        <li className='mb-2'>
          <strong>Setup API Key:</strong>
          <p className='mt-2'>
            AI evaluation requires an API key to function.
            get your API key from{' '}
            <a className='text-blue-500' href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key">OpenAI</a> or
            <a className='text-blue-500' href="https://docs.anthropic.com/en/api/getting-started"> Anthropic </a>
            and enter it in the settings tab. Remember to set a quota for the API key to prevent overusage.
          </p>

          <p>
            Join our <a className='text-blue-500' target='_blank'
              href="https://forms.gle/UKEvxLEg8vrR6XCX6"> Waitlist </a> to get access to the version that doesn't require an API key.
          </p>
        </li>
        <li className='mb-2'>
          <strong>Choose AI Model:</strong>
          <p className='mt-2'>
            Go to the settings tab. Choose the AI model that you want to use for evaluation. GPT-4o and Claude 3.5 Sonnet is more accurate but slower and more expensive.
            GPT-3.5 and Claude 3 Haiku is faster and cheaper but less accurate.
          </p>
        </li>

        <div className='flex flex-row items-center mb-4 p-2 w-128 border border-gray-600 rounded-md'>
          <div className='mr-2'>⚡</div>
          <p className='text-sm text-gray-300'>
            Recommend using <strong>Anthropic - Claude 3 Haiku </strong>
            for good results, cost-efficiency, and quick response times.
          </p>
        </div>
        <li className='mb-2'>
          <strong>Enable AI Blocker and Filter:</strong>
          <p className='mt-2'>
            Go to the settings tab. Enable the AI Blocker and Filter. This will block distracting videos and filter out non-essential content.
          </p>
        </li>
        <li className='mb-2'>
          <strong>Setup Goals:</strong>
          <p className='mt-2'>
            Go to the goals tab and set your goals. What you've input will be used to evaluate the content that the extension recommends.
            The more specific your goals, the more accurate the recommendations will be.
            You can also update your goals by pressing the extension icon.
          </p>
        </li>
        <li className='mb-2'>
          <strong>Start Watching:</strong>
          <p className='mt-2'>
            Once finished the following setup, you can start watching YouTube. The extension will filter and block content based on your goals and preferences.
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
  );
};

export default withErrorBoundary(withSuspense(InfoTab, <div>Loading...</div>), <div>Error Occurred</div>);
