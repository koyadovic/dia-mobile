import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DiaTimelineService } from '../../services/dia-timeline-service';
import { ItemSliding } from 'ionic-angular';

@Component({
  selector: 'food-component',
  templateUrl: 'food.html'
})
export class FoodComponent {
  @Input() food;

  @Output() foodChanges = new EventEmitter<any>();
  @Output() foodMessage = new EventEmitter<string>();

  constructor(private timelineService: DiaTimelineService) {
  }

  doClick(){
    // selección del alimento
  }

  edit(item) {
    // edición del alimento
    item.close();
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
    item.close();
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
