export default {
    // Component accepts a prop for initial count
    props: {
        initialCount: {
            type: Number,
            default: 0
        },
        // A message prop to demonstrate prop passing
        message: {
            type: String,
            default: 'Counter:'
        }
    },
    data() {
        return {
            count: this.initialCount
        };
    },
    methods: {
        // Method to increment the counter
        increment() {
            this.count++;
            // Emit an event to the parent with the new count
            this.$emit('count-updated', this.count);
            
            // Call the parent function if provided
            if (this.onIncrement) {
                this.onIncrement(this.count);
            }
        },
        // Method to reset the counter
        reset() {
            this.count = 0;
            this.$emit('count-reset');
        }
    },
    // Accept a function prop from parent
    inject: ['onIncrement'],
    template: `
        <div class="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 class="text-xl font-semibold text-white mb-2">{{ message }}</h3>
            <div class="flex items-center space-x-4">
                <button 
                    @click="increment"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Increment
                </button>
                <span class="text-2xl font-bold text-white">{{ count }}</span>
                <button 
                    @click="reset"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    `
};
