import type { DeadlockResult } from "../App";

interface InfoBoxProps {
  title: string;
  deadlockResult?: DeadlockResult | null;
  showSuggestions?: boolean;
}

export default function InfoBox({ title, deadlockResult, showSuggestions }: InfoBoxProps) {
  return (
    <div className="bg-white dark:bg-[#1d1f24] rounded-xl shadow-xl min-h-[150px] p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        {title}
      </h2>
      {title === "Deadlock Detection" && deadlockResult && (
        <div className="text-sm space-y-2">
          <div className={`p-2 rounded ${deadlockResult.hasDeadlock ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'}`}>
            <strong>Status:</strong> {deadlockResult.hasDeadlock ? '⚠️ Deadlock Detected!' : '✓ No Deadlock'}
          </div>
          
          {deadlockResult.cycles.length > 0 && (
            <div className="mt-2">
              <strong className="text-gray-700 dark:text-gray-300">Cycles Found:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                {deadlockResult.cycles.map((cycle, idx) => (
                  <li key={idx} className="text-gray-600 dark:text-gray-400">
                    {cycle.join(' → ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {deadlockResult.mutualExclusions.length > 0 && (
            <div className="mt-2">
              <strong className="text-gray-700 dark:text-gray-300">Mutual Exclusion:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                {deadlockResult.mutualExclusions.map((resourceId, idx) => (
                  <li key={idx} className="text-gray-600 dark:text-gray-400">
                    {resourceId} has multiple requests
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {deadlockResult.holdAndWait.length > 0 && (
            <div className="mt-2">
              <strong className="text-gray-700 dark:text-gray-300">Hold and Wait Condition:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                {deadlockResult.holdAndWait.map((processId, idx) => (
                  <li key={idx} className="text-yellow-600 dark:text-yellow-400">
                    Process {processId} is holding resources and waiting for additional resources
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {title === "Summary" && showSuggestions && deadlockResult && (
        <div className="text-sm space-y-2">
          <div className="mb-2">
            <strong className="text-gray-700 dark:text-gray-300">💡 Resolution Suggestions:</strong>
          </div>
          <ul className="list-disc list-inside space-y-2 text-xs">
            {deadlockResult.suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
