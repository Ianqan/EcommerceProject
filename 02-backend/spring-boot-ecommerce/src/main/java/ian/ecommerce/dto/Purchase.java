package ian.ecommerce.dto;

import ian.ecommerce.entity.Address;
import ian.ecommerce.entity.Customer;
import ian.ecommerce.entity.Order;
import ian.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
