import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {
    
    // check if the item has been already added in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    // find the item if exists
    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(item => item.id === cartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    
    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(cartItem);
    }
    this.computeCartTotals();
    
  }

  computeCartTotals() {
    let totalPriceVal: number = 0;
    let totalQuantityVal: number = 0;

    for (let item of this.cartItems) {
      totalPriceVal += item.unitPrice * item.quantity;
      totalQuantityVal += item.quantity;
    }

    // publish to all subscribers
    this.totalPrice.next(totalPriceVal);
    this.totalQuantity.next(totalQuantityVal);
    // console.log(`${totalPriceVal}`);
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity == 0) {
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(item => item.id == cartItem.id);
    
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
