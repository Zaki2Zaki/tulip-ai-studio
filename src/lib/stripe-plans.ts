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

export type PlanKey = keyof typeof PLANS;

export function getPlanByProductId(productId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.product_id === productId) return key as PlanKey;
  }
  return null;
}
