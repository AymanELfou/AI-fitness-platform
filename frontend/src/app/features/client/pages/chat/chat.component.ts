import {
  Component, OnInit, OnDestroy, signal, ViewChild,
  ElementRef, AfterViewChecked, PLATFORM_ID, Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ─── Types ─── */
export type MessageSender = 'me' | 'them';

export interface ChatMessage {
  id: number;
  sender: MessageSender;
  text: string;
  time: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  name: string;
  role: string;
  initial: string;
  color: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  isGroup: boolean;
  messages: ChatMessage[];
}

@Component({
  selector: 'app-client-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ClientChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  /* ── State ── */
  activeConvId = signal<number>(1);
  searchQuery  = '';
  newMessage   = '';
  isTyping     = false;
  shouldScrollBottom = false;
  showMobileConvList = true;
  private typingTimer: any;

  /* ── Conversations ── */
  conversations: Conversation[] = [
    {
      id: 1,
      name: 'Coach Marcus',
      role: 'Personal Coach',
      initial: 'M',
      color: '#2563EB',
      isOnline: true,
      lastMessage: 'Great job on the macros tod...',
      lastTime: '10:42 AM',
      unread: 2,
      isGroup: false,
      messages: [
        { id: 1,  sender: 'them', text: "Morning! Checking your log from yesterday's session. Your deadlift form is looking much more stable. How did the lower back feel afterwards?", time: 'Today, 9:30 AM', read: true },
        { id: 2,  sender: 'me',   text: "Hey Marcus. Felt solid! No pain at all today, just regular muscle soreness. I think dropping the weight a bit to focus on form really helped.", time: '9:32 AM', read: true },
        { id: 3,  sender: 'them', text: "Perfect. Let's keep it at that weight for the next two weeks before we start progressing again. I've updated your program block. Also, great job on the macros today. Let's adjust your protein intake slightly upwards for recovery.", time: '9:35 AM', read: true },
        { id: 4,  sender: 'me',   text: "Sounds like a plan. I'll check the updated program. Thanks!", time: '9:37 AM', read: true },
        { id: 5,  sender: 'them', text: "Also — sleep is everything right now. Are you hitting 7–8 hours? Recovery won't happen otherwise, no matter how good the training is.", time: '10:40 AM', read: true },
        { id: 6,  sender: 'me',   text: "Honestly been around 6.5h. Will work on it this week!", time: '10:41 AM', read: true },
        { id: 7,  sender: 'them', text: "Great job on the macros today 💪 Keep that up and we'll see serious results by the end of the block.", time: '10:42 AM', read: false },
      ]
    },
    {
      id: 2,
      name: 'Coach Elena',
      role: 'Nutrition Coach',
      initial: 'E',
      color: '#059669',
      isOnline: false,
      lastMessage: 'Did you manage to hit your...',
      lastTime: 'Yesterday',
      unread: 0,
      isGroup: false,
      messages: [
        { id: 1, sender: 'them', text: "Hi! Hope your meal prep went well this week 🥗 Did you manage to hit your calorie targets on all days?", time: 'Yesterday, 2:00 PM', read: true },
        { id: 2, sender: 'me',   text: "Pretty well! Missed Sunday a bit, went out with friends. But Mon–Sat was on point.", time: '2:05 PM', read: true },
        { id: 3, sender: 'them', text: "That's a 6/7 week — really solid! Social meals are totally fine. Just try to make protein the priority when eating out.", time: '2:08 PM', read: true },
        { id: 4, sender: 'me',   text: "Good tip, will keep that in mind 🙏", time: '2:10 PM', read: true },
      ]
    },
    {
      id: 3,
      name: 'Team Hypertrophy',
      role: 'Group · 8 members',
      initial: '👥',
      color: '#7C3AED',
      isOnline: true,
      lastMessage: "Mike: Who's hitting legs tom...",
      lastTime: 'Tuesday',
      unread: 5,
      isGroup: true,
      messages: [
        { id: 1, sender: 'them', text: "🏋️ Weekly check-in time! Drop your top lift of the week below 👇", time: 'Tuesday, 8:00 AM', read: true },
        { id: 2, sender: 'me',   text: "315 lbs Deadlift × 3 reps — new PR!", time: '8:15 AM', read: true },
        { id: 3, sender: 'them', text: "LETS GOOO 🔥🔥 Alex killing it as always!", time: '8:16 AM', read: true },
        { id: 4, sender: 'them', text: "Mike: Who's hitting legs tomorrow? Let's go at 7am at the main gym", time: '8:20 AM', read: false },
      ]
    }
  ];

  /* ── Computed ── */
  get activeConv(): Conversation {
    return this.conversations.find(c => c.id === this.activeConvId()) ?? this.conversations[0];
  }

  get filteredConvs(): Conversation[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.conversations;
    return this.conversations.filter(c => c.name.toLowerCase().includes(q));
  }

  get totalUnread(): number {
    return this.conversations.reduce((s, c) => s + c.unread, 0);
  }

  /* ── Group messages by date separator ── */
  getMessageGroups(): { isDate: boolean; text?: string; msg?: ChatMessage }[] {
    const result: { isDate: boolean; text?: string; msg?: ChatMessage }[] = [];
    let lastDate = '';
    for (const msg of this.activeConv.messages) {
      const datePart = msg.time.includes(',') ? msg.time.split(',')[0] : '';
      if (datePart && datePart !== lastDate) {
        result.push({ isDate: true, text: msg.time.includes(',') ? msg.time : '' });
        lastDate = datePart;
      }
      result.push({ isDate: false, msg });
    }
    return result;
  }

  /* ── Actions ── */
  selectConv(id: number): void {
    this.activeConvId.set(id);
    const conv = this.conversations.find(c => c.id === id);
    if (conv) { conv.unread = 0; conv.messages.forEach(m => m.read = true); }
    this.shouldScrollBottom = true;
    this.showMobileConvList = false;
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text) return;

    const conv = this.activeConv;
    conv.messages.push({
      id: Date.now(),
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      read: false
    });
    conv.lastMessage = text.slice(0, 30) + (text.length > 30 ? '…' : '');
    conv.lastTime = 'Just now';
    conv.unread = 0;

    this.newMessage = '';
    this.shouldScrollBottom = true;

    // Simulate coach typing + reply
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => { this.isTyping = true; this.shouldScrollBottom = true; }, 800);
      this.typingTimer = setTimeout(() => {
        this.isTyping = false;
        const replies = [
          "Got it! I'll adjust your plan accordingly 💪",
          "Perfect, keep up the great work. Consistency is key!",
          "Noted! We'll review this in our next session.",
          "Awesome progress! Stay focused and trust the process 🔥",
          "Great question. Let me check your metrics and get back to you shortly.",
        ];
        conv.messages.push({
          id: Date.now() + 1,
          sender: 'them',
          text: replies[Math.floor(Math.random() * replies.length)],
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          read: true
        });
        conv.lastMessage = conv.messages[conv.messages.length - 1].text.slice(0, 30) + '…';
        conv.lastTime = 'Just now';
        this.shouldScrollBottom = true;
      }, 2800);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  goBackToList(): void { this.showMobileConvList = true; }

  /* ── Lifecycle ── */
  ngOnInit(): void { this.shouldScrollBottom = true; }
  ngOnDestroy(): void { clearTimeout(this.typingTimer); }

  ngAfterViewChecked(): void {
    if (this.shouldScrollBottom && isPlatformBrowser(this.platformId) && this.messagesEnd?.nativeElement) {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.shouldScrollBottom = false;
    }
  }

  trackById(_: number, item: { id: number }): number { return item.id; }

  trackByGroup(index: number, _: any): number { return index; }
}
