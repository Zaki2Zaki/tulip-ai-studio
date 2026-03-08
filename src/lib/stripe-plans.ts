export const PLANS = {
  student: {
    product_id: "prod_U73ucXZUDlV6u7",
    price_id: "price_1T8pmkGhioanH6UhMjs1DSAG",
    name: "Student",
  },
  individual: {
    product_id: "prod_U73ugadrNUCtJR",
    price_id: "price_1T8pn8GhioanH6UhCGk9eF9D",
    name: "Individual",
  },
} as const;

export const PAY_PER_USE = {
  advanced_search: {
    product_id: "prod_U74B5MlXrZmKKS",
    price_id: "price_1T8q3aGhioanH6Uh11P3AFVc",
    name: "Advanced Search",
    price: "$0.99",
  },
  paper_bundle: {
    product_id: "prod_U74D0xDKyCjCjq",
    price_id: "price_1T8q51GhioanH6UhcyrgM24W",
    name: "Paper Bundle",
    price: "$2.99",
  },
  premium_searches_10: {
    product_id: "prod_U74D3nh3rlpggM",
    price_id: "price_1T8q5NGhioanH6UhQNZXTsN6",
    name: "10 Premium Searches",
    price: "$5.00",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByProductId(productId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.product_id === productId) return key as PlanKey;
  }
  return null;
}
