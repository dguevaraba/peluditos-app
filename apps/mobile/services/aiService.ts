import { supabase } from '../lib/supabase';
import { OPENAI_API_KEY } from '@env';

// Tipos para la IA
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class AIService {
  private apiKey: string;
  private baseURL: string;
  private useFreeMode: boolean = true; // Cambiar a false para usar APIs pagadas
  private useHuggingFace: boolean = false; // Activar para usar Hugging Face gratuito

  constructor() {
    // Configuración para OpenAI
    this.apiKey = OPENAI_API_KEY || '';
    this.baseURL = 'https://api.openai.com/v1';
    
    // Debug: Verificar configuración
    console.log('AI Service initialized');
    console.log('Using FREE mode:', this.useFreeMode);
    console.log('Using Hugging Face:', this.useHuggingFace);
    
    if (!this.useFreeMode && !this.apiKey) {
      console.warn('OpenAI API key not configured. Switching to FREE mode.');
      this.useFreeMode = true;
    }
  }

  // Método principal para enviar mensaje a la IA
  async sendMessage(
    message: string, 
    conversationId?: string, 
    petContext?: any
  ): Promise<AIResponse> {
    // Modo Hugging Face gratuito
    if (this.useHuggingFace) {
      return this.sendToHuggingFace(message, conversationId, petContext);
    }
    
    // Modo gratuito - usar respuestas inteligentes
    if (this.useFreeMode) {
      return this.getSmartFallbackResponse(message, petContext);
    }

    // Modo pagado - usar OpenAI
    return this.sendToOpenAI(message, conversationId, petContext);
  }

  // Integración con Hugging Face (Gratuito)
  private async sendToHuggingFace(
    message: string, 
    conversationId?: string, 
    petContext?: any
  ): Promise<AIResponse> {
    try {
      // Modelo gratuito de Hugging Face para chat
      const model = "microsoft/DialoGPT-medium"; // Modelo gratuito
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Nota: Para uso gratuito, no necesitas API key, pero tienes límites
        },
        body: JSON.stringify({
          inputs: this.buildPetContextPrompt(message, petContext),
          parameters: {
            max_length: 150,
            temperature: 0.7,
            do_sample: true,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data[0]?.generated_text || 'Lo siento, no pude procesar tu mensaje.';

      // Guardar conversación
      await this.saveConversation(message, aiResponse, conversationId);

      return {
        success: true,
        message: aiResponse,
      };

    } catch (error) {
      console.error('Hugging Face Error:', error);
      // Fallback al bot inteligente si falla
      return this.getSmartFallbackResponse(message, petContext);
    }
  }

  // Construir prompt con contexto de mascotas para Hugging Face
  private buildPetContextPrompt(message: string, petContext?: any): string {
    const petName = petContext?.name || 'tu mascota';
    const petType = petContext?.type || 'mascota';
    
    return `Contexto: Eres un asistente de mascotas llamado PetBot. Ayudas con ${petName}, que es un ${petType}. 
    
    Usuario: ${message}
    PetBot:`;
  }

  // Respuestas inteligentes gratuitas (Bot mejorado)
  private getSmartFallbackResponse(message: string, petContext?: any): AIResponse {
    const lowerMessage = message.toLowerCase();
    const petName = petContext?.name || 'tu mascota';
    const petType = petContext?.type || 'mascota';
    const petAge = petContext?.age || 'adulta';
    
    // Saludos personalizados
    if (lowerMessage.includes('hola') || lowerMessage.includes('hello')) {
      return {
        success: true,
        message: `¡Hola! Soy PetBot, tu asistente de mascotas. 🐕 ¿En qué puedo ayudarte con ${petName} hoy?`
      };
    }
    
    // Alimentación
    if (lowerMessage.includes('comida') || lowerMessage.includes('aliment') || lowerMessage.includes('dieta') || lowerMessage.includes('food') || lowerMessage.includes('nutrición')) {
      const specificAdvice = this.getFeedingAdvice(petType, petContext);
      return {
        success: true,
        message: `🍽️ **Alimentación para ${petName}:**\n\n${specificAdvice}\n\n¿Tienes alguna pregunta específica sobre la alimentación?`
      };
    }
    
    // Salud
    if (lowerMessage.includes('salud') || lowerMessage.includes('enfermo') || lowerMessage.includes('veterinario') || lowerMessage.includes('sick') || lowerMessage.includes('dolor') || lowerMessage.includes('síntoma')) {
      return {
        success: true,
        message: `🏥 **Salud de ${petName}:**\n\nSi ${petName} muestra signos de enfermedad, contacta a un veterinario inmediatamente.\n\n**Signos de alerta:**\n• Cambios en el apetito\n• Cambios de comportamiento\n• Vómitos o diarrea\n• Letargia\n• Tos o estornudos\n• Cojera o dificultad para moverse\n• Cambios en el pelaje\n\n¿Qué síntomas específicos has notado?`
      };
    }
    
    // Ejercicio
    if (lowerMessage.includes('ejercicio') || lowerMessage.includes('paseo') || lowerMessage.includes('actividad') || lowerMessage.includes('walk') || lowerMessage.includes('jugar') || lowerMessage.includes('energía')) {
      const exerciseAdvice = this.getExerciseAdvice(petType);
      return {
        success: true,
        message: `🏃‍♂️ **Ejercicio para ${petName}:**\n\n${exerciseAdvice}\n\n¿Qué tipo de actividad te gustaría hacer con ${petName}?`
      };
    }
    
    // Vacunas
    if (lowerMessage.includes('vacuna') || lowerMessage.includes('vacun') || lowerMessage.includes('vaccine') || lowerMessage.includes('inmunización')) {
      const vaccineAdvice = this.getVaccineAdvice(petType);
      return {
        success: true,
        message: `💉 **Vacunas para ${petName}:**\n\n${vaccineAdvice}\n\nConsulta con tu veterinario para un calendario personalizado.`
      };
    }
    
    // Comportamiento
    if (lowerMessage.includes('comportamiento') || lowerMessage.includes('conducta') || lowerMessage.includes('behavior') || lowerMessage.includes('agresivo') || lowerMessage.includes('miedoso') || lowerMessage.includes('ansioso')) {
      return {
        success: true,
        message: `🐾 **Comportamiento de ${petName}:**\n\nLos problemas de comportamiento pueden tener varias causas:\n\n• Falta de ejercicio\n• Ansiedad por separación\n• Cambios en el entorno\n• Problemas médicos\n• Falta de socialización\n• Miedo o trauma\n\nTe recomiendo consultar con un veterinario o entrenador profesional.`
      };
    }
    
    // Cuidado del pelaje
    if (lowerMessage.includes('pelaje') || lowerMessage.includes('pelo') || lowerMessage.includes('cepillado') || lowerMessage.includes('baño') || lowerMessage.includes('grooming')) {
      const groomingAdvice = this.getGroomingAdvice(petType);
      return {
        success: true,
        message: `🪮 **Cuidado del pelaje de ${petName}:**\n\n${groomingAdvice}\n\n¿Necesitas consejos específicos sobre el cuidado del pelaje?`
      };
    }
    
    // Socialización
    if (lowerMessage.includes('socializar') || lowerMessage.includes('otros perros') || lowerMessage.includes('gatos') || lowerMessage.includes('personas') || lowerMessage.includes('miedoso')) {
      return {
        success: true,
        message: `🤝 **Socialización de ${petName}:**\n\nLa socialización es fundamental para el bienestar de tu mascota:\n\n• Exposición gradual a nuevas situaciones\n• Interacción positiva con otros animales\n• Contacto con diferentes personas\n• Entrenamiento de obediencia básica\n• Recompensas por comportamiento positivo\n\n¿En qué aspecto específico necesitas ayuda?`
      };
    }
    
    // Entrenamiento
    if (lowerMessage.includes('entrenar') || lowerMessage.includes('obediencia') || lowerMessage.includes('comandos') || lowerMessage.includes('adiestrar') || lowerMessage.includes('educar')) {
      return {
        success: true,
        message: `🎓 **Entrenamiento de ${petName}:**\n\nEl entrenamiento básico es esencial:\n\n• Comandos básicos: sentado, quieto, ven\n• Uso de recompensas positivas\n• Consistencia en las reglas\n• Sesiones cortas y frecuentes\n• Paciencia y refuerzo positivo\n\n¿Qué comando específico quieres enseñarle?`
      };
    }
    
    // Emergencias
    if (lowerMessage.includes('emergencia') || lowerMessage.includes('urgencia') || lowerMessage.includes('emergency') || lowerMessage.includes('accidente') || lowerMessage.includes('envenenado') || lowerMessage.includes('sangrado')) {
      return {
        success: true,
        message: `🚨 **EMERGENCIA:**\n\nSi ${petName} está en peligro:\n\n1. **Mantén la calma**\n2. **Contacta a un veterinario inmediatamente**\n3. **No administres medicamentos sin consulta**\n4. **Lleva a ${petName} a una clínica de emergencias**\n5. **Si es envenenamiento, no induzcas el vómito**\n\n¿Qué está pasando exactamente?`
      };
    }
    
    // Preguntas sobre edad
    if (lowerMessage.includes('edad') || lowerMessage.includes('años') || lowerMessage.includes('viejo') || lowerMessage.includes('joven')) {
      const ageAdvice = this.getAgeAdvice(petType, petAge);
      return {
        success: true,
        message: `📅 **Edad de ${petName}:**\n\n${ageAdvice}\n\n¿Tienes preguntas específicas sobre el cuidado según la edad?`
      };
    }
    
    // Preguntas sobre peso
    if (lowerMessage.includes('peso') || lowerMessage.includes('obeso') || lowerMessage.includes('delgado') || lowerMessage.includes('gordo')) {
      return {
        success: true,
        message: `⚖️ **Peso de ${petName}:**\n\nEl peso ideal depende de la raza y edad:\n\n• Consulta con tu veterinario para el peso ideal\n• Monitorea cambios bruscos de peso\n• Ajusta la alimentación según la actividad\n• El ejercicio regular ayuda a mantener un peso saludable\n\n¿Te preocupa el peso de ${petName}?`
      };
    }
    
    // Respuesta general
    return {
      success: true,
      message: `¡Gracias por tu mensaje! 🐾 Soy PetBot, tu asistente de mascotas.\n\nPuedo ayudarte con ${petName} en:\n\n• 🍽️ Alimentación y nutrición\n• 🏥 Salud y vacunas\n• 🏃‍♂️ Ejercicio y actividad\n• 🐾 Comportamiento y entrenamiento\n• 🪮 Cuidado del pelaje\n• 🤝 Socialización\n• 📅 Cuidado por edad\n• ⚖️ Control de peso\n• 🚨 Emergencias\n\nPara casos específicos, siempre consulta con un veterinario profesional. ¿En qué tema te gustaría que te ayude?`
    };
  }

  // Consejos específicos de alimentación
  private getFeedingAdvice(petType: string, context?: any): string {
    if (petType === 'dog' || petType === 'perro') {
      return `**Para perros:**\n• 2-3 comidas al día\n• Comida de calidad apropiada para su edad\n• Agua fresca siempre disponible\n• Evita comida humana\n• Horarios regulares\n• Control de porciones según actividad`;
    } else if (petType === 'cat' || petType === 'gato') {
      return `**Para gatos:**\n• Comida húmeda y seca\n• Agua fresca en varios lugares\n• Comida específica para gatos\n• Horarios regulares\n• Control de porciones\n• Algunos gatos prefieren comer varias veces al día`;
    } else {
      return `• Consultar con un veterinario para una dieta personalizada\n• Proporcionar comida de calidad apropiada para su edad\n• Agua fresca siempre disponible\n• Horarios regulares de alimentación\n• Control de porciones`;
    }
  }

  // Consejos específicos de ejercicio
  private getExerciseAdvice(petType: string): string {
    if (petType === 'dog' || petType === 'perro') {
      return `**Para perros:**\n• Paseos diarios (2-3 veces al día)\n• Juegos activos (pelota, frisbee)\n• Socialización con otros perros\n• Entrenamiento mental\n• Diferentes rutas de paseo\n• Ajusta la intensidad según la raza`;
    } else if (petType === 'cat' || petType === 'gato') {
      return `**Para gatos:**\n• Juegos de caza (juguetes con plumas)\n• Rascadores y árboles para gatos\n• Estimulación mental (puzzles)\n• Tiempo de juego activo\n• Acceso a ventanas para observar\n• Juegos que simulen la caza`;
    } else {
      return `• El ejercicio es fundamental para la salud\n• Ajusta la actividad según la edad y raza\n• Incluye estimulación mental\n• Mantén horarios regulares\n• Varía las actividades para evitar aburrimiento`;
    }
  }

  // Consejos específicos de vacunas
  private getVaccineAdvice(petType: string): string {
    if (petType === 'dog' || petType === 'perro') {
      return `**Vacunas básicas para perros:**\n• Parvovirus\n• Distemper\n• Rabia\n• Adenovirus\n• Parainfluenza\n\n**Vacunas opcionales:**\n• Bordetella (tos de las perreras)\n• Lyme\n\nConsulta con tu veterinario para un calendario personalizado.`;
    } else if (petType === 'cat' || petType === 'gato') {
      return `**Vacunas básicas para gatos:**\n• Panleucopenia\n• Calicivirus\n• Rabia\n• Leucemia felina\n• Rinotraqueitis\n\n**Vacunas opcionales:**\n• PIF (Peritonitis Infecciosa Felina)\n\nConsulta con tu veterinario para un calendario personalizado.`;
    } else {
      return `Las vacunas son esenciales para la salud de tu mascota. Consulta con tu veterinario para un calendario personalizado según el tipo y edad de tu mascota.`;
    }
  }

  // Consejos de cuidado del pelaje
  private getGroomingAdvice(petType: string): string {
    if (petType === 'dog' || petType === 'perro') {
      return `**Para perros:**\n• Cepillado regular según el tipo de pelo\n• Baños cada 4-6 semanas\n• Corte de uñas mensual\n• Limpieza de oídos semanal\n• Revisión dental regular\n• Corte de pelo según la raza`;
    } else if (petType === 'cat' || petType === 'gato') {
      return `**Para gatos:**\n• Cepillado diario para gatos de pelo largo\n• Cepillado semanal para pelo corto\n• Baños solo cuando sea necesario\n• Corte de uñas cada 2-3 semanas\n• Limpieza de oídos si es necesario\n• Los gatos se limpian solos, pero necesitan ayuda`;
    } else {
      return `• El cuidado del pelaje varía según el tipo de mascota\n• Consulta con un veterinario o groomer profesional\n• Mantén una rutina regular de cuidado\n• Revisa regularmente la piel en busca de problemas`;
    }
  }

  // Consejos por edad
  private getAgeAdvice(petType: string, age: string): string {
    if (age === 'cachorro' || age === 'gatito' || age === 'joven') {
      return `**Para mascotas jóvenes:**\n• Necesitan más comida y energía\n• Requieren más ejercicio y socialización\n• Vacunas y desparasitación frecuentes\n• Entrenamiento básico temprano\n• Supervisión constante\n• Juegos y estimulación mental`;
    } else if (age === 'adulta') {
      return `**Para mascotas adultas:**\n• Mantén rutinas regulares\n• Ejercicio moderado y consistente\n• Revisión veterinaria anual\n• Vacunas de refuerzo\n• Cuidado dental regular\n• Monitoreo de cambios de comportamiento`;
    } else if (age === 'senior' || age === 'mayor') {
      return `**Para mascotas senior:**\n• Visitas veterinarias más frecuentes\n• Dieta especial para edad avanzada\n• Ejercicio suave y adaptado\n• Atención a cambios de comportamiento\n• Cuidado dental especial\n• Comodidad y accesibilidad en el hogar`;
    } else {
      return `El cuidado varía según la edad de tu mascota. Consulta con tu veterinario para recomendaciones específicas según la etapa de vida.`;
    }
  }

  // Método para OpenAI (modo pagado)
  private async sendToOpenAI(
    message: string, 
    conversationId?: string, 
    petContext?: any
  ): Promise<AIResponse> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // 1. Preparar el contexto del sistema
        const systemPrompt = this.buildSystemPrompt(petContext);
        
        // 2. Obtener historial de conversación
        const conversationHistory = conversationId 
          ? await this.getConversationHistory(conversationId)
          : [];

        // 3. Construir el payload para OpenAI
        const messages = [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: message }
        ];

        // 4. Llamar a la API de OpenAI
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        if (response.status === 429) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`Rate limited, waiting ${waitTime}ms before retry ${attempt}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // 5. Guardar la conversación en la base de datos
        await this.saveConversation(message, aiResponse, conversationId);

        return {
          success: true,
          message: aiResponse,
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`AI Service Error (attempt ${attempt}):`, error);
        
        if (attempt === maxRetries) {
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Failed after multiple attempts',
    };
  }

  // Construir el prompt del sistema con contexto de mascotas
  private buildSystemPrompt(petContext?: any): string {
    let prompt = `Eres un asistente de IA especializado en mascotas llamado "PetBot". 
    Tu objetivo es ayudar a los dueños de mascotas con consejos, información y apoyo.
    
    Reglas importantes:
    - Siempre sé amigable y empático
    - Proporciona consejos útiles pero no reemplaces la consulta veterinaria
    - Si hay una emergencia médica, recomienda contactar a un veterinario inmediatamente
    - Usa un tono cálido y comprensivo
    - Responde en español
    `;

    if (petContext) {
      prompt += `
      
      Contexto de la mascota:
      - Nombre: ${petContext.name || 'No especificado'}
      - Tipo: ${petContext.type || 'No especificado'}
      - Edad: ${petContext.age || 'No especificado'}
      - Raza: ${petContext.breed || 'No especificado'}
      
      Usa esta información para personalizar tus respuestas cuando sea relevante.
      `;
    }

    return prompt;
  }

  // Obtener historial de conversación desde Supabase
  private async getConversationHistory(conversationId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('messages')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data?.messages || [];
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }

  // Guardar conversación en Supabase
  private async saveConversation(
    userMessage: string, 
    aiResponse: string, 
    conversationId?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const newMessages = [
        {
          id: Date.now().toString(),
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString(),
        },
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        },
      ];

      if (conversationId) {
        const { data: existingConversation } = await supabase
          .from('ai_conversations')
          .select('messages')
          .eq('id', conversationId)
          .single();

        const updatedMessages = [
          ...(existingConversation?.messages || []),
          ...newMessages,
        ];

        await supabase
          .from('ai_conversations')
          .update({
            messages: updatedMessages,
            updated_at: new Date().toISOString(),
          })
          .eq('id', conversationId);
      } else {
        await supabase
          .from('ai_conversations')
          .insert({
            user_id: user.id,
            messages: newMessages,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  // Obtener conversaciones del usuario
  async getUserConversations(): Promise<AIConversation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }

  // Obtener una conversación específica
  async getConversation(conversationId: string): Promise<AIConversation | null> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }
}

export const aiService = new AIService();
