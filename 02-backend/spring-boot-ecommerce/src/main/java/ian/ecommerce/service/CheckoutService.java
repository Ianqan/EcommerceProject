package ian.ecommerce.service;

import ian.ecommerce.dto.Purchase;
import ian.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
