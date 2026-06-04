import { Component } from '@angular/core';
import { ChatbotComponent } from '../../../shared/components/chatbot/chatbot.component';

@Component({
  selector: 'app-home',
  imports: [ChatbotComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
