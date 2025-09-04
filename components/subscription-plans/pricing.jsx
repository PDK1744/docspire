"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircleIcon, XCircleIcon } from "lucide-react"; // ✅ add X icon for not included

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Pricing() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("/api/subscription-plans")
      .then((res) => res.json())
      .then((data) => setPlans(data.plans));
  }, []);

  const handleSubscribe = async (priceId) => {
    const stripe = await stripePromise;
    const { sessionId } = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    }).then((res) => res.json());

    console.log("Checkout Session Response:", sessionId);

    const result = await stripe.redirectToCheckout({ sessionId });
    // if (result.error) {
    //   console.error(result.error.message);
    // }
  };

  return (
    <div className="py-12 bg-base-100">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Choose a Subscription Plan</h1>
        <p className="text-lg text-base-content/70">
          Select the plan that fits your needs
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="card bg-base-200 shadow-xl border border-base-300"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl">{plan.name}</h2>
              <p className="text-base-content/70">{plan.description}</p>

              <div className="my-4">
                <span className="text-3xl font-bold">${plan.price / 100}</span>
                <span className="text-base-content/70"> / {plan.interval}</span>
              </div>

              {/* ✅ Features Section */}
              <ul className="space-y-2 mb-6">
                {plan.name === "Free Plan" && (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-success" />
                      <span>Up to 2 users</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-success" />
                      <span>25 documents</span>
                    </li>
                    {/* <li className="flex items-center gap-2 text-base-content/60">
                      <XCircleIcon className="w-5 h-5 text-error" />
                      <span>Unlimited users</span>
                    </li>
                    <li className="flex items-center gap-2 text-base-content/60">
                      <XCircleIcon className="w-5 h-5 text-error" />
                      <span>Unlimited documents</span>
                    </li> */}
                    <li className="flex items-center gap-2 text-base-content/60">
                      <XCircleIcon className="w-5 h-5 text-error" />
                      <span>New features included</span>
                    </li>
                  </>
                )}

                {plan.name === "Pro Plan" && (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-success" />
                      <span>Unlimited users</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-success" />
                      <span>Unlimited documents</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-success" />
                      <span>
                        Access to all new features (Pro plans only)
                      </span>
                    </li>
                  </>
                )}
              </ul>

              <div className="card-actions justify-end">
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className="btn btn-primary w-full hover:btn-success hover:text-success-content"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
