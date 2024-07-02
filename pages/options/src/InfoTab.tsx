import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';

const InfoTab = () => {
  return (
    <div className="p-4 max-w-[600px]">
      <h1 className="text-3xl font-bold mb-8">Extension Information</h1>
      <p className="mt-2 text-white">
        This extension aims to enhance your digital experience by providing features that help manage and filter your
        digital content. Whether you’re looking to block distractions, organize your tasks, or secure your online
        environment, this tool is designed to assist you efficiently and effectively.
      </p>

      <h2 className="mt-4 text-lg font-semibold text-white">Key Features</h2>
      <ul className="list-disc list-inside text-white">
        <li>
          <strong>AI Content Filtering:</strong> Automatically filters out non-essential content based on your
          preferences.
        </li>
        <li>
          <strong>Goal Setting:</strong> Allows you to set specific objectives and track your progress towards these
          goals.
        </li>
        <li>
          <strong>Privacy Enhancements:</strong> Provides additional layers of privacy to secure your online activities.
        </li>
      </ul>

      <h2 className="mt-4 text-lg font-semibold text-white">How to Use</h2>
      <p className="text-white">
        To start using the extension, navigate to the settings tab and enter your preferences and API key if necessary.
        Set your goals in the goals tab to begin tracking your progress. You can toggle AI features on and off according
        to your needs.
      </p>
    </div>
  );
};

export default withErrorBoundary(withSuspense(InfoTab, <div>Loading...</div>), <div>Error Occurred</div>);
