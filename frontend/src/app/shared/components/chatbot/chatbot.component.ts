import { Component, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements AfterViewChecked {

  @ViewChild('msgList') msgList!: ElementRef;

  isOpen   = signal(false);
  isTyping = signal(false);
  input    = '';
  messageIdCounter = 10;

  messages: ChatMessage[] = [
    {
      id: 1,
      from: 'bot',
      text: '👋 Bonjour Jean !\n\nJe suis votre coach virtuel. Je peux vous aider avec :\n• Des conseils sur les exercices\n• Des recommandations nutritionnelles\n• La réponse à vos questions fitness',
      time: this.now()
    }
  ];

  private botReplies: Record<string, string> = {
    default: "Je suis là pour vous aider ! Posez-moi des questions sur vos entraînements, la nutrition ou votre progression. 💪",
    exercise: "Pour un entraînement efficace, alternez entre musculation (3-4j/sem) et cardio (2-3j/sem). Commencez par des exercices composés : squat, développé-couché, soulevé de terre. 🏋️",
    nutrition: "Pour la nutrition, visez 1.6–2g de protéines par kg de poids corporel. Privilégiez les aliments non transformés et hydratez-vous avec 2–3L d'eau/jour. 🥗",
    programme: "Je peux vous suggérer un programme adapté à vos objectifs ! Êtes-vous en phase de prise de masse, de sèche, ou de remise en forme générale ? 📋",
    coach: "Connectez-vous à votre compte pour accéder à votre coach personnel qui peut créer un programme 100% personnalisé par IA ! 🤖",
    motivation: "Chaque répétition vous rapproche de votre objectif ! La régularité est la clé — même 20 minutes par jour font une grande différence. 🔥",
  };

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  send(): void {
    const text = this.input.trim();
    if (!text) return;

    this.messages.push({ id: ++this.messageIdCounter, from: 'user', text, time: this.now() });
    this.input = '';
    this.isTyping.set(true);

    setTimeout(() => {
      this.isTyping.set(false);
      this.messages.push({
        id: ++this.messageIdCounter,
        from: 'bot',
        text: this.getReply(text),
        time: this.now()
      });
    }, 1200 + Math.random() * 600);
  }

  handleKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
  }

  private getReply(text: string): string {
    const t = text.toLowerCase();
    if (t.match(/exercice|entraîne|workout|musculation|squat|bench/)) return this.botReplies['exercise'];
    if (t.match(/nutri|manger|protéine|calorie|alimentation|régime/))  return this.botReplies['nutrition'];
    if (t.match(/programme|plan|séance|schedule/))                      return this.botReplies['programme'];
    if (t.match(/coach|personnel|ia|ai/))                               return this.botReplies['coach'];
    if (t.match(/motiv|courage|difficile|abandon/))                     return this.botReplies['motivation'];
    return this.botReplies['default'];
  }

  private now(): string {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  ngAfterViewChecked(): void {
    if (this.msgList?.nativeElement) {
      this.msgList.nativeElement.scrollTop = this.msgList.nativeElement.scrollHeight;
    }
  }

  formatText(text: string): string {
    return text
      .replace(/\n/g, '<br>')
      .replace(/•/g, '<span class="bullet">•</span>');
  }
}
