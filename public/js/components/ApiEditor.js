// ApiEditor.js
// A form component for editing API call parameters
// Uses vanilla JS and Tailwind CSS

export default {
  name: 'ApiEditor',
  props: [
    'apiKey', 'model', 'messages', 'functions', 'function_call', 'error', 'requestId'
  ],
  emits: ['update:apiKey', 'update:model', 'update:messages', 'update:functions', 'update:function_call', 'submit'],
  data() {
    return {
      messagesJsonError: '',
      functionsJsonError: '',
      loading: false
    };
  },
  mounted() {
    this.autoResizeTextarea('messages');
    this.autoResizeTextarea('functions');
  },
  watch: {
    error(val) {
      // Whenever error changes, stop loading
      if (this.loading && val !== undefined) {
        this.loading = false;
      }
    },
    requestId() {
      // When requestId changes, always reset loading
      if (this.loading) {
        this.loading = false;
      }
    }
  },
  methods: {
    autoResizeTextarea(type) {
      this.$nextTick(() => {
        const ref = this.$refs[type + 'Textarea'];
        if (ref) {
          ref.style.height = 'auto';
          ref.style.height = ref.scrollHeight + 'px';
        }
      });
    },
    fillSample() {
      this.$emit('update:apiKey', 'xxx');
      this.$emit('update:model', 'gpt-4o');
      this.$emit('update:messages', `[
  { "role": "system", "content": "Please strictly follow the function return format to generate a list of questions." },
  { "role": "user", "content": "what is the price of Bitcoin?" }
]`);
      this.$emit('update:functions', `[
  {
    "name": "generate_questions",
    "description": "Returns a list of strings, each element is a research question",
    "parameters": {
      "type": "object",
      "properties": {
        "questions": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["questions"]
    }
  }
]`);
      this.$emit('update:function_call', '{ "name": "generate_questions" }');
    },
    fixMessagesJson() {
      let val = this.messages;
      let corrected = val;
      let error = '';
      try {
        // Try JSON.parse first
        JSON.parse(val);
        // Already valid JSON
        corrected = JSON.stringify(JSON.parse(val), null, 2);
      } catch (e1) {
        try {
          // Try to eval as JS object/array
          // eslint-disable-next-line no-eval
          let fixed = eval('(' + val + ')');
          corrected = JSON.stringify(fixed, null, 2);
        } catch (e2) {
          error = 'Invalid JSON/object syntax.';
        }
      }
      if (!error) {
        this.$emit('update:messages', corrected);
        this.messagesJsonError = '';
      } else {
        this.messagesJsonError = error;
      }
    },
    fixFunctionsJson() {
      let val = this.functions;
      let corrected = val;
      let error = '';
      try {
        JSON.parse(val);
        corrected = JSON.stringify(JSON.parse(val), null, 2);
      } catch (e1) {
        try {
          // eslint-disable-next-line no-eval
          let fixed = eval('(' + val + ')');
          corrected = JSON.stringify(fixed, null, 2);
        } catch (e2) {
          error = 'Invalid JSON/object syntax.';
        }
      }
      if (!error) {
        this.$emit('update:functions', corrected);
        this.functionsJsonError = '';
      } else {
        this.functionsJsonError = error;
      }
    },
    handleSubmit() {
      this.loading = true;
      this.$emit('submit');
    }
  },
  template: `
    <div class="bg-gray-100 border border-gray-300 rounded-xl shadow-lg p-5 min-w-[240px] max-w-md">
      <div class="flex items-center justify-between mb-4">
  <h1 class="text-base font-bold text-gray-900">Function Call API Editor</h1>
  <button type="button" @click="fillSample" class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200">Fill Sample</button>
</div>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block font-medium mb-1 text-xs text-gray-800">API Key</label>
          <input :value="apiKey" @input="$emit('update:apiKey', $event.target.value)" type="password" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="Enter API Key" required />
        </div>
        <div>
          <label class="block font-medium mb-1 text-xs text-gray-800">Model</label>
          <input :value="model" @input="$emit('update:model', $event.target.value)" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="e.g. gpt-4o" required />
        </div>
        <div class="relative">
          <label class="block font-medium mb-1 text-xs text-gray-800">Messages (JSON)</label>
          <button type="button" @click="fixMessagesJson" class="absolute right-2 top-7 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded hover:bg-blue-100 border border-gray-300">JSON</button>
          <textarea
  ref="messagesTextarea"
  :value="messages"
  @input="$emit('update:messages', $event.target.value); autoResizeTextarea('messages')"
  class="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-xs bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
  rows="3"
  placeholder='[{ "role": "user", "content": "Hello!" }]'></textarea>
          <div v-if="messagesJsonError" class="text-red-500 text-xs mt-1">{{ messagesJsonError }}</div>
        </div>
        <div class="relative">
          <label class="block font-medium mb-1 text-xs text-gray-800">Functions (JSON, optional)</label>
          <button type="button" @click="fixFunctionsJson" class="absolute right-2 top-7 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded hover:bg-blue-100 border border-gray-300">JSON</button>
          <textarea
  ref="functionsTextarea"
  :value="functions"
  @input="$emit('update:functions', $event.target.value); autoResizeTextarea('functions')"
  class="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-xs bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
  rows="2"
  placeholder='[ ... ]'></textarea>
          <div v-if="functionsJsonError" class="text-red-500 text-xs mt-1">{{ functionsJsonError }}</div>
        </div>
        <div>
          <label class="block font-medium mb-1 text-xs text-gray-800">Function Call (JSON, optional)</label>
          <input :value="function_call" @input="$emit('update:function_call', $event.target.value)" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-xs bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder='{"name": "your_function"}' />
        </div>
        <button type="submit"
          :disabled="loading"
          :class="loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
          class="text-white px-3 py-2 rounded text-xs w-full transition-colors"
        >
          <span v-if="loading">Loading ...</span>
          <span v-else>Call API</span>
        </button>
      </form>
      <div v-if="error" class="mt-3 text-red-500 font-mono text-xs whitespace-pre-line">{{ error }}</div>
    </div>
  `
};
