// FunctionCallEditor.js
// A page with an editor to edit message information for the API, then call /apis/function-call
// Uses vanilla JS and Tailwind CSS (per user rules)

import ApiEditor from '../components/ApiEditor.js';
import ResponsePreview from '../components/ResponsePreview.js';

export default {
  name: 'FunctionCallEditor',
  components: { ApiEditor, ResponsePreview },
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-900">
      <div class="w-full max-w-4xl flex flex-col md:flex-row gap-4 md:gap-8 p-4 bg-white/5 rounded-2xl shadow-xl">
        <!-- Left: Editor Form -->
        <div class="flex-1 flex flex-col justify-stretch">
          <ApiEditor
            :apiKey="apiKey"
            :model="model"
            :messages="messages"
            :functions="functions"
            :function_call="function_call"
            :error="error"
            :requestId="requestId"
            @update:apiKey="val => apiKey = val"
            @update:model="val => model = val"
            @update:messages="val => messages = val"
            @update:functions="val => functions = val"
            @update:function_call="val => function_call = val"
            @submit="callApi"
          />
        </div>
        <!-- Right: Response Browser -->
        <div class="flex-1 flex flex-col justify-stretch">
          <ResponsePreview :response="response" :error="error" />
        </div>
      </div>
    </div>
  `,
  data() {
    // Try to load from localStorage
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem('functionCallEditorData')) || {};
    } catch (e) {
      saved = {};
    }
    return {
      apiKey: saved.apiKey || '',
      model: saved.model || 'gpt-4o',
      messages: saved.messages || '[\n  {\n    "role": "system",\n    "content": "You are a helpful assistant."\n  },\n  {\n    "role": "user",\n    "content": "Hello!"\n  }\n]',
      functions: saved.functions || '',
      function_call: saved.function_call || '',
      response: '',
      error: '',
      requestId: 0
    };
  },
  methods: {
    async callApi() {
      // Save current form values to localStorage
      console.log('[FunctionCallEditor] Saving form values to localStorage');
      localStorage.setItem('functionCallEditorData', JSON.stringify({
        apiKey: this.apiKey,
        model: this.model,
        messages: this.messages,
        functions: this.functions,
        function_call: this.function_call
      }));
      this.response = '';
      this.error = '';
      let parsedMessages, parsedFunctions, parsedFunctionCall;

      // Log input values
      console.log('[FunctionCallEditor] Input values:', {
        apiKey: this.apiKey,
        model: this.model,
        messages: this.messages,
        functions: this.functions,
        function_call: this.function_call
      });

      // Parse messages
      try {
        parsedMessages = this.messages ? JSON.parse(this.messages) : null;
        console.log('[FunctionCallEditor] Parsed messages:', parsedMessages);
      } catch (e) {
        this.error = 'Messages must be valid JSON.';
        console.error('[FunctionCallEditor] Error parsing messages:', e, this.messages);
        return;
      }

      // Validate required fields
      if (!this.model || !parsedMessages) {
        this.error = 'Model and messages are required.';
        console.warn('[FunctionCallEditor] Validation failed: model or messages missing', { model: this.model, parsedMessages });
        return;
      }

      // Parse optional functions
      if (this.functions) {
        try {
          parsedFunctions = JSON.parse(this.functions);
          console.log('[FunctionCallEditor] Parsed functions:', parsedFunctions);
        } catch (e) {
          this.error = 'Functions must be valid JSON.';
          console.error('[FunctionCallEditor] Error parsing functions:', e, this.functions);
          return;
        }
      }

      // Parse optional function_call
      if (this.function_call) {
        try {
          parsedFunctionCall = JSON.parse(this.function_call);
          console.log('[FunctionCallEditor] Parsed function_call:', parsedFunctionCall);
        } catch (e) {
          this.error = 'Function Call must be valid JSON.';
          console.error('[FunctionCallEditor] Error parsing function_call:', e, this.function_call);
          return;
        }
      }

      // Ready to call API
      try {
        console.log('[FunctionCallEditor] Calling API /apis/function-call with:', {
          model: this.model,
          messages: parsedMessages,
          ...(parsedFunctions ? { functions: parsedFunctions } : {}),
          ...(parsedFunctionCall ? { function_call: parsedFunctionCall } : {})
        });
        const res = await fetch('/apis/function-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
          },
          body: JSON.stringify({
            model: this.model,
            messages: parsedMessages,
            ...(parsedFunctions ? { functions: parsedFunctions } : {}),
            ...(parsedFunctionCall ? { function_call: parsedFunctionCall } : {})
          })
        });
        console.log('[FunctionCallEditor] Fetch response status:', res.status);
        if (!res.ok) {
          const err = await res.json();
          this.error = err.error || 'Request failed.';
          console.error('[FunctionCallEditor] API error:', this.error, err);
          this.requestId++;
          return;
        }
        const data = await res.json();
        this.response = JSON.stringify(data, null, 2);
        console.log('[FunctionCallEditor] API success. Response:', data);
        this.requestId++;
      } catch (e) {
        this.error = 'Network or server error.';
        console.error('[FunctionCallEditor] Network/server error:', e);
        this.requestId++;
      }
    }

  }
};
