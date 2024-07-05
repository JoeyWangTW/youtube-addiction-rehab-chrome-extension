import axios from 'axios';
import { savedSettingsStorage } from '@chrome-extension-boilerplate/storage';

interface ChatCompletionResponse {
    choices: { message: { content: string } }[];
}

function formatPrompt(systemPrompt: string, prompt: string) {
    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
    ];
}

export async function fetchChatCompletion(systemPrompt: string, prompt: string): Promise<string> {
    try {
        const { llmModel, aiProvider, openAIApiKey, anthropicApiKey } = await savedSettingsStorage.get();

        if (aiProvider === 'openai') {
            return fetchOpenAIChatCompletion(openAIApiKey, llmModel, formatPrompt(systemPrompt, prompt));
        } else if (aiProvider === 'anthropic') {
            return fetchAnthropicChatCompletion(anthropicApiKey, llmModel, systemPrompt, prompt);
        } else {
            throw new Error('Invalid AI provider');
        }
    } catch (error) {
        console.error('Error calling AI service:', error);
        return 'Failed to fetch chat completion from AI service.';
    }
}

async function fetchOpenAIChatCompletion(apiKey: string, model: string, messages: any[]): Promise<string> {
    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        model: model,
        response_format: { type: 'json_object' },
        messages: messages,
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
}

async function fetchAnthropicChatCompletion(apiKey: string, model: string, systemPrompt: string, prompt: string): Promise<string> {
    const url = 'https://api.anthropic.com/v1/messages';
    const data = {
        model: model,
        system: systemPrompt,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
    };
    const headers = {
        'X-API-Key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
    };

    const response = await axios.post<any>(url, data, { headers });

    if (response.data.content) {
        return response.data.content[0].text;
    } else {
        return 'No response from Anthropic.';
    }
}
