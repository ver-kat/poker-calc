import { Component, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Poker Calc';
  formModel: FormGroup;
  pocketCardGroupName = "Pocket";
  flopCardGroupName = "Flop";
  turnCardGroupName = "Turn";
  riverCardGroupName = "River";
  //each CardGroup specifies the number of cards in that group
  pocketCardGroup: CardGroup = new CardGroup(2, this.pocketCardGroupName);
  flopCardGroup: CardGroup = new CardGroup(3, this.flopCardGroupName);
  turnCardGroup: CardGroup = new CardGroup(1, this.turnCardGroupName);
  riverCardGroup: CardGroup = new CardGroup(1, this.riverCardGroupName);
  cardGroupArray = [
    this.pocketCardGroup,
    this.flopCardGroup,
    this.turnCardGroup,
    this.riverCardGroup ];
  //names of possible hands
  pokerHandsArray = [
    "Straight flush",
    "Four of a kind",
    "Full house",
    "Flush",
    "Straight",
    "Three of a kind",
    "Two pair",
    "One pair",
    "High card"
  ]
  //values for probability of each hand, at each stage of the game
  probabilitiesPocket = Array(this.pokerHandsArray.length).fill(null); 
  probabilitiesFlop = Array(this.pokerHandsArray.length).fill(null); 
  probabilitiesTurn = Array(this.pokerHandsArray.length).fill(null); 
  probabilitiesRiver = Array(this.pokerHandsArray.length).fill(null); 

  constructor() {
    //creating the FormGroups, 
    //the allSelectedValidator makes sure there are selections for each card in a group
    //onChange uses this to determine if hand probability can be calculated and the next group can be enabled
    this.formModel = new FormGroup({
      'Pocket': new FormGroup({
        'cardRank0': new FormControl(),
        'cardSuit0': new FormControl(),
        'cardRank1': new FormControl(),
        'cardSuit1': new FormControl()
      }, this.allSelectedValidator),
      'Flop': new FormGroup({
        'cardRank0': new FormControl({value: '', disabled: true}),
        'cardSuit0': new FormControl({value: '', disabled: true}),
        'cardRank1': new FormControl({value: '', disabled: true}),
        'cardSuit1': new FormControl({value: '', disabled: true}),
        'cardRank2': new FormControl({value: '', disabled: true}),
        'cardSuit2': new FormControl({value: '', disabled: true})
      }, this.allSelectedValidator),
      'Turn': new FormGroup({
        'cardRank0': new FormControl({value: '', disabled: true}),
        'cardSuit0': new FormControl({value: '', disabled: true})
      }, this.allSelectedValidator),
      'River': new FormGroup({
        'cardRank0': new FormControl({value: '', disabled: true}),
        'cardSuit0': new FormControl({value: '', disabled: true})
      }, this.allSelectedValidator),
    });
  }


  //makes sure there are selections for each card in a group
  allSelectedValidator({value}: FormGroup): {[key: string]: any} {
    const values = Object.keys(value || {});
    const valid = values.every(v => value[v] != "" && value[v] != null);
    return valid ? null : {allSelected : true};
  }

  //checks to see if a card group is complete/selected, and if so, calculates hand probability after that group,
  //and then enables the next card group
  onChange(cardGroupName: string) {
    switch(cardGroupName) {
      case this.pocketCardGroupName:
        if (this.formModel.get(this.pocketCardGroupName).valid){
          this.calculateProbability(this.pocketCardGroupName);
          this.formModel.controls['Flop'].enable();
        }
        break;
      case this.flopCardGroupName:
        if (this.formModel.get(this.flopCardGroupName).valid){
          this.calculateProbability(this.flopCardGroupName);
          this.formModel.controls['Turn'].enable();
        }
        break;
      case this.turnCardGroupName:
        if (this.formModel.get(this.turnCardGroupName).valid){
          this.calculateProbability(this.turnCardGroupName);
          this.formModel.controls['River'].enable();
        }
        break;
      default:
        if (this.formModel.get(this.riverCardGroupName).valid) {
          //last card group so no card group to be enabled
          //calculate probability will determine final hand in this case
          this.calculateProbability(this.riverCardGroupName);
        }
    }
  }
    
  //currently contains fake math, not actually probability calculation.
  //Find libraries to do these calculations for us!
  calculateProbability(cardGroupName) {
    console.log(this.formModel.value);
    switch(cardGroupName) {
      case this.pocketCardGroupName:
        for (var i = 0, len = this.probabilitiesPocket.length; i < len; i++) {
          this.probabilitiesPocket[i] = (i + 5) * .01;
        }
        break;
      case this.flopCardGroupName:
        for (var i = 0, len = this.probabilitiesFlop.length; i < len; i++) {
          this.probabilitiesFlop[i] = (i + 5) * .02;
        }
        break;
      case this.turnCardGroupName:
        for (var i = 0, len = this.probabilitiesTurn.length; i < len; i++) {
          this.probabilitiesTurn[i] = (i + 5) * .01;
        }
        break;
      case this.riverCardGroupName:
          this.probabilitiesRiver[7]  = 1;

        break;
    }
  }
}

//represents how many cards are in each group dealt and shown on the page
export class CardGroup {
  cardGroupName = "Default";
  numberOfCards = 0;
  //used to iterate in the markup with ngFor, is there a better way?
  cardArray = [];
  //used to iterate in the markup to create each card widget
  aCard = new Card();

  constructor(numberOfCards, name) {
    this.cardGroupName = name;
    this.numberOfCards = numberOfCards;
    this.cardArray = Array(this.numberOfCards).fill(4); // a hack to get an array of numberOfCards [4,4,4,4,4]
  }
}

//represents a card, suit and rank
export class Card  {
  cardSuits: {key: string, value: string}[] = [
    {key: "D" , value: "Diamonds"},
    {key: "C" , value: "Clubs"},
    {key: "S" , value: "Spades"},
    {key: "H" , value: "Hearts"}
  ];

  cardRanks: {key: number, value: string}[] = [
    {key: 2 , value: "2"},
    {key: 3 , value: "3"},
    {key: 4 , value: "4"},
    {key: 5 , value: "5"},
    {key: 6 , value: "6"},
    {key: 7 , value: "7"},
    {key: 8 , value: "8"},
    {key: 9 , value: "9"},
    {key: 10 , value: "10"},
    {key: 11 , value: "J"},
    {key: 12 , value: "Q"},
    {key: 13 , value: "K"},
    {key: 14 , value: "A"}
  ];
}