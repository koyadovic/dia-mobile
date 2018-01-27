import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ItemSliding } from 'ionic-angular';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { AlertController } from 'ionic-angular';
import { FoodListable, InternetFoodList, DiaFood, selection_kcal, weight, FoodDetailable, FoodSelected } from '../../models/food-model';

@Component({
  selector: 'food-component',
  templateUrl: 'food.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0, height: 0}),
        animate(300, style({opacity: 1, height:'*'})) 
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(300, style({opacity: 0, height: 0})) 
      ])
    ])
  ]

})
export class FoodComponent {
  @Input() food: FoodListable | FoodDetailable;

  @Input() showCarbs:boolean = false;
  @Input() showProteins:boolean = false;
  @Input() showFats:boolean = false;
  @Input() showFiber:boolean = false;
  @Input() showAlcohol:boolean = false;
  @Input() showKCal:boolean = false;

  @Output() foodChanges = new EventEmitter<any>();
  @Output() foodMessage = new EventEmitter<string>();
  @Output() foodSelection = new EventEmitter<any>();

  editMode:boolean = false;
  selectionMode:boolean = false;

  constructor(private timelineService: DiaTimelineService,
              private alertCtrl: AlertController) {
  }

  getFoodDetails() {
    this.timelineService.searchedFoodDetails(<InternetFoodList>this.food).subscribe(
      (foodResponse) => {
        this.food = foodResponse;
      }
    );
  }

  doClick(){ // selection
    if(!this.selectionMode && !this.editMode) {
      this.getFoodDetails();
      this.selectionMode = true;
    }
  }

  selectionFinishedCallback(food) {
    // food here it's a copy, not a reference
    setTimeout(() => this.selectionMode = false, 100);

    if(food !== null) {
      this.foodMessage.emit('Added to food selected list');
      this.foodSelection.emit(food);
    }
  }

  edit(item) {
    // edición del alimento
    item.close();
    setTimeout(() => this.editMode = true, 500);
  }

  editFinishedCallback(save:boolean) {
    setTimeout(() => this.editMode = false, 100);
    if(save) {
      this.save(null);
    }
  }

  delete(item:ItemSliding) {
    item.close();
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this food?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.timelineService.deleteFood(<DiaFood>this.food).subscribe(
              (result) => {
                this.foodMessage.emit('Food deleted');
                this.foodChanges.emit();
              }
            );
          }
        }
      ]
    });
    alert.present();
  }

  favorite(item:ItemSliding, fav:boolean) {
    item.close();
    this.timelineService.favoriteFood(<DiaFood>this.food, fav).subscribe(
      (resp) => {
        if(fav) {
          this.foodMessage.emit('Food favorited');
        } else {
          this.foodMessage.emit('Food unfavorited');
        }
        this.foodChanges.emit();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  private saveDiaFood(food: DiaFood) {
    this.timelineService.saveFood(<DiaFood>this.food).subscribe(
      (food) => {
        this.foodMessage.emit('Food saved');
        this.foodChanges.emit();
      },
      (err) => {console.log(err)}
    );
  }

  save(item:ItemSliding) {
    if(item !== null) item.close();

    if('source_name' in this.food && 'source_id' in this.food) {
      // it's a  InternetFood
      if('carb_g' in this.food) {
        // it's a InternetFoodDetail, direct saving ...
        this.saveDiaFood(<DiaFood>this.food);
      } else {
        // it's InternetFoodList, first retrieving details of the food.
        this.timelineService.searchedFoodDetails(<InternetFoodList>this.food).subscribe(
          (foodResponse) => {
            this.food = foodResponse;
            // saving
            this.saveDiaFood(<DiaFood>this.food);
          }
        );
      }
    } else {
      // It's DiaFood, direct save
      this.saveDiaFood(<DiaFood>this.food);
    }
  }

  // useful for templates. Maybe we can code a pipe for this type of round
  round(n: number){ return Math.round(n * 10.) / 10.; }

  selection(){

  }

  isDiaFood() {
    return 'id' in this.food;
  }

  isDetailedFood() {
    return this.isDiaFood() || 'carb_factor' in this.food;
  }
}
