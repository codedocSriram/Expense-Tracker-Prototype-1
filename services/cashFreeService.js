const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST430329ae80e0f32e41a393d78b923034",
  "TESTaf195616268bd6202eeb3bf8dc458956e7192a85"
);

exports.createOrder = async (
  orderId,
  orderAmount,
  orderCurrency = "IND",
  customerID,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,

      customer_details: {
        customer_id: customerID,
        customer_phone: customerPhone
      },

      order_meta: {
        // "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}",
        return_url: "http://localhost:4000/api/payment-status/" + orderId,
        payment_methods: "ccc, upi, nb"
      },
      order_expiry_time: formattedExpiryDate //!? Set the valid expiry date
    };

    const response = await cashfree.PGCreateOrder(request);
    return response.data.payment_session_id;
  } catch (error) {
    console.error("Error creating order:", error.message);
  }
};

exports.getPaymentStatus = async orderId => {
  try {
    console.log();
    console.log();
    console.log(orderId);
    console.log();
    console.log();
    const response = await cashfree.PGOrderFetchPayments(orderId);

    let getOrderResponse = response.data;
    console.log("Order response: " + getOrderResponse);
    let orderStatus;

    if (
      getOrderResponse.filter(
        transaction => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.filter(
        transaction => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }

    return orderStatus;
  } catch (error) {
    console.error("Error fetching order status:", error.message);
  }
};
