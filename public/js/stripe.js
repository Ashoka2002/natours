import { showAlert } from "./alerts";

/*eslint-disable*/

export const bookTour = async tourId => {
  const stripe = Stripe(
    "pk_test_51OYqOmSAt6acu8Cyg6Rv7t6wOm2DUsq7mTPNcuFxxlU1YAaPSX8IAKlXEpLXIHLUInzZXQZN03qera2yQtEGqCC2002Oc3q4ww"
  );
  // 1) get the session from api
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) create checkout form + charge card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err.message);
  }
};
