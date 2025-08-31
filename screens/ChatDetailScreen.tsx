import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send } from 'lucide-react-native';
import RobotDogIcon from '../components/RobotDogIcon';
import { aiService, AIMessage } from '../services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatDetailScreen({ route, navigation }: any) {
  const { currentTheme, selectedColor } = useTheme();
  const { user } = useAuth();
  const { chatName, chatType, conversationId } = route.params;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationIdState, setConversationIdState] = useState(conversationId);
  
  const flatListRef = useRef<FlatList>(null);

  const getDynamicColor = () => selectedColor;

  useEffect(() => {
    if (conversationId) {
      loadExistingConversation();
    } else {
      // Nueva conversación - mostrar mensaje de bienvenida
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `¡Hola! Soy PetBot, tu asistente de mascotas. 🐕 ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date()
      }]);
    }
  }, [conversationId]);

  const loadExistingConversation = async () => {
    try {
      const conversation = await aiService.getConversation(conversationId);
      if (conversation && conversation.messages) {
        const formattedMessages = conversation.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      if (chatType === 'ai') {
        // Chat con PetBot (IA)
        const petContext = null; // TODO: Implementar cuando tengamos pets en el user

        const response = await aiService.sendMessage(
          userMessage, 
          conversationIdState, 
          petContext
        );

        if (response.success && response.message) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.message,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, aiMessage]);
        } else {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, I had a problem processing your message. Could you try again?',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } else {
        // Chat with services (simulated for now)
        setTimeout(() => {
          const serviceMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Thank you for your message. A representative from ${chatName} will respond soon.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, serviceMessage]);
          setIsLoading(false);
        }, 1000);
        return;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had a problem processing your message. Could you try again?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <RobotDogIcon size={32} color={getDynamicColor()} />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser 
            ? [styles.userMessageBubble, { backgroundColor: getDynamicColor() }]
            : [styles.aiMessageBubble, { backgroundColor: `${getDynamicColor()}15` }]
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? 'white' : currentTheme.colors.text }
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isUser ? 'rgba(255,255,255,0.7)' : currentTheme.colors.textSecondary }
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <LinearGradient
        colors={[currentTheme.colors.background, `${getDynamicColor()}10`]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={getDynamicColor()} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={[styles.headerIconCircle, { backgroundColor: getDynamicColor() }]}>
              <RobotDogIcon size={20} color="white" />
            </View>
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
              {chatName}
            </Text>
          </View>
          
          <View style={styles.headerSpacer} />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <LinearGradient
            colors={[`${getDynamicColor()}08`, 'transparent']}
            style={styles.inputGradient}
          >
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text,
                  borderColor: getDynamicColor()
                }
              ]}
              value={inputText}
              onChangeText={setInputText}
              placeholder={chatType === 'ai' ? "Type your message..." : "Type your inquiry..."}
              placeholderTextColor={currentTheme.colors.textSecondary}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { 
                  backgroundColor: inputText.trim() && !isLoading 
                    ? getDynamicColor() 
                    : `${getDynamicColor()}40` 
                }
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Send size={20} color="white" />
              )}
            </TouchableOpacity>
          </LinearGradient>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessageBubble: {
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
