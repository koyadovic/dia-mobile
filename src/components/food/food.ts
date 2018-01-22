import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ItemSliding } from 'ionic-angular';
import { style, state, animate, transition, trigger } from '@angular/animations';


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

  @Output() foodChanges = new EventEmitter<any>();
  @Output() foodMessage = new EventEmitter<string>();

  @Output() foodSelection = new EventEmitter<any>();

  editMode:boolean = false;
  selectionMode:boolean = false;

  constructor(private timelineService: DiaTimelineService) {
  }

  doClick(){
    if(!this.selectionMode && !this.editMode)
      this.selectionMode = true;
  }

  selectionFinishedCallback(data) {
    setTimeout(() => this.selectionMode = false, 100);

    if(data !== null) {
      let food = JSON.parse(JSON.stringify(this.food));
      this.foodSelection.emit(food);
    }

    this.food.g_or_ml_selected = null;
    this.food.units_selected = null;
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
    // alimento a tomar por culo
    this.timelineService.deleteFood(this.food).subscribe(
      (result) => {
        this.foodMessage.emit('Food deleted');
        this.foodChanges.emit();
      }
    )
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
}
