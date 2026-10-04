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

