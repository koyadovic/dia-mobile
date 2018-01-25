import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ItemSliding } from 'ionic-angular';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { AlertController } from 'ionic-angular';


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
  @Input() food;

  @Input() showCarbs:boolean = false;
  @Input() showProteins:boolean = false;
  @Input() showFats:boolean = false;
  @Input() showFiber:boolean = false;
  @Input() showAlcohol:boolean = false;
  @Input() showKCal:boolean = false;

  @Output() foodChanges = new EventEmitter<any>();
  @Output() foodMessage = new EventEmitter<string>();

  @Output() foodSelection = new EventEmitter<any>();

  @Input() currentlySelected: boolean;
  @Output() foodUnSelection = new EventEmitter<any>();

  editMode:boolean = false;
  selectionMode:boolean = false;

  constructor(private timelineService: DiaTimelineService,
              private alertCtrl: AlertController) {
  }

  getFoodDetails() {
    if (!!this.food.source_name && !!this.food.source_id && Object.keys(this.food).length == 4) {
      this.timelineService.searchedFoodDetails(this.food.source_name, this.food.source_id).subscribe(
        (foodResponse) => {
          this.food = foodResponse;
        }
      )
    }
  }

  doClick(){ // selection
    if(!this.selectionMode && !this.editMode) {
      this.getFoodDetails();
      this.selectionMode = true;
    }
  }
  unselect(item) {
    item.close();
    this.foodUnSelection.emit(this.food);
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
            // alimento a tomar por culo
            this.timelineService.deleteFood(this.food).subscribe(
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
    this.timelineService.favoriteFood(this.food, fav).subscribe(
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

  save(item:ItemSliding) {
    if(item !== null) item.close();

    if(!!this.food.source_name) {
      this.timelineService.searchedFoodDetails(this.food.source_name, this.food.source_id).subscribe(
        (food) => {
          this.timelineService.saveFood(food).subscribe(
            (food) => {
              this.foodMessage.emit('Food saved');
              this.foodChanges.emit();
            },
            (err) => {
              console.log(err);
            }
          );
        }
      );
    } else {
      this.timelineService.saveFood(this.food).subscribe(
        (food) => {
          this.foodMessage.emit('Food saved');
          this.foodChanges.emit();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  round(n: number){
    return Math.round(n * 10.) / 10.;
  }

  selection(){
    if(!!this.food.g_or_ml_selected) {
      return `${this.food.g_or_ml_selected}g`;
    } else if(!!this.food.units_selected) {
      return `${this.food.units_selected}u`;
    }
  }

  kcal(){
    let f = this.food;
    let weight = this.weight();
    return this.round((+f.carb_factor * weight * 4.) + (+f.protein_factor * weight * 4.) + (+f.fat_factor * weight * 9.) + (+f.alcohol_factor * weight * 7.));
  }

  weight() {
    let f = this.food;
    let weight;
    if(this.food.g_or_ml_per_unit > 0) { // units
      if(!f.units_selected) {
        weight = 0.0;
      } else {
        weight = +f.units_selected * f.g_or_ml_per_unit;
      }
    } else {
      if(!f.g_or_ml_selected) {
        weight = 0.0;
      } else {
        weight = +f.g_or_ml_selected;
      }
      
    }
    return weight;
  }
}
