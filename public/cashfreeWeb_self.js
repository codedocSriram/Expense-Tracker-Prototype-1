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

    let checkoutOptions = {
      paymentSessionId: paymentSessionId,

      redirectTarget: "_self"
    };

    await cashfree.checkout(checkoutOptions);
  } catch (err) {
    console.error("Error:", err);
  }
});
