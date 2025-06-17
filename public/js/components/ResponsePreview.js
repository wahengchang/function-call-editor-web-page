// ResponsePreview.js
// Displays the API response or error
// Uses vanilla JS and Tailwind CSS

export default {
  name: 'ResponsePreview',
  props: ['response', 'error'],
  data() {
    return {
      viewMode: 'plain' // 'plain', 'function_call', 'completion', 'json'
    };
  },
  computed: {
    parsedResponse() {
      if (!this.response) return null;
      try {
        return JSON.parse(this.response);
      } catch {
        return null;
      }
    },
    functionCallArgsJson() {
      // Try to extract function_call.arguments and pretty-print as JSON
      const data = this.parsedResponse;
      try {
        let args = data.choices[0].message.function_call.arguments;

        console.log('args: ', args)

        return this.prettyPrintJson(args);
      } catch {
        return 'No function_call.arguments found or not valid JSON.';
      }
    },
    completionResult() {
      // Try to extract completion result (assistant message content)
      const data = this.parsedResponse;
      try {
        return data.choices?.[0]?.message?.content || 'No completion result found.';
      } catch {
        return 'No completion result found.';
      }
    },
    prettyJson() {
      if (!this.response) return '';
      return this.prettyPrintJson(this.response);
    }
  },
  methods: {
    prettyPrintJson(val) {
      console.log('val: ', val)

      if (!val) return '';
      try {
        return typeof val === 'string' 
          ? JSON.stringify(JSON.parse(val), null, 2) 
          : JSON.stringify(val, null, 2);
      } catch {
        return 'Not valid JSON.';
      }
    },
  },
  template: `
    <div class="bg-gray-50 border border-gray-200 rounded-xl shadow-inner p-4 overflow-auto min-h-[360px] max-h-[600px] min-w-[200px]">
      <div class="flex items-center mb-2">
        <h2 class="text-xs font-semibold text-gray-700">API Response</h2>
        <select v-model="viewMode" class="text-xs border rounded px-1 py-0.5 bg-white ml-2">
          <option value="plain">Plain Text</option>
          <option value="function_call">Function Call Args</option>
          <option value="completion">Completion Result</option>
          <option value="json">View JSON</option>
        </select>
      </div>
      <div v-if="!response && !error" class="text-gray-400 italic text-xs">No response yet.</div>
      <div v-else-if="error" class="mt-3 text-red-500 font-mono text-xs whitespace-pre-line">{{ error }}</div>
      <div v-else>
        <div v-if="viewMode === 'plain'" class="bg-gray-200 rounded p-2 text-green-800 font-mono text-xs whitespace-pre-line break-all" style="max-height:520px;overflow:auto">{{ response }}</div>
        <div v-else-if="viewMode === 'function_call'" class="bg-gray-200 rounded p-2 text-blue-900 font-mono text-xs whitespace-pre break-all" style="max-height:520px;overflow:auto">{{ functionCallArgsJson }}</div>
        <div v-else-if="viewMode === 'completion'" class="bg-gray-200 rounded p-2 text-purple-900 font-mono text-xs whitespace-pre-line break-all" style="max-height:520px;overflow:auto">{{ completionResult }}</div>
        <div v-else-if="viewMode === 'json'" class="bg-gray-200 rounded p-2 text-gray-900 font-mono text-xs whitespace-pre break-all" style="max-height:520px;overflow:auto">{{ prettyJson }}</div>
      </div>
    </div>
  `
};
