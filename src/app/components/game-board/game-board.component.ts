import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScoreBoardComponent } from '../score-board/score-board.component';
import { CommonModule } from '@angular/common';

interface Card {
  id: number;
  image: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [ScoreBoardComponent, CommonModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  matches: number = 0;
  errors: number = 0;
  playerName: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.playerName = localStorage.getItem('playerName') || prompt('Enter your name') || 'Player';
    localStorage.setItem('playerName', this.playerName);
    this.loadCards();
  }

  loadCards() {
    this.http.get<any>('https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=8')
      .subscribe(response => {
        const images = response.entries.map((entry: any) => entry.fields.image.url);
        this.cards = this.shuffle([...images, ...images].map((image, index) => ({
          id: index,
          image,
          flipped: false,
          matched: false
        })));
      });
  }

  flipCard(card: Card) {
    if (card.flipped || card.matched || this.flippedCards.length >= 2) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    if (first.image === second.image) {
      first.matched = second.matched = true;
      this.matches++;
    } else {
      this.errors++;
      setTimeout(() => {
        first.flipped = second.flipped = false;
      }, 1000);
    }
    this.flippedCards = [];
  }

  shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
