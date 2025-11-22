const cashfree = Cashfree({
  mode: "sandbox"
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  const userToken = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:4000/api/pay", {
      method: "POST",
      headers: { autherization: userToken }
    });

    const data = await response.json();
    const paymentSessionId = data.paymentSessionId;
    const orderId = data.orderId;

    let checkoutOptions = {
      paymentSessionId: paymentSessionId,

      redirectTarget: "_modal"
    };

    const result = await cashfree.checkout(checkoutOptions);

    if (result.error) {
      console.log(
        "User has closed the popup or there is some payment error, Check for Payment Status"
      );
      console.log(result.error);
    }
    if (result.redirect) {
      console.log("Payment will be redirected");
    }
    if (result.paymentDetails) {
      console.log("Payment has been completed, Check for Payment Status");
      console.log(result.paymentDetails.paymentMessage);

      const response = await fetch(
        `http://localhost:4000/api/payment-status/${orderId}`,
        {
          method: "GET"
        }
      );
      const data = await response.json();
      alert("Your payment is " + data.orderStatus);
    }
  } catch (err) {
    console.error("Error:", err);
  }
});
