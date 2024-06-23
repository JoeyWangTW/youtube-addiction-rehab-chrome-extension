// OpenAIHelpers.ts
import axios from 'axios';

interface ChatCompletionResponse {
    choices: { message: { content: string } }[];
}

export function formatPrompt(systemPrompt: string, prompt: string) {
    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
    ];
}

// Update the function to match the expected API usage for chat completions
export async function fetchChatCompletion(apiKey: string, messages: any[]): Promise<string> {
    try {
        const url = 'https://api.openai.com/v1/chat/completions';
        const data = {
            model: 'gpt-4o', // Specify the model you are using; adjust as necessary
            response_format: { type: 'json_object' },
            messages: messages, // This should be structured according to OpenAI's requirements
        };
        const headers = {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };

        const response = await axios.post<ChatCompletionResponse>(url, data, { headers });

        if (response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content;
        } else {
            return 'No response from OpenAI.';
        }
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return 'Failed to fetch chat completion from OpenAI.';
    }
}
