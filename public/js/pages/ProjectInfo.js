export default Vue.defineComponent({
    name: 'ProjectInfo',
    template: `
        <div class="w-full max-w-4xl mx-auto my-2 px-2 py-1 text-xs text-gray-400 bg-transparent text-center">
            OpenAI API Demo &mdash; Usage: Enter your API key, select a model, compose a function call, and view the response. No data is sent anywhere except OpenAI.
 Read More: <a href="https://platform.openai.com/docs/api-reference/completions" target="_blank" class="underline hover:text-blue-400">Completion API</a> | <a href="https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses" target="_blank" class="underline hover:text-blue-400">Structured Outputs</a>.
        </div>
    `
});
