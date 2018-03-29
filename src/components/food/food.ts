import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ItemSliding } from 'ionic-angular';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { AlertController } from 'ionic-angular';
import { FoodListable, InternetFoodList, DiaFood, selection_kcal, weight, FoodDetailable, FoodSelected } from '../../models/food-model';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'food-component',
  templateUrl: 'food.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate(300, style({opacity: 1})) 
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(300, style({opacity: 0})) 
      ])
    ])
  ]

})
export class FoodComponent {
  @Input() food: InternetFoodList | FoodListable | FoodDetailable;

  @Input() showCarbs:boolean = false;
  @Input() showProteins:boolean = false;
  @Input() showFats:boolean = false;
  @Input() showFiber:boolean = false;
  @Input() showAlcohol:boolean = false;
  @Input() showKCal:boolean = false;

  @Output() foodChanges = new EventEmitter<any>();
  @Output() foodMessage = new EventEmitter<string>();
  @Output() foodSelection = new EventEmitter<FoodSelected>();

  @Output() selectingFood = new EventEmitter<boolean>();
  @Output() editingFood = new EventEmitter<boolean>();

  editMode:boolean = false;
  selectionMode:boolean = false;
  selectionModeFood: FoodSelected = null;

  constructor(private timelineService: DiaTimelineService,
              private translate: TranslateService,
              private alertCtrl: AlertController) {
  }

  doClick(){ // selection
    if(!this.selectionMode && !this.editMode) {
      if(!('carb_factor' in this.food) || !('protein_factor' in this.food) || !('fat_factor' in this.food)) {
        // it's InternetFoodList
        if('source_name' in this.food && 'source_id' in this.food) {
          this.timelineService.searchedFoodDetails(<InternetFoodList>this.food).subscribe(
            food => {
              this.food = food;
              this.openSelection();
            }
          );
        } else {
          console.error('!!!')
        }
      } else {
        this.openSelection();
      }
    }
  }

  openSelection() {
    this.selectingFood.emit(true);
    this.selectionModeFood = {
      food: <FoodDetailable>this.food,
      carb_g: 0,
      protein_g: 0,
      fat_g: 0,
      fiber_g: 0,
      alcohol_g: 0,
      selection: "",
    }
    this.selectionMode = true;
  }

  selectionFinishedCallback(foodSelected: FoodSelected) {
    // food here it's a copy, not a reference
    if(foodSelected !== null) {
      this.translate.get('Added to food selected list').subscribe(message => this.foodMessage.emit(message));
      this.foodSelection.emit(foodSelected);
    }
    setTimeout(() => { this.selectionMode = false; this.selectionModeFood = null; }, 100);
    this.selectingFood.emit(false);
  }

  edit(item) {
    // edición del alimento
    item.close();
    this.editingFood.emit(true);
    setTimeout(() => this.editMode = true, 500);
  }

  editFinishedCallback(save:boolean) {
    setTimeout(() => this.editMode = false, 100);
    if(save) {
      this.save(null);
    }
    this.editingFood.emit(false);
  }

  delete(item:ItemSliding) {
    item.close();

    forkJoin(
      this.translate.get('Confirm delete'),
      this.translate.get('Do you want to delete this food?'),
      this.translate.get('Cancel'),
      this.translate.get('Delete'),
    ).subscribe(([title, mess, cancelText, deleteText]) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: mess,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: deleteText,
            handler: () => {
              this.timelineService.deleteFood(<DiaFood>this.food).subscribe(
                (result) => {
                  this.translate.get('Food deleted').subscribe(message => this.foodMessage.emit(message));
                  this.foodChanges.emit();
                }
              );
            }
          }
        ]
      });
      alert.present();
    })
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
        console.error(err);
      }
    )
  }

  private saveDiaFood(food: DiaFood) {
    this.timelineService.saveFood(<DiaFood>this.food).subscribe(
      (food) => {
        this.foodMessage.emit('Food saved');
        this.foodChanges.emit();
      },
      (err) => {console.error(err)}
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

  isDiaFood() {
    return 'id' in this.food;
  }

  isDetailedFood() {
    return this.isDiaFood() || 'carb_factor' in this.food;
  }
}
