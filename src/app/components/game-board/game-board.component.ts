import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { ImageServiceService } from '../../services/image-service.service';
import { Card } from '../../interfaces/card.interface';
import { catchError, of, timer } from 'rxjs';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  matches: number = 0;
  errors: number = 0;
  playerName: string = '';
  gameCompleted: boolean = false;

  private readonly flipDelay = 1000;

  constructor(private imageService: ImageServiceService) { }

  ngOnInit() {
    this.initializePlayerName();
    this.loadCards();
  }

  private initializePlayerName() {
    const storedName = localStorage.getItem('playerName');

    if (!storedName) {
      const name = prompt('Enter your name') || 'Player';
      localStorage.setItem('playerName', name);
      this.playerName = name;
    } else {
      this.playerName = storedName;
    }
  }

  loadCards() {
    this.imageService.getImages()
      .pipe(
        catchError(() => {
          console.error('Error fetching images');
          return of({ entries: [] });
        })
      )
      .subscribe(response => {
        const images = this.extractImages(response);
        this.cards = this.shuffleCards(images);
        this.resetGameState();
      });
  }

  private extractImages(response: any): string[] {
    return (response.entries ? Array.from(response.entries as any[]) : [])
      .map((entry: any) => entry.fields.image.url);
  }

  private shuffleCards(images: string[]): Card[] {
    return this.shuffle([...images, ...images].map((image, index) => ({
      id: index,
      image,
      flipped: false,
      matched: false
    })));
  }

  flipCard(card: Card) {
    if (this.isCardUnflippable(card)) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  private isCardUnflippable(card: Card): boolean {
    return card.flipped || card.matched || this.flippedCards.length >= 2;
  }

  private checkMatch() {
    const [first, second] = this.flippedCards;
    if (first.image === second.image) {
      this.handleMatch(first, second);
    } else {
      this.handleMismatch(first, second);
    }
    this.flippedCards = [];
  }

  private handleMatch(first: Card, second: Card) {
    first.matched = second.matched = true;
    this.matches++;
    this.checkWinCondition();
  }

  private handleMismatch(first: Card, second: Card) {
    this.errors++;
    timer(this.flipDelay).subscribe(() => {
      first.flipped = second.flipped = false;
    });
  }

  private resetGameState() {
    this.gameCompleted = false;
    this.matches = 0;
    this.errors = 0;
    this.flippedCards = [];
  }

  resetGame() {
    this.loadCards();
  }

  private checkWinCondition() {
    if (this.matches === this.cards.length / 2) {
      this.gameCompleted = true;
    }
  }

  private shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
