import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AiMessage {
  id: number;
  text: string;
  sender: 'coach' | 'ai';
  time: string;
  isTyping?: boolean;
}

interface Suggestion {
  icon: string;
  title: string;
  prompt: string;
}

@Component({
  selector: 'app-ai-assistant',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  prompt = '';
  isLoading = false;

  messages: AiMessage[] = [
    {
      id: 1,
      text: '👋 Bonjour Coach ! Je suis votre assistant IA SmartTrainer. Je peux vous aider à :\n\n• **Créer des programmes d\'entraînement** personnalisés\n• **Analyser les performances** de vos clients\n• **Rédiger des plans nutritionnels**\n• **Suggérer des exercices** adaptés aux objectifs\n• **Répondre à vos questions** sur le coaching\n\nComment puis-je vous aider aujourd\'hui ?',
      sender: 'ai',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ];

  suggestions: Suggestion[] = [
    {
      icon: '🏋️',
      title: 'Programme Musculation',
      prompt: 'Crée un programme de musculation 4 jours/semaine pour un client débutant qui souhaite prendre de la masse musculaire.'
    },
    {
      icon: '🏃',
      title: 'Plan Cardio HIIT',
      prompt: 'Génère un plan cardio HIIT de 6 semaines pour une cliente qui souhaite perdre du poids et améliorer son endurance.'
    },
    {
      icon: '🥗',
      title: 'Plan Nutritionnel',
      prompt: 'Propose un plan nutritionnel équilibré pour un client de 75kg qui cherche à perdre 5kg en 3 mois.'
    },
    {
      icon: '📊',
      title: 'Analyse Performance',
      prompt: 'Comment analyser la progression d\'un client qui stagne après 2 mois d\'entraînement régulier ?'
    },
    {
      icon: '🧘',
      title: 'Récupération & Mobilité',
      prompt: 'Quels exercices de mobilité et de récupération recommandes-tu pour des athlètes qui s\'entraînent 5 fois par semaine ?'
    },
    {
      icon: '💊',
      title: 'Supplémentation',
      prompt: 'Quels suppléments sont réellement efficaces et sûrs pour la prise de masse musculaire selon les études scientifiques ?'
    }
  ];

  private aiResponses: Record<string, string> = {
    default: '🤔 C\'est une excellente question ! Voici mon analyse basée sur les meilleures pratiques scientifiques du coaching sportif :\n\nJe traite votre demande avec des recommandations personnalisées...',
    program: '💪 **Programme Musculation 4j/semaine — Débutant**\n\n**Semaine 1-4 (Phase d\'adaptation) :**\n\n📅 **Lundi — Pousser (Chest/Shoulders/Triceps)**\n• Développé couché : 3×12\n• Presse épaules : 3×12\n• Écarté haltères : 3×15\n• Extensions triceps : 3×15\n\n📅 **Mardi — Tirer (Back/Biceps)**\n• Tirage lat : 3×12\n• Rowing barre : 3×12\n• Curl biceps : 3×15\n• Face pulls : 3×15\n\n📅 **Jeudi — Jambes**\n• Squat : 3×12\n• Presse jambes : 3×15\n• Fentes : 3×12 par jambe\n• Extensions quadriceps : 3×15\n\n📅 **Vendredi — Full Body**\n• Soulevé de terre roumain : 3×12\n• Développé incliné : 3×12\n• Tractions assistées : 3×10\n\n⚡ **Repos : 60-90s entre les séries**\n🎯 **Objectif : Maîtriser la technique avant d\'augmenter les charges**',
    cardio: '🏃 **Plan HIIT 6 semaines — Perte de poids**\n\n**Semaine 1-2 (Introduction) :**\n• 3 séances/semaine\n• 20 min par séance\n• Ratio travail/repos : 30s/60s\n\n**Semaine 3-4 (Progression) :**\n• 4 séances/semaine\n• 25 min par séance\n• Ratio : 40s/40s\n\n**Semaine 5-6 (Intensité) :**\n• 4-5 séances/semaine\n• 30 min par séance\n• Ratio : 45s/30s\n\n🔥 **Exercices recommandés :**\nBurpees, Mountain climbers, Jump squats, High knees, Box jumps\n\n📊 **Déficit calorique conseillé : -300 à -500 kcal/jour**',
    nutrition: '🥗 **Plan Nutritionnel — 75kg, objectif -5kg en 3 mois**\n\n**Calcul des besoins :**\n• BMR estimé : ~1850 kcal\n• TDEE (actif) : ~2500 kcal\n• Déficit visé : -500 kcal/jour\n• **Objectif : 2000 kcal/jour**\n\n**Macronutriments :**\n• 🥩 Protéines : 150g/j (2g/kg)\n• 🍞 Glucides : 200g/j\n• 🥑 Lipides : 65g/j\n\n**Répartition des repas :**\n\n🌅 **Petit-déjeuner (500 kcal)**\nFlocons d\'avoine, œufs, fruits rouges, café\n\n☀️ **Déjeuner (650 kcal)**\nPoulet grillé, riz complet, légumes verts\n\n🌙 **Dîner (550 kcal)**\nSaumon, patate douce, brocolis\n\n🍎 **Collations (300 kcal)**\nYaourt grec, fruits, amandes'
  };

  sendPrompt() {
    if (!this.prompt.trim() || this.isLoading) return;

    const userMsg: AiMessage = {
      id: Date.now(),
      text: this.prompt.trim(),
      sender: 'coach',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.push(userMsg);

    // Typing indicator
    const typingMsg: AiMessage = {
      id: Date.now() + 1,
      text: '',
      sender: 'ai',
      time: '',
      isTyping: true
    };
    this.messages.push(typingMsg);

    const q = this.prompt.toLowerCase();
    this.prompt = '';
    this.isLoading = true;

    setTimeout(() => {
      const idx = this.messages.findIndex(m => m.isTyping);
      if (idx !== -1) this.messages.splice(idx, 1);

      let responseText = this.aiResponses['default'];
      if (q.includes('musculation') || q.includes('masse') || q.includes('programme')) {
        responseText = this.aiResponses['program'];
      } else if (q.includes('cardio') || q.includes('hiit') || q.includes('endurance') || q.includes('poids')) {
        responseText = this.aiResponses['cardio'];
      } else if (q.includes('nutri') || q.includes('plan') || q.includes('manger')) {
        responseText = this.aiResponses['nutrition'];
      }

      this.messages.push({
        id: Date.now() + 2,
        text: responseText,
        sender: 'ai',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      });
      this.isLoading = false;
    }, 1800);
  }

  useSuggestion(suggestion: Suggestion) {
    this.prompt = suggestion.prompt;
    this.sendPrompt();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendPrompt();
    }
  }

  clearChat() {
    this.messages = [this.messages[0]];
  }

  ngAfterViewChecked() {
    try {
      if (this.messagesEnd) {
        this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch {}
  }
}
