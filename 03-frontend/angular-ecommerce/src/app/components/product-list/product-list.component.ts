import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoriId: number = 1;
  searchMode: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousKeyword: string = null;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }
  handleSearchProducts() {
    
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    if (keyword != this.previousKeyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;

    this.productService.searchProductsPaginate(
      this.pageNumber - 1,
      this.pageSize,
      keyword).subscribe(this.processResult());
  }

  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // Check if there is a different category than previous
    // If there is, set the page number back to 1
    if (this.previousCategoriId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoriId = this.currentCategoryId;
    
    // now get the products for the given category id
    this.productService.getProductListPaginate(
      this.pageNumber - 1, // Pagination component is 1 based, spring data REST is 0 based.
      this.pageSize, 
      this.currentCategoryId).
      subscribe(this.processResult());
  }
  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
  
}
