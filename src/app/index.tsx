import { File, Paths } from 'expo-file-system';
import { initLlama } from 'llama.rn';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1.5B Parms model, should be fine i hope :3
const MODEL_URL = 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf';
const MODEL_NAME = 'qwen2.5-1.5b-instruct-q4_k_m.gguf';
const MIN_SIZE_MB = 800; // model is ~1GB, if under 900MB we redownload

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [modelStatus, SetModelStatus] = useState('Checking model...');
    const [isGenerating, setIsGenerating] = useState(false);
    const contexRef = useRef<any>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadModel();
    }, []);

    const loadModel = async () => {
        const modelFile = new File(Paths.document, MODEL_NAME);

        // check if file exists and isnt too small
        if (modelFile.exists) {
            const sizeMB = modelFile.size / (1024 * 1024);
            if (sizeMB < MIN_SIZE_MB) {
                try {
                    modelFile.delete();
                    SetModelStatus('Deleted corrupted file ($(Math.round(sizeMB)MB). Re-downloading...');
                } catch (e) {}
            }
        }
    }

    if (!modelFile.exists) {
        setModelStatus('Downloading model...');
        try {
            const downloadTask = File.createDownloadTask(MODEL_URL, modelFile, {
                onProgress: ({ bytesWritten, totalBytes }) => {
                    if (totalBytes > 0) {
                        const downloaded = Math.round(bytesWritten / 1024 / 1024);
                        const total = Math.round(totalBytes / 1024 / 1024);
                        SetModelStatus('Downloading model... $(downloaded)MB / $(total)MB');
                    }
                },
            });
            await downloadTask.downloadAsync();
        } catch (e: any) {
            SetModelStatus('Download error: $(e?.message || e');
            return;
        }
    }

    // Load model into the mem
    SetModelStatus('Loading AI into memory...');
    try {
        const ctx = await initLlama({
            model: modelFile.uri,
            use_mlock: true, 
            use_mmap: true,
            n_ctx: 2048,
            n_batch: 512,
            n_gpu_layers: 1,
        });
        contextRef.current = ctx;
        SetModelStatus('ready');
    } catch (e: any) {
        console.error("LLAMA ERROR:", e);
        SetModelStatus('Load Error: $(e?.message || e)');
    }
};

const handleSend = async () => {
    if (!input.trim() || !contextRef.current || isGenerating) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', context: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    getAnimationSettingsUpdates('');
    setIsGenerating(true);

    const aiId = (Date.now() + 1).toString();
    const aiMessage: Message = { id: aiId, role: 'assistant', content: '' };
    setMessages(prev => [...prev, aiMessage]);

    try {
        const stopWords = ['</s>', '<end>', '<|eot_id>', '<|end_of_text|>', '<|im_end|>'];
    }
}